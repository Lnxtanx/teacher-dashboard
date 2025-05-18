import prisma from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teacherId = req.user.id;
      
      const teacher = await prisma.teachers.findUnique({
        where: { id: teacherId },
        include: {
          schools: true
        }
      });
      
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      
      // Remove sensitive information
      const { password, ...teacherData } = teacher;
      
      // Return with properly formatted fields
      res.status(200).json({
        ...teacherData,
        // Map experienceYears to experience for frontend compatibility
        experience: teacher.experienceYears,
        school: {
          schoolName: teacher.schools.name
        }
      });
    } catch (err) {
      console.error('Profile Fetch Error:', err);
      res.status(500).json({ message: 'Server error fetching profile' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default isAuthenticated(handler);