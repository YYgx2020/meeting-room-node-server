const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const User = require("../model/user.model");

const Organization = seq.define("organization", {
  name: {
    type: DataTypes.CHAR(60),
    comment: "所属组织机构名称",
  },
  type: {
    type: DataTypes.INTEGER(1),
    comment: "所属组织机构类型：1-学校；2-企业；",
  },
  description: {
    type: DataTypes.TEXT,
    comment: "组织机构描述（可为空）",
  },
  is_pass: {
    type: DataTypes.INTEGER(1),
    comment: "审核状态，0-待审核；1-审核通过；-1-审核不通过；",
    defaultValue: 0,
  },
  // user_id: {
  //   type: DataTypes.INTEGER,
  //   comment: "组织机构管理员的id，更新管理员信息时再获取",
  // },
  is_system_organization: {
    type: DataTypes.BOOLEAN,
    comment:
      "是否是系统平台机构，用来标记系统管理员的，false-不是（默认）；true-是；",
    defaultValue: false,
  },
  admin: {
    type: DataTypes.CHAR(20),
    comment: '组织机构的管理员',
  },
  phone: {
    type: DataTypes.CHAR(11),
    comment: '组织机构管理员的联系方式'
  },
  approval_time: {
    type: DataTypes.DATE,
    comment: '管理员审批日期'
  },
  no_pass_reason: {
    type: DataTypes.TEXT,
    comment: '申请不通过原因',
  },
  is_delete: {
    type: DataTypes.CHAR(1),
    comment: '标记是否被删除了，若当前组织机构的审核不通过，则将当前组织机构的删除状态设置为 true',
    defaultValue: false,
  },
  user_openid: {
    type: DataTypes.STRING,
    comment: '申请人的openid，用于发送订阅消息通知用户审核结果',
  },
  ban_reason: {
    type: DataTypes.TEXT,
    comment: '平台被封禁的原因',
  },
});

// 一个组织机构可以与多个用户对应，也就是说一个组织机构中可以包含多个用户
// Organization.hasMany(User);

// Organization.sync({ alter: true });
Organization.sync();

module.exports = Organization;
