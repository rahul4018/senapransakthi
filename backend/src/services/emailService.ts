import nodemailer from "nodemailer";

export const sendOTPEmail = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Senapransakti Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for Senapransakti Login",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Senapransakti Secure Login</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="letter-spacing: 3px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
