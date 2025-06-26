// path: /api/class/get
// This API endpoint retrieves classes for a specific school.
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
    
    // Validate numeric inputs
    if (isNaN(teacherId) || isNaN(schoolId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
      // Fetch all classes (no longer school-specific)
    const classes = await prisma.class.findMany({
      orderBy: {
        name: 'asc'
      },
      orderBy: { 
        name: 'asc' 
      }
    });
    
    // Return the classes
    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
    
  } catch (error) {
    console.error('[CLASSES GET] Error:', error.message);
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