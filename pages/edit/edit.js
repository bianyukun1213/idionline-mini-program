const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    id: null,
    updates: null
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option.str)
    //更新页面。
    this.setData({
      id: json['id'],
      updates: json['updates']
    })
  },
  onChange(event) {
    this.data['updates'][event.currentTarget.id] = event.detail
  },
  onSubmit() {
    wx.vibrateShort()
    for (var k in this.data['updates']) {
      if (this.data['updates'][k] == null || this.data['updates'][k] == '') {
        wx.showToast({
          title: '释义文本存在空位！',
          icon: 'none'
        })
        wx.vibrateLong()
        return
      }
    }
    var dt = {
      'openId': wx.getStorageSync('openId'),
      'updates': this.data['updates']
    }
    call.updateIdiom(this.data['id'], dt, this.done)
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
  }
})