const CALL = require('../../tools/request.js');
const COLOR = require('../../tools/color.js');
Page({
  data: {
    translations: {},
    id: '',
    sessionId: '',
    value: '',
    show: false,
    color: '',
  },
  onLoad(option) {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('bsonEditPageTitle');
    let json = JSON.parse(decodeURIComponent(option.str));
    this.data.id = json.id;
    this.data.sessionId = json.sessionId;
    CALL.get({
      url: 'idiom/' + this.data.id,
      data: {
        bson: 1,
        sessionId: this.data.sessionId,
      },
      doSuccess: this.callback,
      exHandler: this.exHandler,
      ignoreS2T:true,
    });
  },
  onShow() {
    COLOR.apl();
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
    this.data.value = event.detail;
  },
  callback(data) {
    this.setData({
      value: data,
      show: true,
    });
  },
  exHandler(code, codeFromIdionline, msg) {
    wx.vibrateLong();
    if (typeof codeFromIdionline !== 'undefined')
      wx.showToast({
        title: this.data.translations.bsonEditToastTitleError + msg,
        icon: 'none',
        mask: true,
      });
    else
      wx.showToast({
        title: this.data.translations.bsonEditToastTitleError + code,
        icon: 'none',
        mask: true,
      });
    let currentPage = getCurrentPages()[getCurrentPages().length - 1];
    let prevPage = getCurrentPages()[getCurrentPages().length - 2];
    setTimeout(function () {
      if (
        currentPage === getCurrentPages()[getCurrentPages().length - 1] ||
        prevPage === getCurrentPages()[getCurrentPages().length - 1]
      )
        wx.switchTab({
          url: '/pages/index/index',
        });
    }, 1500);
  },
  onSubmit() {
    wx.vibrateShort();
    let dt = {
      sessionId: this.data.sessionId,
      bsonStr: this.data.value,
      updates: [],
    };
    CALL.uniFunc('idiom/' + this.data.id, 'PUT', dt, this.done);
  },
  done(data) {
    wx.showToast({
      title: this.data.translations.bsonToastTitleUpdateSucceeded,
      icon: 'none',
      mask: true,
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.data.refresh = true;
    if (this.data.id === getApp().globalData.launchInfo.dailyIdiom.id)
      getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (getCurrentPages()[getCurrentPages().length - 2] === prevPage)
        wx.navigateBack();
    }, 1500);
  },
  onReachBottom() {
    wx.vibrateShort();
  },
  onClear() {
    wx.vibrateShort();
  },
});
