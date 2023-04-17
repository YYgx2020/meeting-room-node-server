const { Sequelize } = require('sequelize')

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',  // 数据库类型
  define: {
    freezeTableName: true,  // 强制表名称等于模型名称
  },
  timezone: "+08:00",  // 记录创建和更新时间设置为北京时间，但是获取记录打印出来的时间仍然是UTC标准时间
})

seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败', err)
  })

module.exports = seq;