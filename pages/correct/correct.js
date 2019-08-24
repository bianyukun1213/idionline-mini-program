const color = require('../../tools/color.js')
Page({
  data: {
    value: null,
    id: null,
    name: null,
    show: false,
    color: null
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option['str'])
    this.data['id'] = json['id']
    this.data['name'] = json['name']
    this.setData({
      color: color.chk()
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
  onContact() {
    wx.vibrateShort()
    var str = '成语名称：' + this.data['name'] + '\n成语Id：' + this.data['id'] + '\n纠错内容：' + this.data['value']
    console.log(str)
    wx.setClipboardData({
      data: str
    })
  }
})