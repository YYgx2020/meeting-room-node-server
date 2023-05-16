const Router = require("koa-router");
const router = new Router({ prefix: "/api/room" });

const { add, getMiniList, updateRoomInfo, searchByOrgid, getConditionalQuery } = require("../controller/room.controller");
const { auth } = require("../middleware/user.middleware");

router.post('/add', auth, add);

router.get('/getMiniList', auth, getMiniList);

router.post('/updateRoomInfo', auth, updateRoomInfo);

router.get('/searchByOrgid', auth, searchByOrgid);

router.get('/getConditionalQuery', auth, getConditionalQuery);

module.exports = router;