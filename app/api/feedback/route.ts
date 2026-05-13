import { NextRequest, NextResponse } from 'next/server';

/**
 * Feedback API endpoint
 * Sends feedback/questions to keats0206@gmail.com
 *
 * Configure one of these email services:
 * 1. Resend (free tier) - https://resend.com
 * 2. SendGrid - https://sendgrid.com
 * 3. Mailgun - https://mailgun.com
 * 4. Gmail SMTP via nodemailer
 */

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Log the feedback (TODO: integrate with email service)
    console.log('📧 Feedback received:', {
      from: email,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send email using one of these methods:
    // 1. Resend API
    // 2. SendGrid API
    // 3. Mailgun API
    // 4. Gmail SMTP (nodemailer)

    // For now, just return success
    // In production, actually send the email!

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback received! We will get back to you soon.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
