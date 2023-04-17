const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(Model zd_user -> 表 zd_users)
const User = seq.define('yg_user', {
  // id 会被sequelize自动创建, 管理
  // 用户名
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名, 唯一',
  },
  // 邮箱
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '注册邮箱，唯一'
  },
  // 密码
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码',
  },
  // 注册时间
  register_time: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户注册的时间',
  },
  // 用户头像
  user_avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户头像',
  },
  motto: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '格言',
  },
  // 是否是管理员
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员',
  },
})

// 强制同步数据库(创建数据表)
// { force: true }
User.sync()

module.exports = User