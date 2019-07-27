App({
  globalData: {
    version: '1.0.32',
    platStr: 'WeChat',
    launchInf: null
  },
  onLaunch() {
    var info = wx.getSystemInfoSync()
    console.log('已启动', info)
    if (info['isQB']) {
      this.globalData['platStr'] = 'QB'
    } else if (info['AppPlatform'] == 'qq') {
      this.globalData['platStr'] = 'QQ'
    }
    console.log('平台：' + this.globalData['platStr'])
  }
})