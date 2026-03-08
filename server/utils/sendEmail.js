const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOTP = async (email, otp) => {

  try {

    await transporter.sendMail({
      from: `"CivicAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CivicAI Email Verification",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
      `
    });

    console.log("OTP email sent to:", email);

  } catch (error) {

    console.error("Email sending failed:", error);
    throw error;

  }

};

module.exports = sendOTP;