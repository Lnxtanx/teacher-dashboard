import { PrismaClient } from '@prisma/client';
import { getTokenFromHeader, verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Only POST requests allowed'
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
        message: 'Invalid ID format in token'
      });
    }

    // Extract event data from request body
    const { eventName, eventDate, description } = req.body;

    // Validate required fields
    if (!eventName || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Event name and date are required'
      });
    }

    // Create the event application
    const newEvent = await prisma.eventApplication.create({
      data: {
        teacherId,
        schoolId,
        eventName,
        eventDate: new Date(eventDate),
        description,
        status: 'Pending' // Default status
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Event application submitted successfully',
      data: newEvent
    });

  } catch (error) {
    console.error('[EVENT CREATE] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development'
        ? error.message
        : 'Event creation failed'
    });
  } finally {
    await prisma.$disconnect();
  }
}