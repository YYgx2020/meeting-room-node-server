const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const Organization = require("../model/organization.model");

// 创建模型
const User = seq.define("user", {
  // id 会被sequelize自动创建, 管理
  organization_id: {
    type: DataTypes.INTEGER,
    comment: "所属组织机构id",
  },
  openid: {
    type: DataTypes.STRING,
    comment: "用户的openid，用来发送微信小程序的订阅消息",
  },
  number: {
    type: DataTypes.CHAR(20),
    comment: "学号（学生才有）",
  },
  role: {
    type: DataTypes.INTEGER(1),
    comment: "用户角色：1-学生；2-教师；3-企业员工；4-组织机构的管理员",
  },
  name: {
    type: DataTypes.CHAR(20),
    comment: "姓名",
  },
  phone: {
    type: DataTypes.CHAR(11),
    comment: "电话",
  },
  email: {
    type: DataTypes.CHAR(60),
    comment: "邮箱",
  },
  password: {
    type: DataTypes.CHAR(60),
    comment: "密码",
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    comment: "是否为管理员",
    defaultValue: false,
  },
  register_status: {
    type: DataTypes.INTEGER(1),
    comment: "注册状态：0-待审核（默认）；1-审核通过；-1-审核不通过；",
    defaultValue: 0,
  },
  admin_apply_status: {
    type: DataTypes.INTEGER(1),
    comment:
      "申请成为组织机构下的一些会议室的管理员的状态：0-未申请（默认）；1-待审核；2-已通过；3-未通过；4-已取消；5-已注销；",
    defaultValue: 0,
  },
  is_organization_admin: {
    type: DataTypes.BOOLEAN,
    comment:
      "是否是组织机构下注册的管理员，用户入驻平台申请时设置为 true，其他用户均设置为 false；",
      defaultValue: false,
  },
  is_system_admin: {
    type: DataTypes.BOOLEAN,
    comment: "是否是系统管理员，false-不是（默认）；true-是；",
    defaultValue: false,
  },
  reason: {
    type: DataTypes.STRING,
    comment: '审核不通过原因',
  },
});

User.belongsTo(Organization, { foreignKey: "organization_id" });
// User.belongsTo(Organization);

// 强制同步数据库(创建数据表)
// { force: true }
// User.sync({ alter: true });
User.sync();

module.exports = User;
