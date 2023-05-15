const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const path = require("path");
// 引入 jwt 密钥
const { JWT_SECRET } = require("../config/config.default");
const { sendEmailError } = require("../constant/err.type");
const { HOST_EMAIL, SMTP, HOST } = require("../config/config.default");

const {
  userRegisterError,
  loginError,
  getUserInfoError,
  resetError,
  accountNotExited,
  userInfoUpdateError,
} = require("../constant/err.type");
// const { get } = require('../router')
const {
  create,
  getUserInfo,
  getAllUserList,
  delUser,
  updateUserInfo,
} = require("../service/user.service");
const { sendEmail } = require("../utils/email");

class UserController {
  // 创建用户
  async createUser(ctx, next) {
    try {
      const {
        organization_id,
        name,
        phone,
        email,
        password,
        openid,
        from,
        role,
        number,
      } = ctx.request.body;
      const result = await create({
        organization_id,
        name,
        phone,
        email,
        password,
        openid,
        from,
        role,
        number,
      });
      // const message = from = 'organization' ? '提交成功'
      ctx.body = {
        code: 200,
        message: "提交成功",
        result,
      };
    } catch (error) {}
  }

  // 用户登录
  async login(ctx, next) {
    try {
      const { phone } = ctx.request.body;
      const {
        id,
        organization_id,
        number,
        role,
        name,
        email,
        is_admin,
        admin_apply_status,
        is_organization_admin,
        openid,
        is_system_admin,
        organization_name,
        organization_type,
        avatar,
      } = await getUserInfo({ phone });
      // 联表查询获取用户的组织名称和类型
      ctx.body = {
        code: 200,
        message: "登录成功",
        result: {
          token: jwt.sign(
            {
              id,
              phone,
              name,
              is_admin,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
          ),
          userInfo: {
            id,
            organization_id,
            number,
            role,
            name,
            email,
            is_admin,
            admin_apply_status,
            is_organization_admin,
            openid,
            is_system_admin,
            phone,
            organization_name,
            organization_type,
            avatar,
          },
        },
      };
    } catch (error) {}
  }

  // 获取用户列表
  async getUserList(ctx, next) {
    try {
      let { offset, limit, current, organization_id } = ctx.query;
      offset *= 1;
      limit *= 1;
      current *= 1;
      const result = await getAllUserList({
        offset,
        limit,
        current,
        organization_id,
      });
      console.log("数据获取结果：", result);
      ctx.body = {
        code: 200,
        message: "加载成功",
        result,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserInfo(ctx, next) {
    try {
      const { phone, register_status, role, reason, password, email, admin, admin_phone } =
        ctx.request.body;
      const res = await updateUserInfo({
        phone,
        register_status,
        role,
        reason,
        password,
        email,
      });
      if (register_status == 1) {
        // 发邮件给用户
        const to = email;
        const subject = "会议室用户注册审核结果";
        const html = `
          <p>您好！</p>
          <p>您的用户申请已通过</p>
          <p>审核人员：${admin}</p>
          <p>联系方式：${admin_phone}</p>
        `;
        sendEmail(to, subject, html);
      }
      ctx.body = {
        code: 200,
        message: "更新成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
    }
  }

  // 删除用户
  async del(ctx, next) {
    const { phone, email, reason, admin, admin_phone } = ctx.request.body;
    const res = await delUser({ phone });
    // 删除成功后发送邮件到注册用户的邮箱中，并告知原因
    // 发邮件给用户
    const to = email;
    const subject = "会议室用户注册审核结果";
    const html = `
        <p>您好！</p>
        <p>您的注册申请未通过，具体原因如下：</p>
        <p>${reason}</p>
        <p>如对上述审核结果有异议，您可以向审核的管理员联系</p>
        <p>管理员：${admin}</p>
        <p>联系方式：${admin_phone}</p>`; // html 内容
    sendEmail(to, subject, html);
    ctx.body = {
      code: 200,
      message: "审核成功",
      result: "",
    };
  }
}

module.exports = new UserController();
