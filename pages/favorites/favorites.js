const COLOR = require('../../tools/color.js');
Page({
  data: {
    translations: {},
    items: [],
    showText: true,
    tmp: [],
    page: 0,
    showPrev: false,
    showNext: false,
  },
  onLoad() {},
  onShow() {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('favoritesPageTitle');
    getApp().setTabBarTranslation();
    COLOR.apl();
    this.loadData();
  },
  //加载缓存数据
  loadData() {
    let favorites = wx.getStorageSync('favorites') || {};
    let array = [];
    this.data.tmp = [];
    this.setData({
      items: {},
      showPrev: false,
      showNext: false,
    });
    if (Object.keys(favorites).length > 0) {
      this.setData({
        showText: false,
      });
    } else {
      this.setData({
        showText: true,
      });
      return;
    }
    for (let key in favorites) {
      if (favorites.hasOwnProperty(key)) {
        let obj = {};
        obj[key] = favorites[key];
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
    if (
      typeof this.data.tmp[this.data.page] === 'undefined' &&
      this.data.page !== 0
    )
      this.setData({
        tmp: this.data.tmp,
        items: this.data.tmp[this.data.page - 1],
        page: this.data.page - 1,
      });
    else
      this.setData({
        tmp: this.data.tmp,
        items: this.data.tmp[this.data.page],
      });
    if (typeof this.data.tmp[this.data.page + 1] !== 'undefined')
      this.setData({
        showNext: true,
      });
    if (typeof this.data.tmp[this.data.page - 1] !== 'undefined')
      this.setData({
        showPrev: true,
      });
    console.log('渲染收藏数据：', this.data.items);
  },
  onDelete(e) {
    //获取控件的id，也就是被移除成语的index。
    wx.vibrateShort();
    let index = e.currentTarget.id;
    let favorites = wx.getStorageSync('favorites') || {};
    delete favorites[index];
    wx.setStorageSync('favorites', favorites);
    wx.showToast({
      title: this.data.translations.favoritesToastTitleRemoved,
      mask: true,
    });
    console.log('已移除索引为 ' + index + ' 的成语');
    this.loadData();
  },
  onPrev() {
    wx.vibrateShort();
    this.setData({
      page: this.data.page - 1,
    });
    this.loadData();
    console.log('翻到第 ' + (this.data.page + 1) + ' 页');
  },
  onNext() {
    wx.vibrateShort();
    this.setData({
      page: this.data.page + 1,
    });
    this.loadData();
    console.log('翻到第 ' + (this.data.page + 1) + ' 页');
  },
  onClick() {
    wx.vibrateShort();
  },
  onTabItemTap() {
    wx.vibrateShort();
  },
  onReachBottom() {
    wx.vibrateShort();
  },
});
