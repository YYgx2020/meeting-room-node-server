const Code = require("../service/code.service");
const {
  sendEmailError,
  saveCodeError,
  codeGetFrequently,
} = require("../constant/err.type");
const { sendEmail } = require("../utils/email");

class CodeController {
  async authCode(ctx, next) {
    let { email } = ctx.query;
    // 先判断获取验证码的时间间隔是否有超过 60s
    let res = await Code.getCodeInfo({ email });
    if (res) {
      let current_time = new Date().getTime();
      console.log(
        "间隔时间：",
        Math.floor((current_time - res.send_time * 1) / 10)
      );
      if (Math.floor((current_time - res.send_time * 1) / 1000) < 60) {
        // 获取间隔时间小于 60s，提示前端验证码获取频繁
        ctx.app.emit("error", codeGetFrequently, ctx);
        return;
      }
    }

    // 生成随机验证码函数
    const randomFns = () => {
      // 生成6位随机数
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += parseInt(Math.random() * 10);
      }
      return code;
    };

    console.log("查看参数：", ctx.request.body);
    console.log("查看query参数：", ctx.query);
    // 建立连接发送验证码

    let code = randomFns();

    const to = email;
    const subject = "验证您的电子邮件";
    const html = `
            <p>您好！</p>
            <p>您的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>该验证码 <strong>5</strong> 分钟内有效，收到验证码后请尽快完成验证操作</p>`;
    // 开始之前删一次，确保没有重复的邮箱
    // clearTimeout(timer)  // 删除定时器
    await Code.deleteCode(email);
    try {
      sendEmail(to, subject, html);
      // await transport.sendMail({
      //   from: HOST_EMAIL, // 发件邮箱
      //   to: email, // 收件列表
      //   subject: "验证您的电子邮件", // 标题
      //   html: `
      //         <p>您好！</p>
      //         <p>您的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
      //         <p>该验证码 <strong>5</strong> 分钟内有效，收到验证码后请尽快完成验证操作</p>`, // html 内容
      // });
    } catch (error) {
      console.log("验证码发送错误：", error);
      ctx.app.emit("error", sendEmailError, ctx);
      return;
    }

    try {
      await Code.createCode(email, code); // 保存验证码，无数据返回
    } catch (error) {
      console.log("验证码保存错误：", error);
      ctx.app.emit("error", saveCodeError, ctx);
      return;
    }
    // 将验证码返回给前端
    ctx.body = {
      code: 200,
      message: "验证码获取成功，请在1分钟之内完成验证操作",
      verifyCode: code,
    };
    // setTimeout 的第一个参数是函数时，不能传参
    // timer = setTimeout(async () => {    // 5分钟后失效
    //   await Code.deleteCode(email)
    // }, 1000 * 60 * 5)
    await next();
  }
}

module.exports = new CodeController();
