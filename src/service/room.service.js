const Room = require("../model/room.model");
const UserAppoint = require("../model/user.appoint.model");

const { Op } = require("sequelize");

class RoomService {
  async create({
    cover,
    organization_id,
    code,
    name,
    address,
    contact,
    phone,
    number,
    desc,
  }) {
    return await Room.create({
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
  }

  async getOwnRoomList({ organization_id, offset, limit, keyWord }) {
    try {
      const where = { organization_id, is_delete: false };
      if (keyWord !== undefined) {
        Object.assign(where, {
          [Op.or]: [
            {
              code: {
                [Op.like]: `%${keyWord}%`,
              },
            },
            {
              name: {
                [Op.like]: `%${keyWord}%`,
              },
            },
            {
              address: {
                [Op.like]: `%${keyWord}%`,
              },
            },
          ],
        });
      }
      return await Room.findAndCountAll({
        where,
        order: [["id", "DESC"]],
        offset,
        limit,
      });
    } catch (error) {
      console.log("数据库查询出错：", error);
    }
  }

  async update({
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
    is_delete,
  }) {
    const where = { id, organization_id };
    const updateData = {
      cover,
      code,
      name,
      address,
      contact,
      phone,
      number,
      desc,
      is_delete
    };
    return await Room.update(updateData, { where });
  }

  async getRoomInfo({ id, keyWord }) {
    const where = {};
    id && Object.assign(where, { id });
    if (keyWord !== undefined) {
      Object.assign(where, {
        [Op.or]: [
          {
            code: {
              [Op.like]: `%${keyWord}%`,
            },
          },
          {
            name: {
              [Op.like]: `%${keyWord}%`,
            },
          },
          {
            address: {
              [Op.like]: `%${keyWord}%`,
            },
          },
        ],
      });
    }
    const res = await Room.findOne({ where });
    return res ? res.dataValues : null;
  }

  async getConditionalQuery({
    date,
    code,
    start_time,
    end_time,
    number,
    organization_id,
  }) {
    try {
      const where = { organization_id: organization_id * 1 };
      // if (code !== undefined) {
      //   Object.assign(where, { code: code * 1 });
      // }
      Object.assign(where, { date, start_time, end_time });
      // 先去用户预约表查询日期、时间段和会议室合适的记录，然后再筛选自己机构下的会议室
      const res1 = await UserAppoint.findAndCountAll({ where });
      console.log('预约查询参数：', where);
      console.log("res1=================", res1);
      // 获取该机构下的会议室信息
      const where2 = { organization_id: organization_id * 1 };
      console.log('code类型', typeof code);
      if (code != 'undefined') {
        Object.assign(where2, { code: code * 1 });
      }
      if (number != 'undefined') {
        Object.assign(where2, {
          number: {
            [Op.gte]: number * 1,
          },
        });
      }
      console.log('查询参数2：', where2);
      const res2 = await Room.findAndCountAll({
        where: where2,
      });
      console.log("res2=================", res2);
      let res = [];
      for (let i = 0; i < res2.rows.length; i++) {
        Object.assign(res2.rows[i].dataValues, {appoint_info: []});
        console.log("查看每一条记录：", res2.rows[i].dataValues);
        for (let j = 0; j < res1.rows.length; j++) {
          if (res1.rows[j].dataValues.room_id == res2.rows[i].dataValues.id) {
            res2.rows[i].dataValues.appoint_info.push(res1.rows[j]);
          }
        }
        res.push(res2.rows[i].dataValues);
        console.log('res: ', res[i]);
      }
      console.log("预约记录", res);
      return res;
    } catch (error) {
      console.error("================", error);
    }
  }
}

module.exports = new RoomService();
