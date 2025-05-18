import prisma from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teacherId = req.user.id;

      const timetable = await prisma.timetables.findFirst({
        where: { 
          teacherId: teacherId,
          isActive: true 
        },
        select: { imageUrl: true },
      });

      if (!timetable) {
        return res.status(404).json({ message: 'No timetable found' });
      }

      res.status(200).json({ imageUrl: timetable.imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching timetable' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default isAuthenticated(handler);
