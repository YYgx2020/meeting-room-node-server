const Room = require("../model/room.model");

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
      const where = { organization_id, is_deleted: false };
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
}

module.exports = new RoomService();
