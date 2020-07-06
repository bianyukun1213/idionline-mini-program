const color = require('../../tools/color.js')
const call = require('../../tools/request.js')
Page({
  data: {
    color: null,
    overlayOn: false,
    isLoading: true,
    article: {}
  },
  onLoad() {
    color.apl()
    this.setData({
      color: color.chk()
    })
    call.get({
      url: 'document',
      doSuccess: this.callback,
      exHandler: this.exHandler
    })
  },
  callback(data) {
    var result = getApp().towxml(data, 'markdown')
    this.setData({
      article: result,
      isLoading: false
    })
  },
  exHandler(code, codeFromIdionline, msg) {
    wx.vibrateLong()
    if (codeFromIdionline != undefined)
      wx.showToast({
        title: '错误：' + msg,
        icon: 'none',
        mask: true
      })
    else
      wx.showToast({
        title: '错误：' + code,
        icon: 'none',
        mask: true
      })
    var currentPage = getCurrentPages()[getCurrentPages().length - 1]
    setTimeout(function () {
      if (currentPage == getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/about/about'
        })
    }, 1500)
  },
  onShow() {
    var overlayOn = wx.getStorageSync('settings')['enableOverlay']
    if (overlayOn == undefined)
      overlayOn = false
    this.setData({
      overlayOn: overlayOn
    })
  }
})