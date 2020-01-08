const color = require('../../tools/color.js')
Page({
  data: {
    radio: '1',
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
  onChange(event) {
    this.setData({
      radio: event.detail
    })
  },
  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name
    })
  },
  onConfirm() {
    if (this.data['radio'] == '4') {
      var settings = wx.getStorageSync('settings') || {}
      settings['disableAds'] = true
      wx.setStorageSync('settings', settings)
      wx.showToast({
        title: '广告已关闭！'
      })
      wx.vibrateShort()
    } else {
      wx.showToast({
        title: '回答错误！',
        icon: 'none'
      })
      wx.vibrateLong()
    }
  }
})