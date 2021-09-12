const color = require('../../tools/color.js');
const call = require('../../tools/request.js');
const info = require('../../tools/info.js');
Page({
  data: {
    overlayOn: false,
    shareFlag: false,
    color: '',
    singlePage: false,
    article: {},
  },
  onLoad() {
    wx.onThemeChange((result) => {
      if (result.theme === 'dark')
        this.setData({
          overlayOn: true,
        });
      else
        this.setData({
          overlayOn: false,
        });
    });
    if (wx.getLaunchOptionsSync().scene === 1154)
      this.setData({
        singlePage: true,
      });
    info.getLaunchInfo(this.infoCallback);
    call.get({
      url: 'document',
      doSuccess: this.callback,
      exHandler: this.exHandler,
    });
  },
  infoCallback() {
    color.apl();
  },
  callback(data) {
    let result = getApp().towxml(data, 'markdown');
    this.setData({
      article: result,
    });
    this.data.shareFlag = true;
  },
  exHandler(code, codeFromIdionline, msg) {
    wx.vibrateLong();
    if (typeof codeFromIdionline !== 'undefined')
      wx.showToast({
        title: '错误：' + msg,
        icon: 'none',
        mask: true,
      });
    else
      wx.showToast({
        title: '错误：' + code,
        icon: 'none',
        mask: true,
      });
    let currentPage = getCurrentPages()[getCurrentPages().length - 1];
    setTimeout(function () {
      if (currentPage === getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/about/about',
        });
    }, 1500);
  },
  onShow() {
    color.apl();
    if (wx.getSystemInfoSync().theme === 'dark')
      this.setData({
        overlayOn: true,
      });
    else
      this.setData({
        overlayOn: false,
      });
  },
  onShareAppMessage() {
    console.log('尝试转发帮助文档页面');
    if (this.data.shareFlag) {
      return {
        title: '点击查看帮助文档',
        imageUrl: '/icons/share.png',
      };
    }
    return {
      imageUrl: '/icons/share.png',
      path: '/pages/index/index',
    };
  },
  onShareTimeline() {
    return {
      title: '帮助文档',
      imageUrl: '/icons/share.png',
    };
  },
});
