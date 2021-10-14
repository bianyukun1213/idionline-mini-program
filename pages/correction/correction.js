const COLOR = require('../../tools/color.js');
Page({
  data: {
    translations: {},
    value: '',
    id: '',
    name: '',
    show: false,
    color: '',
  },
  onLoad(option) {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('correctionPageTitle');
    let json = JSON.parse(decodeURIComponent(option.str));
    this.data.id = json.id;
    this.data.name = json.name;
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
  onContact() {
    wx.vibrateShort();
    let str =
      '成语名称：' +
      this.data.name +
      '\n成语 Id：' +
      this.data.id +
      '\n纠错内容：' +
      this.data.value;
    console.log(str);
    wx.setClipboardData({
      data: str,
    });
  },
  onReachBottom() {
    wx.vibrateShort();
  },
  onClear() {
    wx.vibrateShort();
  },
  onAddToFavorites() {
    return {
      imageUrl: '/images/favorites-timeline.png',
    };
  },
});
