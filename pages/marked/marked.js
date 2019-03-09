const color = require('../../tools/color.js')
Page({
  data: {
    items: null,
    showText: null
  },
  onLoad() {
    color.apl()
  },
  onShow() {
    this.loadData()
  },
  //加载缓存数据
  loadData() {
    var marked = wx.getStorageSync('markedIdioms') || {}
    //更新页面。
    this.setData({
      items: marked
    })
    console.log('渲染收藏数据：', this.data['items'])
    if (Object.getOwnPropertyNames(marked).length > 0) {
      this.setData({
        showText: false
      })
    } else {
      this.setData({
        showText: true
      })
    }
  },
  onDelete(e) {
    //获取控件的id，也就是被移除成语的index。
    wx.vibrateShort()
    var index = e.currentTarget.id
    var marked = wx.getStorageSync('markedIdioms') || {}
    delete marked[index]
    wx.setStorageSync('markedIdioms', marked)
    console.log('已移除索引为' + index + '的成语')
    //设置Timeout来部分解决动画问题（两个都展开后再移除一个，会出现错误，不过我感觉是vant的锅。）。
    setTimeout(() => {
      this.loadData()
    }, 500)
  }
})