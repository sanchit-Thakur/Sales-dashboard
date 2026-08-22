import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ status: 'error', message: 'Name and email are required.' }, { status: 400 });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || 'Senior Data Scientist',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      brandAccess: ['All']
    };

    return NextResponse.json({
      status: 'success',
      message: 'User registered successfully.',
      data: {
        user: newUser,
        token: `omnisales-jwt-${newUser.id}`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
