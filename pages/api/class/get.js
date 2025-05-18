// this is api/class/get.js
// This API endpoint retrieves class records for a specific teacher.
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
    
    // Get query parameters with defaults
    const { page = 1, limit = 10, status } = req.query;

    // Validate numeric inputs
    if (isNaN(teacherId) || isNaN(schoolId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format in token'
      });
    }

    // Build the where clause for filtering
    const whereClause = {
      teacherId,
      schoolId // Critical for data isolation
    };

    // Add status filter if provided
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Database query
    const [classRecords, total] = await Promise.all([
      prisma.classResponse.findMany({
        where: whereClause,
        include: {
          schools: { select: { name: true } },
          teachers: { select: { teacherName: true } }
        },
        orderBy: { submittedAt: 'desc' }, // Show newest records first
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.classResponse.count({
        where: whereClause
      })
    ]);

    return res.status(200).json({
      success: true,
      count: classRecords.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: classRecords
    });
  } catch (error) {
    console.error('[CLASS RECORDS GET] Error:', error.message);
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