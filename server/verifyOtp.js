const { otpStore } = require("./utils/sendOtp");

exports.verifyOtp = (req, res) => {
    const { username, otp } = req.body;

    const record = otpStore.get(username);
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (Date.now() > record.expiresAt) {
        otpStore.delete(username);
        return res.status(400).json({ message: "OTP expired" });
    }
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    otpStore.delete(username);
    console.log("✅ OTP verified for:", username);
    return res.json({ message: "OTP verified successfully" });
};
