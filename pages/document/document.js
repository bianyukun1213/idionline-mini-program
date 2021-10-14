const COLOR = require('../../tools/color.js');
const CALL = require('../../tools/request.js');
const INFO = require('../../tools/info.js');
Page({
  data: {
    translations: {},
    overlayOn: false,
    shareFlag: false,
    color: '',
    singlePage: false,
    article: {},
  },
  onLoad() {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('documentPageTitle');
    if (getApp().globalData.platform.tag === 'WeChat') {
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
    }
    if (wx.getLaunchOptionsSync().scene === 1154) {
      let that = this;
      wx.showNavigationBarLoading({
        success: function () {
          wx.hideNavigationBarLoading();
        },
        fail: function () {
          that.setData({
            singlePage: true,
          });
        },
      });
    }
    INFO.getLaunchInfo(this.infoCallback);
    CALL.get({
      url: 'document',
      doSuccess: this.callback,
      exHandler: this.exHandler,
    });
  },
  infoCallback() {
    COLOR.apl();
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
        title: this.data.translations.documentToastTitleError + msg,
        icon: 'none',
        mask: true,
      });
    else
      wx.showToast({
        title: this.data.translations.documentToastTitleError + code,
        icon: 'none',
        mask: true,
      });
    setTimeout(function () {
      if (
        getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
        'document'
      )
        wx.switchTab({
          url: '/pages/about/about',
        });
    }, 1500);
  },
  onShow() {
    COLOR.apl();
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
        title: this.data.translations.documentTextSharing,
        imageUrl: '/images/sharing.png',
      };
    }
    return {
      title: this.data.translations.documentTextInvalidSharing,
      imageUrl: '/images/sharing.png',
    };
  },
  onShareTimeline() {
    console.log('尝试转发帮助文档页面');
    if (this.data.shareFlag) {
      return {
        title: this.data.translations.documentTextSharing,
        imageUrl: '/images/favorites-timeline.png',
      };
    }
    return {
      title: this.data.translations.documentTextInvalidSharing,
      imageUrl: '/images/favorites-timeline.png',
    };
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
