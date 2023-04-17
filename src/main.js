const { APP_PORT } = require('./config/config.default')

const app = require('./app')
// 测试
// app.use((ctx, next) => {
//   ctx.body = 'hello world'
// })

const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule()
rule.second = [0, 10, 20, 30, 40, 50]

// let job = schedule.scheduleJob(rule, () => {
//   console.log(new Date());
// });

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})