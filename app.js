const call = require('tools/request.js')
App({
  towxml: require('/towxml/index'),
  globalData: {
    dbgMode: false,
    version: '1.51.9',
    platform: {
      'tag': 'WeChat',
      'str': '微信'
    },
    sysInfo: null,
    launchInf: null,
    refreshOnIndex: false
  },
  onLaunch() {
    var info = wx.getSystemInfoSync()
    this.globalData['sysInfo'] = info
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
    this.getOpenId()
  },
  getOpenId(cb) {
    var openId = wx.getStorageSync('openId')
    if (openId == null || openId == '') {
      var that = this
      wx.login({
        success(res) {
          console.log(res)
          if (res.code)
            call.get({
              url: 'editor/login',
              data: {
                'platTag': getApp().globalData['platform']['tag'],
                'code': res.code
              },
              doSuccess: typeof cb == 'function' ? cb : that.callback
            })
        }
      })
    }
  },
  callback(data) {
    console.log('已获取 OpenID：' + getApp().globalData['platform']['tag'] + '_' + data)
    wx.setStorageSync('openId', getApp().globalData['platform']['tag'] + '_' + data)
  }
})