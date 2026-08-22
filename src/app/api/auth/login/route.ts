import { NextResponse } from 'next/server';

const DEMO_PERSONAS: Record<string, any> = {
  'sarah.chen@omnisales.ai': {
    id: 'usr-ds-lead',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@omnisales.ai',
    role: 'Lead Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['All']
  },
  'marcus.vance@omnisales.ai': {
    id: 'usr-vp-sales',
    name: 'Marcus Vance',
    email: 'marcus.vance@omnisales.ai',
    role: 'VP of Commercial Sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['All']
  },
  'elena.rostova@auratech.io': {
    id: 'usr-brand-lead',
    name: 'Elena Rostova',
    email: 'elena.rostova@auratech.io',
    role: 'Brand Portfolio Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['AuraTech', 'PulseAudio']
  }
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const normalized = (email || '').toLowerCase().trim();

    const matched = DEMO_PERSONAS[normalized];
    if (matched || password === 'password123') {
      const user = matched || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: normalized,
        role: 'Senior Data Scientist',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalized)}`,
        brandAccess: ['All']
      };

      return NextResponse.json({
        status: 'success',
        message: 'Login successful.',
        data: {
          user,
          token: `omnisales-jwt-${user.id}`
        }
      });
    }

    // Default permissive login for testing
    const fallbackUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: normalized,
      role: 'Data Scientist',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalized)}`,
      brandAccess: ['All']
    };

    return NextResponse.json({
      status: 'success',
      message: 'Login successful.',
      data: {
        user: fallbackUser,
        token: `omnisales-jwt-${fallbackUser.id}`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
