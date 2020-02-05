const color = require('../../tools/color.js')
Page({
  data: {
    idioms2Disp: null,
    tmp: [],
    page: 0,
    showPrev: false,
    showNext: false,
    color: null,
    overlayOn: false
  },
  onLoad(option) {
    color.apl()
    this.setData({
      color: color.chk()
    })
    var idioms = JSON.parse(option['str'])
    var array = []
    for (var key in idioms) {
      var obj = {}
      obj[key] = idioms[key]
      array.push(obj)
    }
    var idx = 0
    for (var i = 0; i < array.length; i++) {
      if (i % 20 == 0 && i != 0) {
        this.data['tmp'].push(array.slice(idx, i))
        idx = i
      }
      if ((i + 1) == array.length)
        this.data['tmp'].push(array.slice(idx, (i + 1)))
    }
    //更新页面。
    this.setData({
      tmp: this.data['tmp'],
      idioms2Disp: this.data['tmp'][0]
    })
    if (this.data['tmp'].length > 1)
      this.setData({
        showNext: true
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
  onPrev() {
    wx.vibrateShort()
    this.setData({
      page: this.data['page'] - 1,
      idioms2Disp: this.data['tmp'][this.data['page'] - 1]
    })
    console.log('翻到第 ' + (this.data['page'] + 1) + ' 页')
    if (this.data['page'] < this.data['tmp'].length - 1)
      this.setData({
        showNext: true
      })
    if (this.data['page'] == 0)
      this.setData({
        showPrev: false
      })
  },
  onNext() {
    wx.vibrateShort()
    this.setData({
      page: this.data['page'] + 1,
      idioms2Disp: this.data['tmp'][this.data['page'] + 1]
    })
    console.log('翻到第 ' + (this.data['page'] + 1) + ' 页')
    if (this.data['page'] > 0)
      this.setData({
        showPrev: true
      })
    if (this.data['page'] == this.data['tmp'].length - 1)
      this.setData({
        showNext: false
      })
  }
})