const Code = require("../model/code.model");

class CodeService {
  // 创建一条验证码记录
  async createCode(email, verifyCode) {
    const send_time = new Date().getTime() + "";
    const res = await Code.create({ email, verifyCode, send_time });
    // console.log('验证码保存结果：', res);
    // return res.dataValues
  }

  // 获取邮箱对应的验证码，如果没有获取到，说明已经过期被删除了
  // 获取用户信息
  async getCodeInfo({ email }) {
    const whereOpt = {};

    email && Object.assign(whereOpt, { email });

    const res = await Code.findOne({
      attributes: ["id", "email", "verifyCode", "send_time"],
      where: whereOpt,
    });

    return res ? res.dataValues : null;
  }

  // 删除验证码
  async deleteCode(email) {
    // console.log("email: ", email);
    const res = await Code.destroy({
      where: {
        email,
      },
    });
    // console.log('验证码删除结果：', res);
  }
}

module.exports = new CodeService();
