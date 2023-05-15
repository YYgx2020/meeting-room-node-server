const {
  create,
  findDateRecord,
  update,
} = require("../service/user.appoint.service");

class UserAppointController {
  // 获取有冲突的预约消息
  async getConflictAppointRecord(ctx, next) {
    const { date, room_id, start_time, end_time } = ctx.query;
    const res = await findDateRecord({ date, room_id, start_time, end_time });
    ctx.body = {
      code: 200,
      message: '获取成功',
      result: res,
    }
  }

  async getLimitList(ctx, next) {
    let { current, offset, limit, user_id, organization_id } = ctx.query;
    offset *= 1;
    limit *= 1;
    const res = await findDateRecord({
      current,
      offset,
      limit,
      user_id,
      organization_id,
    });
    ctx.body = {
      code: 200,
      message: "获取成功",
      result: res,
    };
  }

  async add(ctx, next) {
    try {
      const {
        room_id,
        user_id,
        organization_id,
        contact,
        reason,
        phone,
        date,
        start_time,
        end_time,
        user_openid,
      } = ctx.request.body;
      const res = await create({
        room_id,
        user_id,
        organization_id,
        contact,
        reason,
        phone,
        date,
        start_time,
        end_time,
        user_openid,
      });
      ctx.body = {
        code: 200,
        message: "申请成功",
        result: res,
      };
    } catch (error) {
      console.error("失败原因：", error);
    }
  }

  async getDateRecord(ctx, next) {
    try {
      const { room_id, date } = ctx.query;
      const res = await findDateRecord({ room_id, date });
      ctx.body = {
        code: 200,
        message: "",
        result: res,
      };
    } catch (error) {
      console.error("出错了：", error);
    }
  }

  async updateUserAppoint(ctx, next) {
    try {
      const { id, is_pass, no_pass_reason, approval_time, password } =
        ctx.request.body;
      const res = await update({
        id,
        is_pass,
        no_pass_reason,
        approval_time,
        password,
      });
      ctx.body = {
        code: 200,
        message: "",
        result: res,
      };
    } catch (error) {
      console.error("函数失败原因：", error);
    }
  }

  async getApproval(ctx, next) {
    try {
      const { date, start_time, end_time } = ctx.query;
      console.log("数据：", date, start_time, end_time);
      const res = await findDateRecord({ date, start_time, end_time });
      ctx.body = {
        code: 200,
        message: "",
        result: res,
      };
    } catch (error) {
      console.error("函数失败原因：", error);
    }
  }

  async adminAdd(ctx, next) {
    try {
      const {
        room_id,
        user_id,
        organization_id,
        contact,
        reason,
        phone,
        date,
        start_time,
        end_time,
        user_openid,
      } = ctx.request.body;
      const res = await create({
        room_id,
        user_id,
        organization_id,
        contact,
        reason,
        phone,
        date,
        start_time,
        end_time,
        user_openid,
      });
      await update({ id: res.id, is_pass: 1, approval_time: new Date() });
      ctx.body = {
        code: 200,
        message: "新建成功",
        result: res,
      };
    } catch (error) {
      console.error("出错原因：", error);
    }
  }
}

module.exports = new UserAppointController();
