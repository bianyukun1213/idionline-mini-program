const COLOR = require('../../tools/color.js');
Page({
  data: {
    translations: {},
    language: '-',
    version: '-',
    apiVer: '-',
    platTag: '-',
    platStr: '-',
    sysInfo: '-',
    color: '',
    dark: false,
    username: '-',
  },
  onLoad() {
    if (getApp().globalData.platform.tag === 'WeChat') {
      wx.onThemeChange((result) => {
        if (result.theme === 'dark')
          this.setData({
            dark: true,
          });
        else
          this.setData({
            dark: false,
          });
      });
    }
    setInterval(this.refresh, 60000);
  },
  onShow() {
    COLOR.apl();
    if (wx.getSystemInfoSync().theme === 'dark')
      this.setData({
        dark: true,
      });
    else
      this.setData({
        dark: false,
      });
    this.refresh();
  },
  refresh() {
    this.setData({
      translations: getApp().globalData.translations,
    });
    if (
      getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
      'about'
    ) {
      getApp().setPageTitleTranslation('aboutPageTitle');
      getApp().setTabBarTranslation();
    }
    let tmp = getApp().globalData.user.username;
    tmp = typeof tmp === 'undefined' ? '-' : (getApp().globalData.debugMode ? tmp + ' [DEBUG]' : tmp);
    let version = getApp().globalData.debugMode ?
      getApp().globalData.version + ' [DEBUG]' :
      getApp().globalData.version;
    let lang = getApp().getLocale();
    switch (lang) {
      case 'zh-CN':
        lang = '简体中文（zh-CN）';
        break;
      case 'zh-HK':
        lang = '香港繁體（zh-HK）';
        break;
      case 'zh-TW':
        lang = '臺灣正體（zh-TW）';
        break;
    }
    let str = '-';
    switch (getApp().globalData.platform.tag) {
      case 'QB':
        str = this.data.translations.aboutTextPlatformStringQB;
        break;
      case 'QQ':
        str = this.data.translations.aboutTextPlatformStringQQ;
        break;
      case 'WeChat':
        str = this.data.translations.aboutTextPlatformStringWeChat;
        break;
    }
    this.setData({
      language: lang,
      version: version,
      platTag: getApp().globalData.platform.tag,
      platStr: str,
      sysInfo: JSON.stringify(wx.getSystemInfoSync(), null, '\t'),
      username: tmp,
    });
    if (Object.keys(getApp().globalData.launchInfo).length !== 0)
      this.setData({
        apiVer: getApp().globalData.debugMode ? getApp().globalData.launchInfo.version + ' [DEBUG]' : getApp().globalData.launchInfo.version,
      });
    else
      this.setData({
        apiVer: '-',
      });
  },
  onClean() {
    let that = this;
    wx.showModal({
      title: that.data.translations.aboutModalTitleWarning,
      content: that.data.translations.aboutModalContentCleaning,
      confirmText: that.data.translations.aboutModalConfirmTextContinue,
      confirmColor: '#ff0000',
      cancelText: that.data.translations.aboutModalCancelTextCancel,
      success(res) {
        wx.vibrateShort();
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: that.data.translations.aboutToastTitleCompletion,
            mask: true,
          });
          that.refresh();
          getApp().globalData.user = {};
          getApp().globalData.settings = {};
          getApp().globalData.locale = '';
          getApp().setLocale();
          getApp().globalData.refreshOnIndex = true;
          that.refresh();
          console.log('设备储存已清理');
        }
      },
    });
    wx.vibrateLong();
  },
  viewDocument() {
    wx.vibrateShort();
    wx.navigateTo({
      url: '/pages/document/document',
    });
  },
  navi2Settings() {
    wx.vibrateShort();
    wx.navigateTo({
      url: '/pages/settings/settings',
    });
  },
  onCopyInfo() {
    wx.vibrateShort();
    wx.setClipboardData({
      data: '用户名：' +
        this.data.username +
        '\n当前语言：' +
        this.data.language +
        '\n小程序平台：' +
        this.data.platStr +
        '\n小程序版本：' +
        this.data.version +
        '\n后端服务版本：' +
        this.data.apiVer +
        '\n设备参数：\n' +
        this.data.sysInfo,
    });
  },
  onTabItemTap() {
    wx.vibrateShort();
  },
  onReachBottom() {
    wx.vibrateShort();
  },
  onAddToFavorites() {
    return {
      imageUrl: '/images/favorites-timeline.png',
    };
  },
});