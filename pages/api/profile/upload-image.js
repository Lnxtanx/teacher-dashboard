import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'; 
import formidable from 'formidable';
import fs from 'fs'; 
import prisma from '../../../lib/prisma'; 
import { isAuthenticated } from '../../../lib/auth';

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

// Helper to handle different formidable versions
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    // Check if formidable is a function (newer versions) or has IncomingForm (older versions)
    const form = typeof formidable === 'function' 
      ? formidable({ keepExtensions: true }) 
      : new formidable.IncomingForm({ keepExtensions: true });
    
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use the helper function to parse the form
    const { fields, files } = await parseForm(req);
    
    // Handle files from different formidable versions
    const file = files.file && (Array.isArray(files.file) ? files.file[0] : files.file);
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract file properties, handling both versions of formidable
    const filepath = file.filepath || file.path;
    const originalFilename = file.originalFilename || file.name;
    const mimetype = file.mimetype || file.type;
    
    if (!filepath || !fs.existsSync(filepath)) {
      return res.status(400).json({ message: 'Invalid file path' });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Please upload a valid image file.',
        allowedTypes: validTypes
      });
    }

    // Get the current teacher to find their existing profile image
    const currentTeacher = await prisma.teachers.findUnique({
      where: { id: req.user.id },
      select: { profileImage: true }
    });

    // Delete old image from S3 if it exists
    if (currentTeacher?.profileImage) {
      try {
        // Extract the S3 key from the URL
        const oldImageUrl = currentTeacher.profileImage;
        const urlParts = oldImageUrl.split('.com/');
        
        if (urlParts.length > 1) {
          const oldS3Key = urlParts[1];
          
          // Only try to delete if it's in our bucket (sanity check)
          if (oldS3Key.startsWith('profile-images/')) {
            await s3Client.send(new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: oldS3Key
            }));
            console.log(`Deleted old profile image: ${oldS3Key}`);
          }
        }
      } catch (deleteError) {
        // Log but don't fail the operation if deletion fails
        console.error('Failed to delete old profile image:', deleteError);
      }
    }

    const fileContent = fs.readFileSync(filepath);
    const fileExt = originalFilename.split('.').pop();
    const s3Key = `profile-images/${req.user.id}_${Date.now()}.${fileExt}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Update teacher profile with new image URL
    await prisma.teachers.update({
      where: { id: req.user.id },
      data: { profileImage: imageUrl }
    });

    // Clean up temp file
    fs.unlinkSync(filepath);

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading profile image',
      error: error.message 
    });
  }
}

export default isAuthenticated(handler);