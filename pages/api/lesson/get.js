// path: /api/lesson/get
// This API endpoint retrieves lesson PDFs for a specific class.
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
    const { classId } = req.query;
    
    // Validate numeric inputs
    if (isNaN(teacherId) || isNaN(schoolId) || isNaN(Number(classId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    // Find lessons based on classId
    // First look for school-specific lessons
    const schoolLessons = await prisma.lessonPdf.findMany({
      where: {
        classId: Number(classId),
        schoolId: schoolId
      },
      orderBy: { lessonName: 'asc' }
    });
    
    // Also get global lessons (lessons available to all schools)
    const globalLessons = await prisma.lessonPdf.findMany({
      where: {
        classId: Number(classId),
        isForAllSchools: true
      },
      orderBy: { lessonName: 'asc' }
    });
    
    // Combine and deduplicate lessons 
    // (in case a lesson exists both as global and school-specific)
    const allLessonIds = new Set();
    const combinedLessons = [];
    
    // First add school-specific lessons
    for (const lesson of schoolLessons) {
      allLessonIds.add(lesson.id);
      combinedLessons.push(lesson);
    }
    
    // Then add global lessons (if not already added)
    for (const lesson of globalLessons) {
      if (!allLessonIds.has(lesson.id)) {
        combinedLessons.push(lesson);
      }
    }
    
    // Return the lessons
    return res.status(200).json({
      success: true,
      count: combinedLessons.length,
      data: combinedLessons
    });
    
  } catch (error) {
    console.error('[LESSONS GET] Error:', error.message);
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