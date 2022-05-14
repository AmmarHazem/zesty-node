import sendMail from "./sendMail.js";

const sendVerificationEmail = async ({ name, email, verificationToken }) => {
  const message = `
  <p>Please confirm your email by clicking on the following button</p>
  <form method="POST" action="${process.env.ORIGIN}/user/verify-email">
    <input type="hidden" name="token" value="${verificationToken}" />
    <input type="hidden" name="email" value="${email}" />
    <button type="submit">Verify Email</button>
  </form>
  `;
  return sendMail({
    to: email,
    subject: "Email Verification",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

export default sendVerificationEmail;
