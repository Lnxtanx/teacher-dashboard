import { IncomingForm } from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

// Allowed file types and max size (5MB)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new IncomingForm({
    maxFileSize: MAX_FILE_SIZE,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Form parsing error', error: err.message });
    }

    const file = files.file?.[0] || files.file; // Handle both formidable v4 and older versions

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type', 
        allowedTypes: ALLOWED_TYPES 
      });
    }

    try {
      // Get teacher ID from authenticated user
      const teacherId = parseInt(req.user.id, 10);
      
      // Verify teacher exists
      const teacher = await prisma.teachers.findUnique({
        where: { id: teacherId },
      });
      
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      const fileContent = fs.readFileSync(file.filepath);
      const fileExt = file.originalFilename.split('.').pop();
      const s3Key = `timetables/teacher_${teacherId}_${Date.now()}.${fileExt}`;

      // Upload to S3
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

      // Deactivate old timetable and delete image
      const activeTimetable = await prisma.timetables.findFirst({
        where: {
          teacherId: teacherId,
          isActive: true,
        },
      });

      if (activeTimetable && activeTimetable.imageUrl) {
        try {
          // Extract S3 key correctly, handling various URL formats
          const urlParts = activeTimetable.imageUrl.split('.com/');
          if (urlParts.length > 1) {
            const oldS3Key = urlParts[1];
            await s3Client.send(new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: oldS3Key,
            }));
          }
        } catch (deleteErr) {
          console.error('Error deleting old image:', deleteErr);
          // Continue without failing the request
        }

        await prisma.timetables.update({
          where: { id: activeTimetable.id },
          data: { isActive: false },
        });
      }

      // Save new timetable
      const newTimetable = await prisma.timetables.create({
        data: {
          teacherId: teacherId,
          imageUrl: imageUrl,
          isActive: true,
          updatedAt: new Date(),
        },
      });

      // Clean temp file
      fs.unlinkSync(file.filepath);

      res.status(200).json({ 
        message: 'Timetable uploaded successfully', 
        timetable: {
          id: newTimetable.id,
          url: imageUrl,
          uploadedAt: newTimetable.updatedAt
        }
      });

    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      res.status(500).json({ 
        message: 'Upload failed', 
        error: uploadError.message 
      });
    }
  });
}

export default isAuthenticated(handler);