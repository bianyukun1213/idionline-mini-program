const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    nickName: null,
    show: false
  },
  onLoad() {
    color.apl()
  },
  onRegister() {
    wx.vibrateShort()
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          call.uniFunc('editor/register', 'POST', {
            'code': res.code,
            'platStr': getApp().globalData['platStr'],
            'nickName': that.data['nickName']
          }, that.callback)
        }
      }
    })
  },
  onChange(event) {
    if (event.detail == null || event.detail == '') {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: true
      })
    }
    this.data['nickName'] = event.detail
  },
  callback(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
    console.log('尝试注册：' + data)
  },
})