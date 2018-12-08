const call = require("../../utils/request.js")
const format = require("../../utils/format.js")
const color = require("../../utils/color.js")
const inf = require("../../utils/inf.js")
Page({
  data: {
    id: null,
    name: null,
    defs: null,
    lastEditor: null,
    updateTime: null
  },
  onLoad(option) {
    call.get('idiom/' + option.id, this.fillData)
    inf.getLaunchInf(this.callback)
  },
  //获取启动信息的回调函数。
  callback() {
    var launchInf = getApp().globalData['launchInf']
    this.setData({
      text: launchInf['text'],
      //disableAds: launchInf['disableAds']
    })
    color.applyMainColor()
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
    var marked = wx.getStorageSync('markedIdioms') || {}
    marked[this.data['id']] = this.data['name']
    wx.setStorageSync('markedIdioms', marked)
    wx.vibrateShort()
    wx.showToast({
      title: '完成！'
    })
    console.log('已添加成语至收藏：' + this.data['name'])
  },
  onShareAppMessage() {
    console.log('尝试转发：' + this.data['name'])
    return {
      title: '点击查看“' + this.data['name'] + '”的释义',
      path: '/pages/idiom/idiom?id=' + this.data['id']
    }
  }
})