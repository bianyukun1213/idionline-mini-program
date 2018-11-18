var color = require("../../utils/color.js")
Page({
  data: {
    items: null,
    show: null
  },
  onLoad() {
    color.applyMainColor()
  },
  onShow() {
    this.loadData()
  },
  //加载缓存数据
  loadData() {
    //获取所有key。
    var keys = wx.getStorageInfoSync()['keys']
    var index = keys.indexOf('logs')
    var tmp = {}
    var x
    //这里通常会有一个logs，需要把它剔除。
    if (index != -1) {
      keys.splice(index, 1)
    }
    //构造一个obj，像是"索引":"名称"那样。
    for (x in keys) {
      tmp[keys[x]] = wx.getStorageSync(keys[x])
    }
    //更新页面。
    this.setData({
      items: tmp
    })
    if (Object.getOwnPropertyNames(tmp).length > 0) {
      this.setData({
        show: false
      })
      console.log(tmp)
    } else {
      this.setData({
        show: true
      })
    }
  },
  //下拉刷新。
  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  },
  longPress(e) {
    var that = this;
    //获取控件的id，也就是被移除成语的index。
    var index = e.currentTarget['id']
    wx.showModal({
      title: '移除',
      content: '您确定要移除这条成语？',
      confirmColor: '#FF0000',
      success: function(res) {
        //确认，移除成语，刷新页面。
        if (res.confirm) {
          console.log(index)
          wx.removeStorageSync(index)
          that.loadData()
        }
      }
    })
  }
})