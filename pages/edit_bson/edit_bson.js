const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    id: null,
    openId: null,
    value: null,
    show: false,
    color: null,
    overlayOn: false
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option['str'])
    this.data['id'] = json['id']
    this.data['openId'] = json['openId']
    call.get({
      url: 'idiom/' + this.data['id'],
      data: {
        'bson': 1,
        'openId': this.data['openId']
      },
      doSuccess: this.callback,
      exHandler: this.exHandler
    })
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
    if (event.detail == null || event.detail == '') {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: true
      })
    }
    this.data['value'] = event.detail
  },
  callback(data) {
    this.setData({
      value: data,
      show: true
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
    var prevPage = getCurrentPages()[getCurrentPages().length - 2]
    setTimeout(function () {
      if (currentPage == getCurrentPages()[getCurrentPages().length - 1] || prevPage == getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/index/index'
        })
    }, 1500)
  },
  onSubmit() {
    wx.vibrateShort()
    var dt = {
      'openId': this.data['openId'],
      'bsonStr': this.data['value'],
      'updates': null
    }
    call.uniFunc('idiom/' + this.data['id'], 'PUT', dt, this.done)
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none',
      mask: true
    })
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      refresh: true
    })
    if (this.data['id'] == getApp().globalData['launchInfo']['dailyIdiom']['id'])
      getApp().globalData['refreshOnIndex'] = true
    setTimeout(function () {
      if (getCurrentPages()[getCurrentPages().length - 2] == prevPage)
        wx.navigateBack()
    }, 1500)
  }
})