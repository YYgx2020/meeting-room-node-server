const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const Room = seq.define('room', {
  cover: {
    type: DataTypes.STRING,
    comment: '会议室封面图',
  },
  code: {
    type: DataTypes.CHAR(20),
    comment: '会议室编号'
  },
  name: {
    type: DataTypes.CHAR(30),
    comment: '会议室名称',
  },
  contact: {
    type: DataTypes.CHAR(30),
    comment: '会议室联系人',
  },
  phone: {
    type: DataTypes.CHAR(11),
    comment: '会议室联系人电话',
  },
  address: {
    type: DataTypes.STRING(200),
    comment: '会议室地址',
  },
  organization_id: {
    type: DataTypes.INTEGER(11),
    comment: '所属组织机构',
  },
  number: {
    type: DataTypes.INTEGER(5),
    comment: '会议室限定人数',
  },
  desc: {
    type: DataTypes.STRING(200),
    comment: '会议室描述',
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '逻辑删除',
  },
})

// Room.sync({alter: true});
Room.sync();

module.exports = Room;