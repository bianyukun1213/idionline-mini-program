const CALL = require('../../tools/request.js');
const COLOR = require('../../tools/color.js');
const MD5 = require('../../tools/md5.js');
Page({
  data: {
    translations: {},
    username: '',
    password: '',
    show: false,
    color: '',
    focus: {
      password: false,
    },
  },
  onLoad() {
    this.setData({
      translations: getApp().globalData.translations,
    });
    getApp().setPageTitleTranslation('loginPageTitle');
  },
  onShow() {
    COLOR.apl();
  },
  onLogin() {
    wx.vibrateShort();
    let that = this;
    CALL.uniFunc(
      'editor/login',
      'POST',
      {
        username: that.data.username,
        password: MD5(that.data.password),
      },
      that.callback
    );
  },
  onChange(event) {
    if (event.target.id === 'field-username') this.data.username = event.detail;
    else this.data.password = event.detail;
    if (this.data.username === '' || this.data.password === '') {
      this.setData({
        show: false,
      });
    } else {
      this.setData({
        show: true,
      });
    }
  },
  callback(data) {
    wx.setStorageSync('user', {
      id: data.id,
      username: data.username,
      sessionId: data.sessionId,
    });
    getApp().globalData.user = {
      id: data.id,
      username: data.username,
      sessionId: data.sessionId,
    };
    wx.showToast({
      title: this.data.translations.loginToastTitleLoginSucceeded,
      mask: true,
    });
    console.log('登录成功：', data);
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    if (prevPage.route.split('/')[2] === 'idiom') {
      prevPage.data.loginSucceeded = true;
      prevPage.data.refresh = true;
    }
    getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (currentPage === getCurrentPages()[getCurrentPages().length - 1])
        wx.navigateBack();
    }, 1500);
  },
  onClear() {
    wx.vibrateShort();
  },
  onConfirm(e) {
    wx.vibrateShort();
    if (e.target.id === 'field-username')
      this.setData({
        focus: {
          password: true,
        },
      });
    else
      this.setData({
        focus: {
          password: false,
        },
      });
  },
});
