import { Request, Response } from 'express';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  brandAccess: string[];
  createdAt: string;
}

// In-memory persistent user store with pre-seeded demo accounts
const usersStore: Map<string, { profile: UserProfile; passwordHash: string }> = new Map();

// Seed standard demo personas
const demoUsers: { profile: UserProfile; passwordHash: string }[] = [
  {
    profile: {
      id: 'usr-ds-lead',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@omnisales.ai',
      role: 'Lead Data Scientist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      brandAccess: ['All'],
      createdAt: '2024-01-15T08:00:00.000Z'
    },
    passwordHash: 'password123'
  },
  {
    profile: {
      id: 'usr-vp-sales',
      name: 'Marcus Vance',
      email: 'marcus.vance@omnisales.ai',
      role: 'VP of Commercial Sales',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      brandAccess: ['All'],
      createdAt: '2024-02-01T08:00:00.000Z'
    },
    passwordHash: 'password123'
  },
  {
    profile: {
      id: 'usr-brand-lead',
      name: 'Elena Rostova',
      email: 'elena.rostova@auratech.io',
      role: 'Brand Portfolio Director (AuraTech)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      brandAccess: ['AuraTech', 'PulseAudio'],
      createdAt: '2024-03-10T08:00:00.000Z'
    },
    passwordHash: 'password123'
  }
];

demoUsers.forEach(u => usersStore.set(u.profile.email.toLowerCase(), u));

export const signup = (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email, and password are required fields.'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (usersStore.has(normalizedEmail)) {
    return res.status(409).json({
      status: 'error',
      message: 'An account with this email address already exists.'
    });
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: role || 'Data Scientist',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    brandAccess: ['All'],
    createdAt: new Date().toISOString()
  };

  usersStore.set(normalizedEmail, { profile: newUser, passwordHash: password });

  const token = `omnisales-jwt-${newUser.id}-${Buffer.from(normalizedEmail).toString('base64')}`;

  return res.status(201).json({
    status: 'success',
    message: 'User account created successfully.',
    data: {
      user: newUser,
      token
    }
  });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required.'
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userRecord = usersStore.get(normalizedEmail);

  if (!userRecord || userRecord.passwordHash !== password) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password.'
    });
  }

  const token = `omnisales-jwt-${userRecord.profile.id}-${Buffer.from(normalizedEmail).toString('base64')}`;

  return res.json({
    status: 'success',
    message: 'Login successful.',
    data: {
      user: userRecord.profile,
      token
    }
  });
};

export const getMe = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('-');
  if (parts.length < 3) {
    return res.status(401).json({ status: 'error', message: 'Invalid token format.' });
  }

  try {
    const email = Buffer.from(parts[parts.length - 1], 'base64').toString('utf-8');
    const userRecord = usersStore.get(email.toLowerCase());

    if (!userRecord) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    return res.json({
      status: 'success',
      data: {
        user: userRecord.profile
      }
    });
  } catch (_e) {
    return res.status(401).json({ status: 'error', message: 'Failed to decode token.' });
  }
};
