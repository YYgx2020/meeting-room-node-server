// 验证码暂存表
const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const Code = seq.define("code", {
  // 邮箱
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "邮箱，唯一",
  },
  // 验证码
  verifyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "注册或者找回密码的验证码",
  },
  send_time: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "验证码下发时间",
  },
});

// Code.sync({force:true})
Code.sync();

module.exports = Code;