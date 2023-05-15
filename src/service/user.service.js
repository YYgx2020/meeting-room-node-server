// 参考文档： https://www.jianshu.com/p/d7da178de59a

const User = require("../model/user.model");

const Organization = require("../model/organization.model");

const { Op } = require("sequelize");

class UserService {
  // 创建用户
  async create({
    organization_id,
    name,
    phone,
    email,
    password,
    openid,
    from,
    role,
    number,
  }) {
    // 标记从哪里来的创建用户，如果是从入驻申请那边过来的，则将role设置为3，即管理员
    if (from === "organization") {
      role = 3;
    }
    const res = await User.create({
      organization_id,
      name,
      phone,
      email,
      password,
      openid,
      role,
      number,
    });
    return res.dataValues;
  }

  // 获取用户信息
  async getUserInfo({ id, email, phone, name }) {
    const whereOpt = {};

    id && Object.assign(whereOpt, { id });
    email && Object.assign(whereOpt, { email });
    phone && Object.assign(whereOpt, { phone });
    name && Object.assign(whereOpt, { name });
    // password && Object.assign(whereOpt, { password });
    // is_admin && Object.assign(whereOpt, { is_admin });

    const res = await User.findOne({
      // 验证用户密码的时候需要拿到用户的密码
      include: [Organization],
      where: whereOpt,
    });
    // return res ? res.dataValues : null;
    console.log('res: ', res);
    // console.log('res: ', res.organization.dataValues);
    if (res) {
      res.dataValues.organization_name = res.organization.dataValues.name;
      res.dataValues.organization_type = res.organization.dataValues.type;
      // console.log();
      return res.dataValues;
    } else {
      return null;
    }
  }

  async getAllUserList({ offset, limit, current, organization_id }) {
    const where = { organization_id };
    if (current == 0) {
      Object.assign(where, { register_status: 0 });
    } else {
      // is_pass *= is_pass;
      Object.assign(where, {
        register_status: {
          [Op.ne]: 0,
        },
      });
    }
    // is_pass && is_pass * 1;
    // console.log('分页和限制', {offset, limit});
    return await User.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      offset,
      limit,
      attributes: [
        "id",
        "organization_id",
        "number",
        "role",
        "name",
        "phone",
        "email",
        "is_admin",
        "register_status",
        "admin_apply_status",
        "is_organization_admin",
        "createdAt",
        "updatedAt",
        "openid",
        "is_system_admin",
      ]
    });
  }

  // 获取指定的用户信息
  async getInfoLimit({ id }) {
    const whereOpt = {};
    id && Object.assign(whereOpt, { id });

    const res = await User.findOne({
      attributes: ["id", "username", "motto", "user_avatar"],
      where: whereOpt,
    });
    return res ? res.dataValues : null;
  }

  // 删除用户
  async delUser({ phone }) {
    return User.destroy({
      where: {
        phone,
      },
    });
  }

  // 更新用户信息
  async updateUserInfo({
    phone,
    is_organization_admin,
    is_admin,
    register_status,
    admin_apply_status,
    role,
    reason,
    password,
    email
  }) {
    const where = { phone };
    const updateData = {};

    reason && Object.assign(updateData, { reason });

    if (is_organization_admin != undefined) {
      Object.assign(updateData, { is_organization_admin });
    }

    if (is_admin != undefined) {
      Object.assign(updateData, { is_admin });
    }

    if (register_status != undefined) {
      Object.assign(updateData, { register_status });
    }

    if (admin_apply_status != undefined) {
      Object.assign(updateData, { admin_apply_status });
    }

    if (role != undefined) {
      Object.assign(updateData, { role });
    }

    if (password != undefined) {
      Object.assign(updateData, { password });
    }

    if (email != undefined) {
      Object.assign(updateData, { email });
    }

    return await User.update(updateData, { where });
  }
}

module.exports = new UserService();
