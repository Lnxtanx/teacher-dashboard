import { PrismaClient } from '@prisma/client';
import { getTokenFromHeader, verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Only GET requests allowed'
    });
  }

  try {
    // Authentication & Authorization
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
        message: 'Invalid token payload'
      });
    }

    // Convert to numbers to match Prisma schema
    const teacherId = Number(decoded.id);
    const schoolId = Number(decoded.schoolId);
    const { lessonId, classId } = req.query;

    // Validate lessonId
    if (!lessonId || isNaN(Number(lessonId))) {
      return res.status(400).json({
        success: false,
        message: 'Valid lessonId is required'
      });
    }

    // Fetch the lesson PDF with related class data
    const lesson = await prisma.lessonPdf.findUnique({
      where: {
        id: Number(lessonId)
      },
      include: {
        Class: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if the user should have access to this lesson
    // Either it's a lesson for their school or a global lesson
    if (!lesson.isForAllSchools && lesson.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this lesson'
      });
    }

    // If classId is provided but doesn't match with the lesson's class, fetch that class info separately
    let className = lesson.Class?.name || null;
    
    if (classId && (!lesson.Class || Number(classId) !== lesson.Class.id)) {
      const classData = await prisma.class.findUnique({
        where: {
          id: Number(classId)
        },
        select: {
          name: true
        }
      });
      
      if (classData) {
        className = classData.name;
      }
    }

    // Return the lesson data with class name
    return res.status(200).json({
      success: true,
      data: {
        ...lesson,
        className: className
      }
    });
  } catch (error) {
    console.error('[LESSON PDF GET] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development'
        ? error.message
        : 'Database operation failed'
    });
  } finally {
    await prisma.$disconnect();
  }
}