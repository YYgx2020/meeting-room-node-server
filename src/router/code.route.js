const Router = require("koa-router");

const { authCode } = require("../controller/code.controller");

const router = new Router({ prefix: "/api" });

router.get("/code", authCode);

module.exports = router;