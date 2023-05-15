const { getOne } = require("../service/room.appoint.service");

class AppointController {
  async getSingleRecord(ctx) {
    let { room_id, date } = ctx.query;
    date += '';
    console.log('数据：', room_id, date);
    const res = await getOne({ room_id, date });
    ctx.body = {
      code: 200,
      message: "获取成功",
      result: res,
    };
  }
}

module.exports = new AppointController();
