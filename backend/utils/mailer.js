const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
module.exports = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Your BookExchange OTP',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
  });
};
