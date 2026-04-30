import Otp from '@/models/OTP';
export const saveOTP = async (email, otp) => {
  await Otp.findOneAndDelete({ email });

  await Otp.create({
    email: email.toLowerCase().trim(),
    otp: otp.toString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
};

export const verifyOTP = async (email, otp) => {
  const record = await Otp.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!record) return false;

  if (record.expiresAt < new Date()) return false;

  return record.otp === otp.toString();
};

export const deleteOTP = async (email) => {
  await Otp.deleteOne({ email: email.toLowerCase().trim() });
};
