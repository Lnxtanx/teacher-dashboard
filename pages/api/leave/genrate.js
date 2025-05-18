import { PrismaClient } from '@prisma/client';
import { getTokenFromHeader, verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get and verify JWT token
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id || !decoded.schoolId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or incomplete token' });
    }

    const teacherId = decoded.id;
    const schoolId = decoded.schoolId;

    const { reason, fromDate, toDate } = req.body;

    if (!reason || !fromDate || !toDate) {
      return res.status(400).json({ message: 'Missing required fields: reason, fromDate, toDate' });
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const newLeave = await prisma.leaveApplication.create({
      data: {
        teacherId,
        schoolId,
        reason,
        fromDate: fromDateObj,
        toDate: toDateObj,
        status: 'Pending',
        createdAt: new Date(),
      },
    });

    return res.status(201).json({ message: 'Leave application submitted successfully', leave: newLeave });

  } catch (error) {
    console.error('Leave creation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
