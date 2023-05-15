const {
  sendEmailError,
  deleteOrganizationError,
} = require("../constant/err.type");
const {
  create,
  getAllOrganizationList,
  updateOrganizationInfo,
  getAll,
  delOrganization,
} = require("../service/organization.service");

const {
  delUser,
  updateUserInfo,
  getUserInfo,
} = require("../service/user.service");
const { sendEmail } = require("../utils/email");

class OrganizationController {
  // 创建组织机构
  async createOrganization(ctx, next) {
    const data = ctx.request.body;
    console.log("前端数据：", data);
    try {
      // 先生成一条组织机构记录，如果后续审核不通过，则删除用户信息和组织机构记录。
      const {
        organizationName: name,
        type,
        description,
        name: admin,
        phone,
        openid: user_openid,
      } = ctx.request.body;
      const result = await create({
        name,
        type,
        description,
        admin,
        phone,
        user_openid,
      });
      // console.log('result: ', result);
      ctx.request.body.organization_id = result.id;
      ctx.request.body.from = "organization";
      await next();
    } catch (error) {
      // 返回服务器错误
    }
  }

  // 获取组织机构记录
  async getOrganizationList(ctx, next) {
    try {
      let { offset, limit, current } = ctx.query;
      offset *= 1;
      limit *= 1;
      current *= 1;
      const result = await getAllOrganizationList({ offset, limit, current });
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

  // 更新组织机构信息
  async updateOrganizationInfo(ctx, next) {
    try {
      console.log("数据: ", ctx.request.body);
      const {
        id,
        is_pass,
        no_pass_reason,
        is_delete,
        phone,
        admin,
        admin_phone,
      } = ctx.request.body;
      await updateOrganizationInfo({ id, is_pass, no_pass_reason, is_delete });
      if (is_pass == -1) {
        await delUser({ phone });
      } else if (is_pass == 1) {
        const data = {
          phone,
          is_organization_admin: true,
          is_admin: true,
          register_status: 1,
          admin_apply_status: 2,
          role: 4,
        };
        await updateUserInfo(data);
      }
      try {
        const userInfo = await getUserInfo({ phone });
        console.log("userInfo: ", userInfo);
        const to = userInfo.email;
        const subject = "机构入驻审核结果";
        const html = `
          <p>您好！</p>
          <p>您的机构入驻申请已通过</p>
          <p>您拥有您机构下的所有管理权限，包括会议室信息的编辑，机构用户注册审核，会议室管理权限分配等功能，详情请登录“约一约”小程序或者本平台的<a href="https://meeting.lianghongyi.com">后台管理系统</a>查看</p>
          <p>审核人员：${admin}</p>
          <p>联系方式：${admin_phone}</p>
        `;
        sendEmail(to, subject, html);
        ctx.body = {
          code: 200,
          message: "更新成功",
          result: "",
        };
      } catch (error) {
        ctx.app.emit("error", sendEmailError, ctx);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 按关键词查找
  async searchByKeyWord(ctx, next) {
    const { keyWord } = ctx.query;
    const res = await getAll({ keyWord });
    ctx.body = {
      code: 200,
      message: "数据获取成功",
      result: res,
    };
  }

  // 删除机构
  async del(ctx, next) {
    try {
      const { id, phone, reason, admin, admin_phone, is_pass, is_delete } = ctx.request.body;
      const updateRes = await updateOrganizationInfo({ id, is_pass, no_pass_reason: reason, is_delete });
      console.log('updateRes: ', updateRes);
      const userInfo = await getUserInfo({ phone });
      await delUser({ phone });
      // console.log("userInfo: ", userInfo);
      const to = userInfo.email;
      const subject = "机构入驻审核结果";
      const html = `
          <p>您好！</p>
          <p>您的机构入驻申请不通过</p>
          <p>具体原因：</p>
          <p>${ reason }</p>
          <p>如对以上结果有异议，可联系平台管理员</p>
          <p>管理员：${ admin }</p>
          <p>管理员：${ admin_phone }</p>
        `;
      sendEmail(to, subject, html);
      ctx.body = {
        code: 200,
        message: "更新成功",
        result: "",
      };
    } catch (error) {
      ctx.app.emit("error", deleteOrganizationError, ctx);
    }
  }
}

module.exports = new OrganizationController();
