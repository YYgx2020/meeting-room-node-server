const Code = require("../service/code.service");

const { codeAlreadyExpired } = require("../constant/err.type");

const judgeCodeIsExpired = async (ctx, next) => {
  // console.log('ctx.request.body: ', ctx.request.body);
  const { email, verifyCode } = ctx.request.body;
  console.log(`前端发送过来的Email：${email}\n验证码：${verifyCode}`);
  let res = await Code.getCodeInfo({ email });
  console.log(res);
  if (res == null) {
    // 如果查询不到验证码记录，则报错提示验证码过期
    ctx.app.emit("error", codeCompareError, ctx);
    return;
  }
  let current_time = new Date().getTime();
  // console.log();
  let isExpired =
    Math.floor((current_time - res.send_time * 1) / 1000) > 300 ? false : true;
  // 后端判断验证码是否获取频繁

  if (isExpired) {
    console.log("当前邮箱验证码未过期");
    if (res.verifyCode == verifyCode) {
      console.log("验证码正确");
      await next();
    } else {
      // ctx.app.emit("error", codeCompareError, ctx);
      ctx.body = {
        code: 10009,
        message: "邮箱验证码错误",
        result: "",
      };
    }
  } else {
    console.log("当前邮箱验证码已过期");
    // 发送错误给前端
    ctx.app.emit("error", codeAlreadyExpired, ctx);
  }
};

module.exports = {
  judgeCodeIsExpired,
};
