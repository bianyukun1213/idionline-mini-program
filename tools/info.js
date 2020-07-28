const call = require('../tools/request.js')
const format = require('../tools/format.js')
var callb = null

function getLaunchInfo(callback, justRefresh) {
  if (getApp().globalData['launchInfo'] == null || justRefresh) {
    callb = callback
    console.log('开始请求启动信息')
    call.get({
      url: 'launchinfo/' + format.getUnixTimestamp(),
      data: {
        'openId': wx.getStorageSync('openId')
      },
      doSuccess: applyData
    })
  } else {
    console.log('全局变量中存在启动信息，未发送请求')
    if (typeof callback == 'function') {
      console.log('直接执行回调函数')
      callback()
    }
  }
}

function applyData(data) {
  getApp().globalData['launchInfo'] = data
  console.log('已将启动信息应用到全局变量：', getApp().globalData['launchInfo'])
  if (typeof callb == 'function') {
    console.log('将会执行回调函数')
    callb()
  }
}
module.exports.getLaunchInfo = getLaunchInfo