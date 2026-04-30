import { connectDB } from '@/lib/db';
import Otp from '@/models/OTP';
import { createToken } from '@/lib/auth';

export async function POST(req) {
  try {
    console.log('1. Starting verify-otp API');

    await connectDB();
    console.log('2. Database connected');

    const { email, otp } = await req.json();
    console.log('3. Verifying for email:', email, 'OTP:', otp);

    // Find OTP record
    const record = await Otp.findOne({ email });
    console.log('4. Found record:', record);

    if (!record) {
      console.log('5. No OTP record found');
      return Response.json({ message: 'OTP not found' }, { status: 401 });
    }

    console.log('6. Record expires at:', record.expiresAt);
    console.log('7. Current time:', new Date());

    if (record.expiresAt < new Date()) {
      console.log('8. OTP expired');
      return Response.json({ message: 'OTP expired' }, { status: 401 });
    }

    if (record.otp !== otp.toString()) {
      console.log('9. OTP mismatch - Expected:', record.otp, 'Got:', otp);
      return Response.json({ message: 'Invalid OTP' }, { status: 401 });
    }

    console.log('10. OTP verified successfully');

    // Delete used OTP
    await Otp.deleteOne({ email });
    console.log('11. OTP deleted');

    // Create token
    const token = createToken(email);
    console.log('12. Token created');

    return Response.json({ success: true, token });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return Response.json(
      {
        message: 'Verification failed',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
