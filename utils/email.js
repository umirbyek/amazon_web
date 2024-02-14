const { model } = require("mongoose");
const nodemailer = require("nodemailer");



// async..await is not allowed in global scope, must use a wrapper
const sendEmail =async (options) =>{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port:  process.env.SMTP_PORT,
        secure:false,
        auth: {
        
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

     
      let info = await transporter.sendMail({
        from: `${process.env.SMTP_FROM} <${process.env.SMTP_FROM_EMAIL}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        // text: "Hello world?", // plain text body
        html:options.message, // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Message sent: %s", nodemailer.getTestMessageUrl(info));
      return info;
}

module.exports=sendEmail