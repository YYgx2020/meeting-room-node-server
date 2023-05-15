// 用户相关的中间件

/* 
  参考链接：
  发送邮箱
  https://blog.csdn.net/weixin_44955769/article/details/112360084
*/
const bcrypt = require("bcryptjs");
const assert = require("http-assert");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");

const { getUserInfo } = require("../service/user.service");
const {
  accountAlreadyRegistered,
  usernameAlreadyExited,
  getPhoneError,
  getUsernameError,
  codeAlreadyExpired,
  codeCompareError,
  accountNotExited,
  loginError,
  invalidPassword,
  serverError,
  jsonWebTokenError,
  waitToPass,
  noPass,
} = require("../constant/err.type");

// 验证用户 token
const auth = async (ctx, next) => {
  // console.log("header: ", ctx.request.header);
  // const { authorization: token } = ctx.request.header
  const { authorization } = ctx.request.header;
  let token = null;
  // console.log('author');
  if (authorization !== undefined) {
    token = authorization.replace("bearer ", "");
  } else {
    console.log('没有authorization');
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user;
    // ctx.body = {
    //   code: 200,
    //   message: 'token有效'
    // }
    await next();
  } catch (error) {
    console.log("错误：", error);
    switch (error.name) {
      case "TokenExpiredError":
        console.log("token已过期");
        ctx.app.emit("error", tokenExpiredError, ctx);
      case "JsonWebTokenError":
        console.log("无效token");
        ctx.app.emit("error", jsonWebTokenError, ctx);
    }
  }
};

// 密码加密的
const crpytPassword = async (ctx, next) => {
  try {
    let { password } = ctx.request.body;
    password += "";
    console.log("password: ", password);
    const salt = bcrypt.genSaltSync(10);
    // hash保存的是 密文
    const hash = bcrypt.hashSync(password, salt);

    // console.log("hash: ", hash);
    // console.log('密码：', ctx.request.body.password);
    ctx.request.body.password = hash;
    console.log("加密后的数据：", ctx.request.body);
    await next();
  } catch (error) {
    console.error(error);
  }
};

// 手机账号是否存在
const verifyPhone = async (ctx, next) => {
  // console.log("验证邮箱账号是否正确：", ctx.query);
  // console.log("原始链接：", ctx.request.url);
  // const { url } = ctx.request;
  const { phone } = ctx.request.body;
  // console.log("phone: ", phone);
  try {
    const res = await getUserInfo({ phone });
    if (res) {
      // console.log("当前账号已经注册", { phone });
      ctx.app.emit("error", accountAlreadyRegistered, ctx);
    } else {
      // console.log("当前邮箱没有注册过");
      // ctx.body = {
      //   code: 200,
      //   isRegistered: false,
      // };
      await next();
    }
  } catch (error) {
    console.error("获取用户邮箱错误", error);
    ctx.app.emit("error", getPhoneError, ctx);
    return;
  }
};

// 判断用户名是否可用
const verifyUserIsExist = async (ctx, next) => {
  const { phone } = ctx.request.body;
  // console.log("username: ", username);
  try {
    const res = await getUserInfo({ phone });
    if (res) {
      // console.log("当前用户名不可用");
      // ctx.app.emit("error", usernameAlreadyExited, ctx);
      // return;
      await next();
    } else {
      // console.log("当前用户名可用");
      // ctx.body = {
      //   usernameIsUsed: false,
      // }
      // await next();
      ctx.body = {
        code: 10038,
        message: '账号不存在',
        result: "",
      }
    }
  } catch (error) {
    console.error("获取用户邮箱错误", error);
    ctx.app.emit("error", getUsernameError, ctx);
    return;
  }
};

// 判断验证码是否过期
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
    Math.floor((current_time - res.send_time * 1) / 10) > 300 ? false : true;
  // 后端判断验证码是否获取频繁

  if (!isExpired) {
    console.log("当前邮箱验证码未过期");
    if (res.verifyCode === verifyCode) {
      console.log("验证码正确");
      await next();
    } else {
      ctx.app.emit("error", codeCompareError, ctx);
    }
  } else {
    console.log("当前邮箱验证码已过期");
    // 发送错误给前端
    ctx.app.emit("error", codeAlreadyExpired, ctx);
  }
};

// 登录验证(账号和密码)
const verifyLogin = async (ctx, next) => {
  try {
    // console.log("header: ", ctx.request.header);
    const { phone, password } = ctx.request.body;
    const res = await getUserInfo({ phone });
    // console.log("用户信息获取：", res);
    // 逐层判断
    // 1. 判断账号是否存在
    if (!res) {
      // console.log("账号不存在");
      ctx.app.emit("error", accountNotExited, ctx);
      return;
    }
    // console.log("前端传过来的密码：", password);
    // console.log("后端保存的密码：", res.password);

    // 2. 判断密码是否正确
    try {
      if (!bcrypt.compareSync(password, res.password)) {
        ctx.app.emit("error", invalidPassword, ctx);
        return;
      }
      await next();
    } catch (error) {
      console.log("密码比对失败：", error);
      ctx.app.emit("error", serverError, ctx);
    }
    // console.log("密码正确");
  } catch (error) {
    console.log("error: ", error);
    ctx.app.emit("error", loginError, ctx);
    return;
  }
};

// 判断账号申请是否通过
const verifyPass = async (ctx, next) => {
  const { phone } = ctx.request.body;
  const res = await getUserInfo({ phone });
  console.log('查看状态', res);
  if (res.register_status === 0) {
    ctx.app.emit("error", waitToPass, ctx);
  } else if (res.register_status === -1) {
    ctx.app.emit("error", noPass, ctx);
  } else {
    await next();
  }
};

module.exports = {
  verifyPhone,
  verifyUserIsExist,
  judgeCodeIsExpired,
  crpytPassword,
  verifyLogin,
  auth,
  verifyPass,
};
