import nodemailer from "nodemailer";

const sendMail = ({ to, subject, html }) => {
  const nodemailerConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "iq45csodxplgvap5@ethereal.email",
      pass: "BXn18Fa5XdpxGKr9FP",
    },
  };
  const transporter = nodemailer.createTransport(nodemailerConfig);
  return transporter.sendMail({
    from: "Luka <luka@email.com>",
    to,
    subject,
    html,
  });
};

export default sendMail;
