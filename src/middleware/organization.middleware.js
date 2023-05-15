const { create } = require("../service/organization.service");

const createOrganization = async (ctx, next) => {
  try {
    // 先生成一条组织机构记录，如果后续审核不通过，则删除用户信息和组织机构记录。
    const { organizationName: name, type, description } = ctx.request.body;
    const result = await create({ name, type, description });
    console.log("result: ", result);
    ctx.request.body.organization_id = result.id;
    ctx.request.body.organization_id = 2;
    await next();
  } catch (error) {
    // 返回服务器错误
  }
};

module.exports = {
  createOrganization,
}
