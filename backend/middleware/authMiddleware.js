import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const decodeTokenMiddleware = (req, res, next) => {
 
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token decoding error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token. Access denied.' });
  }
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization failed: User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Authorization failed: You do not have the required role' });
    }
    next();
  };
};
