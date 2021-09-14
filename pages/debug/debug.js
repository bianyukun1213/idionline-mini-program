const color = require('../../tools/color.js');
const md5 = require('../../tools/md5.js');
Page({
  data: {
    color: '',
    fromSearch: false,
    showDebug: false,
    show: false,
    password: '',
    pages: [
      {
        route: '/pages/registration/registration',
        isTabPage: false,
      },
      {
        route: '/pages/login/login',
        isTabPage: false,
      },
      {
        route: '/pages/settings/settings',
        isTabPage: false,
      },
    ],
  },
  onLoad(options) {
    if (options.fromSearch) {
      this.setData({
        fromSearch: true,
      });
      if (getApp().globalData.debugMode) {
        this.setData({
          showDebug: true,
        });
      }
      return;
    }
    this.onDebug();
    this.startCounting();
  },
  onShow() {
    color.apl();
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
    console.log(e.target.id);
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
      title: '调试模式已开启！',
      mask: true,
    });
    getApp().globalData.debugMode = true;
    console.log('调试模式已开启：' + getApp().globalData.debugMode);
  },
  onDebugClick() {
    wx.vibrateShort();
    this.onDebug();
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
    if (md5(this.data.password) === '93d98c9fc6497ab576662a1c95a0b0d4') {
      this.setData({
        showDebug: true,
      });
      // wx.setStorageSync('canDebug', true);
    } else {
      wx.vibrateLong();
      wx.showToast({
        title: '调试密码错误！',
        icon: 'none',
        mask: true,
      });
    }
  },
});
