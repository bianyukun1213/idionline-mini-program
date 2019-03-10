const call = require('../../tools/request.js')
Page({
  data: {
    nickName: null,
    show: false
  },
  onLogin() {
    wx.vibrateShort()
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          call.get({
            url: 'editor/login/' + res.code,
            doSuccess: that.callback
          })
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
    if (data['openid'] != null) {
      wx.showToast({
        title: '已获取登录信息！',
        icon: 'none'
      })
      console.log('已获取登录信息：' + data['openid'])
      wx.setStorageSync('openId', data['openid'])
    }
  },
  onRegister() {
    wx.vibrateShort()
    var openId = wx.getStorageSync('openId')
    if (openId != null && openId != "") {
      call.registerEditor(openId, this.data['nickName'], this.done)
    } else {
      wx.showToast({
        title: '缺少参数！',
        icon: 'none'
      })
      wx.vibrateLong()
    }
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
    console.log('完成注册：' + data)
  }
})