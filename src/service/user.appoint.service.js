const { Op } = require("sequelize");
const UserAppoint = require("../model/user.appoint.model");
// const Room = require("../model/room.model");
const { getRoomInfo } = require("../service/room.service");

class UserAppointService {

  async searchByKeyWord({keyWord, user_id}) {
    const where = {
      user_id,
      [Op.or]: {
        contact: {
          [Op.like]: `%${keyWord}%`,
        },
        phone: {
          [Op.like]: `%${keyWord}%`,
        },
        reason: {
          [Op.like]: `%${keyWord}%`,
        },
        no_pass_reason: {
          [Op.like]: `%${keyWord}%`,
        }
      }
    };
    return UserAppoint.findAndCountAll({where})
  }

  async create({
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
  }) {
    return await UserAppoint.create({
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
  }

  async findDateRecord({
    current,
    offset,
    limit,
    room_id,
    date,
    start_time,
    end_time,
    user_id,
    organization_id
  }) {
    try {
      const where = { is_delete: false };
      room_id && Object.assign(where, { room_id: room_id * 1 });
      date && Object.assign(where, { date });
      start_time && Object.assign(where, { start_time });
      end_time && Object.assign(where, { end_time });
      user_id && Object.assign(where, { user_id: user_id * 1 });
      organization_id && Object.assign(where, { organization_id: organization_id * 1 });
      // console.log("查询条件：", room_id, date);
      if (current == 0) {
        Object.assign(where, { is_pass: 0 });
      } else if (current == 1) {
        Object.assign(where, {
          is_pass: {
            [Op.or]: [1, 2, 3],
          },
        });
      }
      const res1 = await UserAppoint.findAndCountAll({
        where,
        offset,
        limit,
        order: [["id", "DESC"]],
      });
      // 查询返回会议室名称
      if (res1.count) {
        const rows = res1.rows;
        for (let i = 0; i < rows.length; i++) {
          const roomInfo = await getRoomInfo({ id: rows[i].room_id * 1 });
          Object.assign(res1.rows[i].dataValues, { roomInfo });
        }
        return res1;
      } else {
        return res1;
      }
    } catch (error) {
      console.log("查询出错：", error);
    }
  }

  async update({ id, is_pass, no_pass_reason, approval_time, password }) {
    const where = { id };
    const update = { is_pass, no_pass_reason, approval_time, password };
    return await UserAppoint.update(update, { where });
  }
}

module.exports = new UserAppointService();
