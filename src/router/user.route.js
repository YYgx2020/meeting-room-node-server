// 专门用来上传图片的路由
const Router = require("koa-router");
const router = new Router({ prefix: "/api/user" });

const {
  login,
  createUser,
  getUserList,
  updateUserInfo,
  del,
  update,
} = require("../controller/user.controller");

const {
  verifyLogin,
  verifyPass,
  verifyPhone,
  crpytPassword,
  verifyUserIsExist
} = require("../middleware/user.middleware");
const { judgeCodeIsExpired } = require("../middleware/code.middleware");
const { auth } = require("../middleware/user.middleware");

// 用户登录，判断账号是否存在，再判断审核注册审核是否通过
router.post("/login", verifyLogin, verifyPass, login);

router.post(
  "/register",
  verifyPhone,
  judgeCodeIsExpired,
  crpytPassword,
  createUser
);

router.get("/get", auth, getUserList);

router.get("/refresh", auth, getUserList);

router.post("/pass", auth, updateUserInfo);

router.post('/del', auth, del);

router.post('/changePassword', verifyUserIsExist, verifyPass,judgeCodeIsExpired, crpytPassword, updateUserInfo);

router.post('/updateUserInfo', auth, update);

module.exports = router;
