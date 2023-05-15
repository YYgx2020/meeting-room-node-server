const Router = require("koa-router");
const router = new Router({ prefix: "/api/userAppoint" });

const { auth } = require("../middleware/user.middleware");
const {
  add,
  getDateRecord,
  updateUserAppoint,
  getApproval,
  adminAdd,
  getLimitList,
  getConflictAppointRecord
} = require("../controller/user.appoint.controller");

router.post("/add", auth, add);

router.post("/adminAdd", auth, adminAdd);

router.get("/getDateRecord", auth, getDateRecord);

router.post("/update", auth, updateUserAppoint);

router.get("/getApproval", auth, getApproval);

router.get("/getLimitList", auth, getLimitList);

router.get("/refresh", auth, getLimitList);

router.post("/cancel", auth, updateUserAppoint);

router.get("/getConflictAppointRecord", auth, getConflictAppointRecord);

module.exports = router;
