
const jwt = require('jsonwebtoken')
// 引入 jwt 密钥
const { JWT_SECRET } = require('../config/config.default')
const { createUser } = require('../service/user.service')

const path = require('path')

const { userRegisterError, loginError, getUserInfoError, resetError, accountNotExited, userInfoUpdateError } = require('../constant/err.type')
// const { get } = require('../router')
const { getUserInfo, updateById, getInfoLimit } = require('../service/user.service')

class UserController {
  // 用户注册处理
  async register(ctx, next) {
    // 1. 获取数据
    const { username, email, password, motto } = ctx.request.body
    // 创建用户的头像
    // console.log('ctx.origin: ', ctx.origin);
    // 生成头像链接
    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const user_avatar = `${ctx.origin}/default/${getRandom(1, 20)}.png`
    let is_admin = false;
    // console.log('头像链接：', user_avator);
    // 2. 操作数据库
    try {

      if (username == '溢狗') {
        is_admin = true
      }
      const res = await createUser(username, email, password, user_avatar, motto, is_admin)
      console.log('新用户注册成功');
      let { id, } = res
      // 注册成功之后返回一个 token 给注册用户
      ctx.body = {
        code: 200,
        message: '用户注册成功',
        result: {
          token: jwt.sign(
            {
              id,
              email,
              username,
              is_admin,
            }, JWT_SECRET, {
            expiresIn: '1d'
          }),
          userInfo: {
            id,
            username,
            user_avatar,
            motto,
          }
        }
      }
      // console.log('注册成功后的数据：', {id, username, user_avator});
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', userRegisterError, ctx)
    }
  }

  // 用户登录处理
  async login(ctx, next) {
    const { email } = ctx.request.body
    console.log("看执行到这里没有: ", email);
    try {
      const { id, username, user_avatar, is_admin: isAdmin, motto } = await getUserInfo({ email })
      // const res = await getUserInfo({email})
      // console.log('返回数据', res);
      // console.log("user_avator: ", user_avator);
      console.log('login-用户信息：', id,
        username,
        user_avatar,
        isAdmin);
      ctx.body = {
        code: 200,
        message: '登录成功',
        result: {
          token: jwt.sign(
            {
              id,
              email,
              username,
              isAdmin,
            }, JWT_SECRET, {
            expiresIn: '15d'
          }),
          userInfo: {
            id,
            username,
            user_avatar,
            motto,
          }
        }
      }
    } catch (error) {
      console.log('登录错误');
      ctx.app.emit('error', loginError, ctx)
    }
  }

  // 重置用户密码
  async changePassword(ctx, next) {
    let { email, password } = ctx.request.body
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
      let {id} = res
      try {
        // 2. 操作数据库
        // let res = await updateById({id, password})
        if (await updateById({id, password})) {
          // console.log("重置的数据：", res2);
          ctx.body = {
            code: 200,
            message: '修改密码成功',
            result: '',
          }
        } else {
          ctx.app.emit('error', resetError, ctx);
        }

        await next()
      } catch (error) {
        console.log('error: ', error);
        ctx.app.emit('error', resetError, ctx);
        return
      }
    } catch (error) {
      console.log('error: ', error);
      ctx.app.emit('error', getUserInfoError, ctx);
      return
    }
  }

  // 获取用户信息
  async getInfo(ctx, next) {
    try {
      const {id} = ctx.request.body;
      const res = await getUserInfo({ id })
      ctx.body = {
        code: 200,
        message: '用户信息获取成功',
        res,
      }
    } catch (error) {
      ctx.app.emit('error', getUserInfoError, ctx)
    }
  }

  // 获取指定的用户信息
  async getInfoLimit(ctx, next) {
    try {
      const {id} = ctx.request.body;
      const res = await getInfoLimit({ id })
      ctx.body = {
        code: 200,
        message: '用户信息获取成功',
        res,
      }
    } catch (error) {
      ctx.app.emit('error', getUserInfoError, ctx)
    }
  }

  async update(ctx, next) {
    try {
      const {id, username, motto, user_avatar} = ctx.request.body;
      let res = await updateById({id, username, motto, user_avatar})
      if (res) {
        ctx.body = {
          code: 200,
          message: '用户信息修改成功',
          result: res,
        }
      }
    } catch (error) {
      ctx.app.emit('error', userInfoUpdateError, ctx)
    }
  }

}

module.exports = new UserController()