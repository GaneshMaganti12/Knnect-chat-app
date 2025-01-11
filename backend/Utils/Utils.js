const nodeMailer = require("nodemailer");

// Function to send an email to the user
exports.sendToUserMail = async (mailDetails) => {
  try {
    // Create a transport object to send emails using Gmail's SMTP service
    const mailTransport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "mailforproject96@gmail.com",
        pass: "poyhupnhjplfpsqc",
      },
    });
    // Send the email using the mailTransport object
    mailTransport.sendMail(mailDetails);
  } catch (error) {
    console.log(error.message);
  }
};
