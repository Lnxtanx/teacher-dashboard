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
    const { page = 1, limit = 10 } = req.query;

    // Validate numeric inputs
    if (isNaN(teacherId) || isNaN(schoolId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format in token'
      });
    }

    // Database query
    const [leaves, total] = await Promise.all([
      prisma.leaveApplication.findMany({
        where: { 
          teacherId,
          schoolId // Critical for data isolation
        },
        include: {
          schools: { select: { name: true } },
          teachers: { select: { teacherName: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.leaveApplication.count({
        where: { teacherId, schoolId }
      })
    ]);

    return res.status(200).json({
      success: true,
      count: leaves.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: leaves
    });

  } catch (error) {
    console.error('[LEAVES GET] Error:', error.message);
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
