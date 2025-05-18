import prisma from '../../../lib/prisma';
import { generateToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Fetch teacher by email
      const teacher = await prisma.teachers.findUnique({
        where: {
          email,
        },
        include: {
          schools: true,
        },
      });

      // If no teacher found with the given email
      if (!teacher) {
        return res.status(400).json({ message: 'No account found with this email address.' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, teacher.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      // Generate JWT token
      const token = generateToken(teacher);

      // Return teacher data and token
      res.status(200).json({
        token,
        teacher: {
          id: teacher.id,
          teacherName: teacher.teacherName,
          email: teacher.email,
          schoolName: teacher.schools.name,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An error occurred during login.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
