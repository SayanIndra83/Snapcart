import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject : string, html : string) =>{
    try {
    const info = await transporter.sendMail({
    from: `"Snapcart" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });

  console.log("Message sent");
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}