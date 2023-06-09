const Router = require("koa-router");
const router = new Router({ prefix: "/api/organization" });

const { auth, crpytPassword, verifyPhone } = require("../middleware/user.middleware");

const { createUser } = require("../controller/user.controller");

const { createOrganization, getOrganizationList, updateOrganizationInfo, searchByKeyWord, del, sysSearch, delOrg, getDeleteList, getList } = require("../controller/organization.controller");
const { judgeCodeIsExpired } = require("../middleware/code.middleware");

// 创建一条组织机构记录和该组织机构的管理员信息
// router.post("/create", test, crpytPassword, createUser);
router.post("/create", verifyPhone, judgeCodeIsExpired, createOrganization, crpytPassword, createUser);

// 获取组织机构记录
router.get('/get', auth, getOrganizationList);

router.get('/refresh', auth, getOrganizationList);

// 删除更新信息，删除组织机构，删除申请人记录
router.post('/del', auth, del);

router.post('/pass', auth, updateOrganizationInfo);

router.get('/search', searchByKeyWord);

router.get('/sys/search', auth, sysSearch);

router.post('/sys/del', auth, delOrg);

router.get('/deleteList', auth, getDeleteList);

// 后台获取通过列表
router.get('/sys/getPassList', auth, getList);

router.get('/sys/searchByKeyWord', auth, searchByKeyWord);

module.exports = router;
