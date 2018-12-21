App({
  globalData: {
    launchInf: null,
    platform: '微信'
  },
  onLaunch() {
    var info = wx.getSystemInfoSync()
    console.log('已启动', info)
    if (info['isQB']) {
      this.globalData['platform'] = 'QQ浏览器'
    }
    console.log('平台：' + this.globalData['platform'])
  }
})