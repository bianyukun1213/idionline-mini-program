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
        title: '广告已关闭！',
        mask: true
      })
      wx.vibrateShort()
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      setTimeout(function () {
        if (currentPage == getCurrentPages()[getCurrentPages().length - 1])
          wx.navigateBack()
      }, 1500)
    } else {
      wx.showToast({
        title: '答案错误！',
        icon: 'none',
        mask: true
      })
      wx.vibrateLong()
    }
  }
})