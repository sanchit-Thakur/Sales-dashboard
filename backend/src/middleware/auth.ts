import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';
import { prisma } from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateJwt = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; name: string };
      req.user = decoded;
      return next();
    }

    // Default Demo User Fallback for seamless MVP testing
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@financeadvisor.ai' },
    });

    if (demoUser) {
      req.user = {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      };
      return next();
    }

    throw new UnauthorizedError('No authentication token provided');
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return next(error);
    }
    return next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};
