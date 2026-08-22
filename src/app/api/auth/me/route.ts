import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const user = {
    id: 'usr-ds-lead',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@omnisales.ai',
    role: 'Lead Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    brandAccess: ['All']
  };

  return NextResponse.json({
    status: 'success',
    data: { user }
  });
}
