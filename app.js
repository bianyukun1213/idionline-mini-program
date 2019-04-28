App({
  globalData: {
    version: '1.0.30',
    platform: '微信',
    launchInf: null
  },
  onLaunch() {
    var info = wx.getSystemInfoSync()
    console.log('已启动', info)
    if (info['isQB']) {
      this.globalData['platform'] = 'QQ浏览器'
    } else if (info['AppPlatform'] == 'qq') {
      this.globalData['platform'] = 'QQ'
    }
    console.log('平台：' + this.globalData['platform'])
  }
})