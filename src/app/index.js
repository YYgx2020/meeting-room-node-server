const path = require('path')

const Koa = require('koa')
const KoaBody = require('koa-body')
const router = require('../router')
const errHandler = require('./errHandler')
const parameter = require('koa-parameter')
const app = new Koa()
const cors = require('koa-cors')

// 设置跨域
app.use(cors({
  origin: function (ctx) {
    /*if (ctx.url === '/cors') {
        return "*"; // 允许来自所有域名请求
    }*/
    return "*";
    // return 'http://localhost:8080';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'], //设置允许的HTTP请求类型
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(
  KoaBody({
    multipart: true,  // 支持图片文件
    // formidable: {
    //   uploadDir: path.join(__dirname, '../upload/img'),  // 设置上传目录
    //   keepExtensions: true,  // 保留扩展名 
    // }
  })
)
// 这样写之后，在浏览器地址栏输入 地址+ 文件夹/文件名 即可回显图片
// app.use(KoaStatic(path.join(__dirname, '../upload')))
app.use(parameter(app))  // 解析 body
app.use(router.routes()).use(router.allowedMethods())

// 统一的错误处理
app.on('error', errHandler)


module.exports = app