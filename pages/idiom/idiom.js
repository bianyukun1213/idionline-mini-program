var call = require("../../utils/request.js")
var format = require("../../utils/format.js")
var color = require("../../utils/color.js")
Page({
  data: {
    id:null,
    name: null,
    defs: null,
    lastEditor: null,
    updateTime: null
  },
  onLoad(option) {
    color.applyMainColor()
    call.get('idiom/' + option.id, this.fillData)
  },
  fillData(data) {
    wx.setNavigationBarTitle({
      title: data['name']
    })
    //赋一堆值。
    this.setData({
      id:data['id'],
      name: data['name'],
      defs: data['definitions'],
      lastEditor: data['lastEditor'],
      updateTime: format.formatDate(data['updateTimeUT'])
    })
    console.log(this.data['defs'])
  },
  //跳转按钮点击事件。
  onClick(event) {
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + event.currentTarget.id
    })
  },
  onMarkClick() {
    wx.setStorageSync(this.data['id'],this.data['name'])
    wx.showToast({
      title: '完成！',
      icon: 'success'
    })
  },
  onShareAppMessage() {
    return {
      title: this.data['name'] + '：' + this.data['defs'][0]['text'],
      path: '/pages/idiom/idiom?id=' + this.data['id']
    }
  }
})