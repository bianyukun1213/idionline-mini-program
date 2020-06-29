const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    nickName: null,
    show: false,
    color: null,
    overlayOn: false
  },
  onLoad() {
    color.apl()
    this.setData({
      color: color.chk()
    })
  },
  onShow() {
    var overlayOn = wx.getStorageSync('settings')['enableOverlay']
    if (overlayOn == undefined)
      overlayOn = false
    this.setData({
      overlayOn: overlayOn
    })
  },
  onRegister() {
    wx.vibrateShort()
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code)
          call.uniFunc('editor/register', 'POST', {
            'code': res.code,
            'platTag': getApp().globalData['platform']['tag'],
            'nickName': that.data['nickName']
          }, that.callback)
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
      icon: 'none',
      mask: true
    })
    console.log('注册成功：' + data)
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 1500)
  },
})