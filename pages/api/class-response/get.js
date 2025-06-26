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

    // Get the response ID from query
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Response ID is required'
      });
    }

    // Convert to numbers to match Prisma schema
    const teacherId = Number(decoded.id);
    const schoolId = Number(decoded.schoolId);
    const responseId = Number(id);

    // Validate numeric inputs
    if (isNaN(teacherId) || isNaN(schoolId) || isNaN(responseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    // Fetch the class response
    const response = await prisma.classResponse.findFirst({
      where: {
        id: responseId,
        schoolId: schoolId,
        teacherId: teacherId
      }
    });

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Class response not found'
      });
    }

    // Return the response
    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('[CLASS RESPONSE GET] Error:', error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
