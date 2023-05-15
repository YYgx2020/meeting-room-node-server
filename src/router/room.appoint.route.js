const Router = require("koa-router");
const router = new Router({ prefix: "/api/room_appoint" });

const { auth } = require("../middleware/user.middleware");
const { getSingleRecord } = require("../controller/room.appoint.controller");

router.get("/getSingleRecord", auth, getSingleRecord);

module.exports = router;
