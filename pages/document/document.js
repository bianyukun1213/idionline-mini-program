const color = require('../../tools/color.js')
const call = require('../../tools/request.js')
const info = require('../../tools/info.js')
Page({
  data: {
    shareFlag: false,
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
    info.getLaunchInfo(this.infoCallback)
    call.get({
      url: 'document',
      doSuccess: this.callback,
      exHandler: this.exHandler
    })
  },
  infoCallback() {
    this.setData({
      color: color.chk()
    })
    color.apl()
  },
  callback(data) {
    var result = getApp().towxml(data, 'markdown')
    this.setData({
      article: result,
      isLoading: false
    })
    this.data['shareFlag'] = true
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
  },
  onShareAppMessage() {
    console.log('尝试转发帮助文档页面')
    if (this.data['shareFlag']) {
      return {
        title: '点击查看帮助文档',
        imageUrl: '/icons/share.png',
      }
    }
    return {
      imageUrl: '/icons/share.png',
      path: '/pages/index/index'
    }
  },
})