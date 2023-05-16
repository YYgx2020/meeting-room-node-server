const {
  create,
  getOwnRoomList,
  update,
  getRoomInfo,
  getConditionalQuery
} = require("../service/room.service");

class RoomController {
  async add(ctx, next) {
    try {
      const {
        cover,
        organization_id,
        code,
        name,
        address,
        contact,
        phone,
        number,
        desc,
      } = ctx.request.body;

      const res = await create({
        cover,
        organization_id,
        code,
        name,
        address,
        contact,
        phone,
        number,
        desc,
      });
      ctx.body = {
        code: 200,
        message: "添加成功",
        result: "",
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getMiniList(ctx, next) {
    try {
      let { organization_id, offset, limit } = ctx.query;
      console.log("limit: ", limit);
      offset *= 1;
      limit *= 1;
      const res = await getOwnRoomList({ organization_id, offset, limit });
      // console.log();
      ctx.body = {
        code: 200,
        message: "获取成功",
        result: res,
      };
    } catch (error) {
      console.error("错误：", error);
    }
  }

  async updateRoomInfo(ctx, next) {
    try {
      const {
        id,
        name,
        code,
        cover,
        address,
        contact,
        phone,
        number,
        desc,
        organization_id,
      } = ctx.request.body;
      const res = await update({
        id,
        name,
        code,
        cover,
        address,
        contact,
        phone,
        number,
        desc,
        organization_id,
      });
      ctx.body = {
        code: 200,
        message: "更新成功",
        result: "",
      };
    } catch (error) {
      console.error(error);
    }
  }

  async searchByOrgid(ctx) {
    const { keyWord, organization_id } = ctx.query;
    const res = await getOwnRoomList({ organization_id, keyWord });
    ctx.body = {
      code: 200,
      message: "获取成功",
      result: res,
    };
  }

  async getConditionalQuery(ctx) {
    const { date, code, start_time, end_time, number, organization_id } = ctx.query;
    const res = await getConditionalQuery({ date, code, start_time, end_time, number, organization_id });
    ctx.body = {
      code: 200,
      message: '查找成功',
      result: res,
    }
  }
}

module.exports = new RoomController();
