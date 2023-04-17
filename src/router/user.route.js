// 专门用来上传图片的路由
const Router = require('koa-router')

const {getInfo, update, getInfoLimit} = require('../controller/user.controller')
const router = new Router({prefix: '/api/user'})

// 获取用户信息
router.get('/get', getInfo)

// 获取用户头像、用户名、格言
router.get('/getLimit', getInfoLimit)

// 修改用户信息
router.post('/update', update)

module.exports = router