import { connectDB } from '@/lib/db';
import Otp from '@/models/OTP';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    console.log('1. Starting send-otp API');

    // Connect to database
    await connectDB();
    console.log('2. Database connected successfully');

    const { email } = await req.json();
    console.log('3. Email received:', email);

    if (!email) {
      return Response.json({ message: 'Email is required' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('4. OTP generated:', otp);

    // Delete existing OTP
    await Otp.findOneAndDelete({ email });
    console.log('5. Existing OTP deleted');

    // Create new OTP
    const otpDoc = await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log('6. OTP created in DB:', otpDoc);

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Your OTP',
      html: `<h2>${otp}</h2>`,
    });
    console.log('7. Email sent successfully');

    return Response.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return Response.json(
      {
        message: 'Failed to send OTP',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
