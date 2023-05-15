const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const { HOST_EMAIL, SMTP, HOST } = require("../config/config.default");

// 创建邮件传输对象
const transport = nodemailer.createTransport(
  smtpTransport({
    host: HOST,
    port: 465,
    secure: true,
    auth: {
      user: HOST_EMAIL,
      pass: SMTP,
    },
  })
);

// 封装发送邮件的函数
async function sendEmail(to, subject, html) {
  try {
    await transport.sendMail({
      from: HOST_EMAIL,
      to,
      subject,
      html,
    });
    console.log(`邮件发送成功: ${to}`);
  } catch (error) {
    console.error(`邮件发送失败: ${to}, 错误信息: ${error}`);
  }
}

module.exports = {
  sendEmail,
};

