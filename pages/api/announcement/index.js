import { PrismaClient } from '@prisma/client';
import { getTokenFromHeader, verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Only GET requests allowed',
    });
  }

  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    const decoded = verifyToken(token);
    if (!decoded?.schoolId) {
      return res.status(403).json({ success: false, message: 'Invalid token payload' });
    }

    const schoolId = Number(decoded.schoolId);
    const { page = 1, limit = 10 } = req.query;

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: { schoolId },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.announcement.count({ where: { schoolId } }),
    ]);

    return res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: announcements,
    });
  } catch (error) {
    console.error('[ANNOUNCEMENTS GET] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  } finally {
    await prisma.$disconnect();
  }
}
