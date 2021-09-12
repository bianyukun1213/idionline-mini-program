const color = require('tools/color.js');
App({
  towxml: require('/towxml/index'),
  globalData: {
    dbgMode: false,
    version: '1.52.0',
    platform: {
      tag: 'WeChat',
      str: '微信（WeChat）',
    },
    launchInfo:{},
    refreshOnIndex: false,
  },
  onLaunch() {
    let info = wx.getSystemInfoSync();
    console.log('已启动：', info);
    if (info.isQB) {
      this.globalData.platform.tag = 'QB';
      this.globalData.platform.str = 'QQ浏览器';
    } else if (info.AppPlatform === 'qq') {
      this.globalData.platform.tag = 'QQ';
      this.globalData.platform.str = 'QQ';
    }
    console.log('平台：' + this.globalData.platform.str);
    console.log('版本：' + this.globalData.version);
  },
  onThemeChange() {
    color.apl();
  },
});
