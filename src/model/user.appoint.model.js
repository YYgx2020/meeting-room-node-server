const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const UserAppoint = seq.define('user_appoint', {
  room_id: {
    type: DataTypes.INTEGER(5),
    comment: '会议室id',
  },
  organization_id: {
    type: DataTypes.INTEGER(5),
    comment: '组织id',
  },
  user_id: {
    type: DataTypes.INTEGER(5),
    comment: '用户id',
  },
  contact: {
    type: DataTypes.CHAR(20),
    comment: '预约联系人',
  },
  phone: {
    type: DataTypes.CHAR(11),
    comment: '预约人电话',
  },
  date: {
    type: DataTypes.STRING(100),
    comment: '预约日期'
  },
  start_time: {
    type: DataTypes.CHAR(30),
    comment: '开始时间段'
  },
  end_time: {
    type: DataTypes.CHAR(30),
    comment: '结束时间段'
  },
  reason: {
    type: DataTypes.STRING(200),
    comment: '用户预约申请原因'
  },
  no_pass_reason: {
    type: DataTypes.STRING(200),
    comment: '管理员审核不通过原因'
  },
  is_pass: {
    type: DataTypes.INTEGER(1),
    defaultValue: 0,
    comment: '是否通过审核，0是待审核，1是审核通过，2是审核不通过，3是用户主动取消申请'
  },
  user_openid: {
    type: DataTypes.STRING(100),
    comment: "用户openid，用于给用户发送订阅消息的"
  },
  is_delete: {
    type: DataTypes.BOOLEAN,
    comment: '逻辑删除，默认未删除',
    defaultValue: false,
  },
  approval_time: {
    type: DataTypes.DATE,
    comment: '审批时间'
  },
  password: {
    type: DataTypes.CHAR(6),
    comment: '会议室密码',
  },
});


// UserAppoint.sync({alter: true});
UserAppoint.sync();

module.exports = UserAppoint;