const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  var transporter = nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "734b03708d73e1",
      pass: "75c162fbdbef2d"
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Health Haven Team <HealthHaven@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}


module.exports = sendEmail;
