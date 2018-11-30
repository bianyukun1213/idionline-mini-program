var call = require("../../utils/request.js")
var format = require("../../utils/format.js")
var color = require("../../utils/color.js")
Page({
  data: {
    id: null,
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
      id: data['id'],
      name: data['name'],
      defs: data['definitions'],
      lastEditor: data['lastEditor'],
      updateTime: format.formatDate(data['updateTimeUT'])
    })
    console.log('获取到成语释义：', this.data['defs'])
  },
  //跳转按钮点击事件。
  onClick(e) {
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id
    })
  },
  onMarkClick() {
    wx.setStorageSync(this.data['id'], this.data['name'])
    console.log('已添加成语至收藏：' + this.data['name'])
    wx.showToast({
      title: '完成！',
      icon: 'success'
    })
  },
  onShareAppMessage() {
    console.log('尝试转发：' + this.data['name'])
    return {
      title: '点击查看“' + this.data['name'] + '”的释义',
      path: '/pages/idiom/idiom?id=' + this.data['id']
    }
  }
})