const COLOR = require('../../tools/color.js');
const MD5 = require('../../tools/md5.js');
Page({
  data: {
    translations: {},
    color: '',
    showDebug: false,
    show: false,
    password: '',
    debugModeOn: false,
    pages: [
      {
        route: '/pages/registration/registration',
        isTabPage: false,
      },
      {
        route: '/pages/login/login',
        isTabPage: false,
      },
    ],
  },
  onLoad(options) {
    this.setData({
      translations: getApp().globalData.translations,
      debugModeOn: getApp().globalData.debugMode,
    });
    getApp().setPageTitleTranslation('debugPageTitle');
    if (this.data.debugModeOn || options.bypassVerification === 'true') {
      this.setData({
        showDebug: true,
      });
    }
    if (options.enableDebug === 'true') {
      this.onDebug();
      this.startCounting();
    }
  },
  onShow() {
    COLOR.apl();
  },
  startCounting() {
    setTimeout(this.redirect, 1000);
  },
  redirect() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  onClick(e) {
    wx.vibrateShort();
    if (this.data.pages[e.target.id].isTabPage === true)
      wx.switchTab({
        url: this.data.pages[e.target.id].route,
      });
    else
      wx.navigateTo({
        url: this.data.pages[e.target.id].route,
      });
  },
  onDebug() {
    wx.showToast({
      title: this.data.translations.debugToastTitleDebugOn,
      mask: true,
    });
    this.setData({ debugModeOn: true });
    getApp().setDebug(true);
    getApp().globalData.refreshOnIndex = true;
    console.log('调试模式已开启：' + getApp().globalData.debugMode);
  },
  onDebugTurnOff() {
    wx.vibrateShort();
    wx.showToast({
      title: this.data.translations.debugToastTitleDebugOff,
      mask: true,
    });
    this.setData({ debugModeOn: false });
    getApp().setDebug(false);
    getApp().globalData.refreshOnIndex = true;
    console.log('调试模式已关闭：' + getApp().globalData.debugMode);
  },
  onDebugClick() {
    let that = this;
    wx.vibrateShort();
    that.onDebug();
  },
  onChange(event) {
    if (event.detail === '') {
      this.setData({
        show: false,
      });
    } else {
      this.setData({
        show: true,
      });
    }
    this.data.password = event.detail;
  },
  onOK() {
    wx.vibrateShort();
    if (MD5(this.data.password) === '93d98c9fc6497ab576662a1c95a0b0d4') {
      this.setData({
        showDebug: true,
      });
    } else {
      wx.vibrateLong();
      wx.showToast({
        title: this.data.translations.debugToastTitleWrongPwd,
        icon: 'none',
        mask: true,
      });
    }
  },
});
