import { PrismaClient } from '@prisma/client';
// import { withAuth } from '../../../lib/withAuth';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all data from all tables
    const [schools, teachers, classes, lessonPdfs, timetables, lessonLogs, leaveApplications, eventApplications, classResponses] = await Promise.all([
      prisma.School.findMany(),
      prisma.Teacher.findMany(),
      prisma.Class.findMany(),
      prisma.LessonPdf.findMany(),
      prisma.Timetable.findMany(),
      prisma.LessonLog.findMany(),
      prisma.LeaveApplication.findMany(),
      prisma.EventApplication.findMany(),
      prisma.ClassResponse.findMany(),
    ]);

    // Remove sensitive information like passwords
    const sanitizedSchools = schools.map(({ password, ...school }) => school);
    const sanitizedTeachers = teachers.map(({ password, ...teacher }) => teacher);

    // Return all data
    res.status(200).json({
      schools: sanitizedSchools,
      teachers: sanitizedTeachers,
      classes,
      lessonPdfs,
      timetables,
      lessonLogs,
      leaveApplications,
      eventApplications,
      classResponses,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

export default handler;
