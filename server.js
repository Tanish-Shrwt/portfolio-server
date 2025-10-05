require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Create email transporter
const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your App Password
  },
});

// Verify connection to Gmail
contactEmail.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Mail server ready to send messages");
  }
});

// Route to handle form submissions
app.post("/contact", (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  const name = `${firstName} ${lastName}`;

  const mail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // you receive the messages here
    replyTo: email,             // allows you to reply to the sender
    subject: `New message from ${name}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Message:</b><br>${message}</p>
    `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ code:500, status: "Error", message: "Failed to send message" });
    } else {
      res.status(200).json({ code:200, status: "Success", message: "Message sent successfully" });
    }
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
