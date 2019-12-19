const xhtApp = require('./utils/xhtad_sdk.min.js')
App({
  globalData: {
    dbgMode: false,
    version: '1.41.0',
    platform: {
      'tag': 'WeChat',
      'str': '微信'
    },
    launchInf: null
  },
  onLaunch() {
    var info = wx.getSystemInfoSync()
    console.log('已启动：', info)
    if (info['isQB']) {
      this.globalData['platform']['tag'] = 'QB'
      this.globalData['platform']['str'] = 'QQ浏览器'
    } else if (info['AppPlatform'] == 'qq') {
      this.globalData['platform']['tag'] = 'QQ'
      this.globalData['platform']['str'] = 'QQ'
    }
    console.log('平台：' + this.globalData['platform']['str'])
    console.log('版本：' + this.globalData['version'])
  }
})