const Organization = require("../model/organization.model");

const { Op } = require("sequelize");

class OrganizationService {

  async getList({ offset, limit, is_pass, is_delete }) {
    offset *= 1;
    limit *= 1;
    const where = {
      is_pass,
      is_delete,
      is_system_organization: false,
    }

    return await Organization.findAndCountAll({
      where,
      offset,
      limit,
      order: [['id', 'DESC']],
    })
  }

  async getDeleteList({offset, limit}) {
    offset *= 1;
    limit *= 1;
    const where = {
      is_delete: true,
    }
    const res = await Organization.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      offset,
      limit,
    });
    return res;
  }

  async create({ name, type, description, admin, phone, user_openid }) {
    const res = await Organization.create({
      name,
      type,
      description,
      admin,
      phone,
      user_openid,
    });
    return res.dataValues;
  }

  // 分页获取所有记录
  async getAllOrganizationList({ offset, limit, current }) {
    console.log("数据：", { offset, limit, current });
    const where = { is_system_organization: false, is_delete: false, };
    if (current == 0) {
      Object.assign(where, { is_pass: 0 });
    } else if (current == 1) {
      // is_pass *= is_pass;
      Object.assign(where, {
        is_pass: {
          [Op.or]: [1, -1],
        },
      });
    }
    // is_pass && is_pass * 1;
    // console.log('分页和限制', {offset, limit});
    return await Organization.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      offset,
      limit,
    });
  }

  async updateOrganizationInfo({ id, is_pass, no_pass_reason, is_delete, ban_reason }) {
    const where = {};
    const updateData = {};
    id && Object.assign(where, { id });
    if (is_pass != undefined) {
      Object.assign(updateData, { is_pass });
      updateData.approval_time = new Date();
    }
    // console.log('is_delete: ', is_delete);
    // console.log('is_delete: ', typeof is_delete);
    if (is_delete != undefined) {
      // console.log(111);
      Object.assign(updateData, { is_delete });
    }
    no_pass_reason && Object.assign(updateData, { no_pass_reason });
    ban_reason && Object.assign(updateData, { ban_reason });
    console.log('updateData: ', updateData);
    return await Organization.update(updateData, { where });
  }

  async getAll({ keyWord }) {
    return await Organization.findAll({
      where: {
        is_pass: 1,
        is_delete: false,
        is_system_organization: false,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyWord}%`,
            },
          },
        ],
      },

      attributes: [
        'name',
        'type',
        'description',
        'admin',
        'phone',
        "id",
        "createdAt"
      ]
    });
  }

  // 删除组织机构
  async delOrganization({id}) {
    return Organization.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = new OrganizationService();
