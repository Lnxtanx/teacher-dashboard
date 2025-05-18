import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Make sure to set this in .env

export function generateToken(teacher) {
  return jwt.sign(
    { 
      id: teacher.id,
      email: teacher.email,
      teacherName: teacher.teacherName,
      schoolId: teacher.schoolId
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  return null;
}

export function isAuthenticated(handler) {
  return async (req, res) => {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    return handler(req, res);
  };
}
