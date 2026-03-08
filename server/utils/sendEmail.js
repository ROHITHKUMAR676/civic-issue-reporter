const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "CivicAI Email Verification",
    html: `
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};

module.exports = sendOTP;