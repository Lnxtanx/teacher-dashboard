import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const schools = await prisma.school_logins.findMany({
      select: {
        id: true,
        school_name: true
      }
    });

    return res.status(200).json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
