import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import prisma from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { teacherId } = req.query;

    try {      const timetable = await prisma.timetables.findFirst({
        where: { teacherId: parseInt(teacherId), isActive: true },
      });

      if (!timetable || !timetable.imageUrl) {
        return res.status(404).json({ message: 'No timetable image to delete' });
      }

      const s3Key = timetable.imageUrl.split('.com/')[1];      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
      }));

      await prisma.timetables.update({ 
        where: { id: timetable.id },
        data: { isActive: false }
      });

      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting timetable' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
