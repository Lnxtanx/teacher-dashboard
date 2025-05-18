import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { getTokenFromHeader, verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Auth
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded?.id || !decoded?.schoolId) {
      return res.status(403).json({ success: false, message: 'Invalid token payload' });
    }

    const teacherId = Number(decoded.id);
    const schoolId = Number(decoded.schoolId);

    // Parse form
    const { fields, files } = await parseForm(req);
    const file = files.file && (Array.isArray(files.file) ? files.file[0] : files.file);

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filepath = file.filepath || file.path;
    const originalFilename = file.originalFilename || file.name;
    const mimetype = file.mimetype || file.type;

    if (!filepath || !fs.existsSync(filepath)) {
      return res.status(400).json({ message: 'Invalid file path' });
    }

    // File type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Only JPEG, PNG, GIF, WebP are allowed.',
        allowedTypes: validTypes
      });
    }

    // Upload to S3
    const fileContent = fs.readFileSync(filepath);
    const fileExt = originalFilename.split('.').pop();
    const s3Key = `class-images/${schoolId}/${teacherId}/${uuidv4()}.${fileExt}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Optional: Save in DB (e.g., ClassResponse table)
    // await prisma.classResponses.update({
    //   where: { id: fields.responseId },
    //   data: { image: imageUrl }
    // });

    // Cleanup
    fs.unlinkSync(filepath);

    res.status(200).json({ 
      success: true, 
      message: 'Image uploaded successfully', 
      url: imageUrl 
    });

  } catch (error) {
    console.error('[CLASS IMAGE UPLOAD ERROR]:', error.message);
    res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Upload failed' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
