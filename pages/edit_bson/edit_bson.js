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
    this.data['openId'] = json['openId'],
      call.get({
        url: 'idiom/' + this.data['id'] + '/bson/' + this.data['openId'],
        doSuccess: this.callback
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
  onSubmit() {
    wx.vibrateShort()
    var dt = {
      'openId': this.data['openId'],
      'bsonMode': true,
      'bsonStr': this.data['value'],
      'updates': null
    }
    call.uniFunc('idiom/' + this.data['id'], 'PUT', dt, this.done)
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
  }
})