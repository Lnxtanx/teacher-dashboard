// File: pages/api/lesson/classresponse.js

import { PrismaClient } from '@prisma/client';
import { getTokenFromHeader, verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Only POST method is allowed'
    });
  }

  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded?.id || !decoded?.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const teacherId = Number(decoded.id);
    const schoolId = Number(decoded.schoolId);

    // Get values from body (not FormData)
    const { classLevel, lessonName, status, reason, imageUrl } = req.body;

    if (!classLevel || !lessonName || !status) {
      return res.status(400).json({
        success: false,
        message: 'classLevel, lessonName, and status are required'
      });
    }

    const classResponse = await prisma.classResponse.create({
      data: {
        schoolId,
        teacherId,
        classLevel,
        lessonName,
        status,
        reason: reason || null,
        imageUrl: imageUrl || null, // If you're using client-uploaded image links
        submittedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Class response submitted successfully',
      data: classResponse
    });
  } catch (error) {
    console.error('[CLASS RESPONSE ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong'
    });
  } finally {
    await prisma.$disconnect();
  }
}
