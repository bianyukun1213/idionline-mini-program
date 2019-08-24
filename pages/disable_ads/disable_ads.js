const color = require('../../tools/color.js')
Page({
  data: {
    radio: '1',
    color: null
  },
  onLoad() {
    color.apl()
    this.setData({
      color: color.chk()
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
      wx.setStorageSync('settings', {
        'disableAds': true
      })
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