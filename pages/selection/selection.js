const COLOR = require('../../tools/color.js');
Page({
  data: {
    translations: {},
    linkType: '',
    idioms2Disp: [],
    tmp: [],
    page: 0,
    showPrev: false,
    showNext: false,
    color: '',
  },
  onLoad(option) {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('selectionPageTitle');
    let idioms = JSON.parse(decodeURIComponent(option.str));
    let array = [];
    for (let key in idioms) {
      if (idioms.hasOwnProperty(key)) {
        let obj = {};
        obj[key] = idioms[key];
        array.push(obj);
      }
    }
    let idx = 0;
    for (let i = 0; i < array.length; i++) {
      if (i % 20 === 0 && i !== 0) {
        this.data.tmp.push(array.slice(idx, i));
        idx = i;
      }
      if (i + 1 === array.length) this.data.tmp.push(array.slice(idx, i + 1));
    }
    //更新页面。
    this.setData({
      tmp: this.data.tmp,
      idioms2Disp: this.data.tmp[0],
      linkType: JSON.parse(option.linkType),
    });
    if (this.data.tmp.length > 1)
      this.setData({
        showNext: true,
      });
  },
  onShow() {
    COLOR.apl();
  },
  onPrev() {
    wx.vibrateShort();
    this.setData({
      page: this.data.page - 1,
      idioms2Disp: this.data.tmp[this.data.page - 1],
    });
    console.log('翻到第 ' + (this.data.page + 1) + ' 页');
    if (this.data.page < this.data.tmp.length - 1)
      this.setData({
        showNext: true,
      });
    if (this.data.page === 0)
      this.setData({
        showPrev: false,
      });
  },
  onNext() {
    wx.vibrateShort();
    this.setData({
      page: this.data.page + 1,
      idioms2Disp: this.data.tmp[this.data.page + 1],
    });
    console.log('翻到第 ' + (this.data.page + 1) + ' 页');
    if (this.data.page > 0)
      this.setData({
        showPrev: true,
      });
    if (this.data.page === this.data.tmp.length - 1)
      this.setData({
        showNext: false,
      });
  },
  onClick() {
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
