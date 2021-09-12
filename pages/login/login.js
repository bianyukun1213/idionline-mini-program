const call = require('../../tools/request.js');
const color = require('../../tools/color.js');
const md5 = require('../../tools/md5.js');
Page({
  data: {
    username: '',
    password: '',
    show: false,
    color: '',
  },
  onLoad() {},
  onShow() {
    color.apl();
  },
  onLogin() {
    wx.vibrateShort();
    let that = this;
    call.uniFunc(
      'editor/login',
      'POST',
      {
        username: that.data.username,
        password: md5(that.data.password),
      },
      that.callback
    );
  },
  onChange(event) {
    if (event.target.id === 'field_username') this.data.username = event.detail;
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
    wx.showToast({
      title: '登录成功！',
      icon: 'none',
      mask: true,
    });
    console.log('登录成功：', data);
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    if (prevPage.route.split('/')[2] === 'idiom') prevPage.data.refresh = true;
    getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (currentPage === getCurrentPages()[getCurrentPages().length - 1])
        wx.navigateBack();
    }, 1500);
  },
});
