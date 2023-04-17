// 用户相关的中间件

/* 
  参考链接：
  https://blog.csdn.net/weixin_44955769/article/details/112360084
*/
const bcrypt = require('bcryptjs')
const assert = require('http-assert')
const Code = require("../service/code.service")  // service 层删除连接
const { getUserInfo } = require('../service/user.service')
const {
  accountAlreadyRegistered,
  usernameAlreadyExited,
  getEmailError,
  getUsernameError,
  codeAlreadyExpired,
  codeCompareError,
  accountNotExited,
  loginError,
  invalidPassword,
} = require('../constant/err.type')

// 密码加密的
const crpytPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)

  console.log("hash: ", hash);
  console.log('密码：', ctx.request.body.password);
  ctx.request.body.password = hash
  console.log('加密后的数据：', ctx.request.body);
  await next()
}


// 邮箱账号是否存在
const verifyEmail = async (ctx, next) => {
  console.log('验证邮箱账号是否正确：', ctx.query);
  console.log("原始链接：", ctx.request.url);
  const { url } = ctx.request
  const { email } = ctx.request.body
  console.log("Email：", email);
  try {
    const res = await getUserInfo({ email })
    if (res) {
      console.log('当前账号已经注册', { email })
      ctx.app.emit('error', accountAlreadyRegistered, ctx)
    } else {
      console.log('当前邮箱没有注册过');
      ctx.body = {
        code: 200,
        isRegistered: false,
      }
      await next()
    }
  } catch (error) {
    console.error('获取用户邮箱错误', error)
    ctx.app.emit('error', getEmailError, ctx)
    return
  }
}

// 判断用户名是否可用
const verifyUsername = async (ctx, next) => {
  const { username } = ctx.request.body
  console.log("username: ", username);
  try {
    const res = await getUserInfo({ username })
    if (res) {
      console.log("当前用户名不可用");
      ctx.app.emit('error', usernameAlreadyExited, ctx)
      return
    } else {
      console.log('当前用户名可用');
      // ctx.body = {
      //   usernameIsUsed: false,
      // }
      await next()
    }
  } catch (error) {
    console.error('获取用户邮箱错误', error)
    ctx.app.emit('error', getUsernameError, ctx)
    return
  }
}

// 判断验证码是否过期
const judgeCodeIsExpired = async (ctx, next) => {
  // console.log('ctx.request.body: ', ctx.request.body);
  const { email, verifyCode } = ctx.request.body
  console.log(`前端发送过来的Email：${email}\n验证码：${verifyCode}`);
  let res = await Code.getCodeInfo({ email })
  console.log(res);
  if (res == null) {
    // 如果查询不到验证码记录，则报错提示验证码过期
    ctx.app.emit('error', codeCompareError, ctx)
    return
  }
  let current_time = new Date().getTime()
  // console.log();
  let isExpired = Math.floor((current_time - res.send_time * 1) / 10) > 300? false: true
  // 后端判断验证码是否获取频繁
  
  if (!isExpired) {
    console.log("当前邮箱验证码未过期");
    if (res.verifyCode === verifyCode) {
      console.log('验证码正确');
      await next()
    } else {
      ctx.app.emit('error', codeCompareError, ctx)
    }
  } else {
    console.log('当前邮箱验证码已过期');
    // 发送错误给前端
    ctx.app.emit('error', codeAlreadyExpired, ctx)
  }
}

// 登录验证(账号和密码)
const verifyLogin = async (ctx, next) => {
  const { email, password } = ctx.request.body

  try {
    const res = await getUserInfo({ email })
    console.log("用户信息获取：", res);
    // 逐层判断
    // 1. 判断账号是否存在
    if (!res) {
      console.log("账号不存在");
      ctx.app.emit('error', accountNotExited, ctx)
      return
    }
    console.log('前端传过来的密码：', password);
    console.log('后端保存的密码：', res.password);
    
    // 2. 判断密码是否正确
    try {
      if (!bcrypt.compareSync(password, res.password)) {
        ctx.app.emit('error', invalidPassword, ctx)
        return
      }
    } catch (error) {
      console.log('密码比对失败：', error);
    }
    console.log('密码正确');
    await next()
  } catch (error) {
    console.log('error: ', error);
    ctx.app.emit('error', loginError, ctx);
    return
  }
}



module.exports = {
  verifyEmail,
  verifyUsername,
  judgeCodeIsExpired,
  crpytPassword,
  verifyLogin
}









