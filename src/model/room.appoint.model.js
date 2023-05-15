const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const RoomAppoint = seq.define('room_appoint', {
  room_id: {
    type: DataTypes.INTEGER(5),
    comment: '会议室id',
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
});

RoomAppoint.sync();

module.exports = RoomAppoint;