const color = require('../../tools/color.js')
Page({
  data: {
    value: null,
    id: null,
    name: null,
    show: false
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option.str)
    this.data['id'] = json['id']
    this.data['name'] = json['name']
    wx.setNavigationBarTitle({
      title: json['name']
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
  onCopy() {
    wx.vibrateShort()
    var str = '时间：' + new Date().toLocaleString() + '\n成语名称：' + this.data['name'] + '\n成语Id：' + this.data['id'] + '\n纠错内容：' + this.data['value']
    console.log(str)
    wx.setClipboardData({
      data: str
    })
  },
  onContact() {
    wx.vibrateShort()
  }
})