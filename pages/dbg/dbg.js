Page({
  onLoad: function(options) {
    getApp().globalData['dbgMode'] = true
    console.log('调试模式已开启：' + getApp().globalData['dbgMode'])
    this.startCounting()
  },
  startCounting() {
    setTimeout(this.redirect, 3000)
  },
  redirect() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})