const COLOR = require('../../tools/color.js');
Page({
  data: {
    translations: {},
    color: '',
    showPopup: false,
    pickerValue: 0,
    languageOptions: [],
  },
  onLoad() {},
  onShow() {
    COLOR.apl();
    this.refreshSettings();
  },
  showPopup() {
    wx.vibrateShort();
    this.setData({ showPopup: true });
    let picker = this.selectComponent('#picker');
    picker.setColumnIndex(0, this.data.pickerValue);
  },
  onConfirm(e) {
    wx.vibrateShort();
    let value;
    let settings = wx.getStorageSync('settings') || {};
    switch (e.detail.index) {
      case 0:
        value = 0;
        settings.language = 'system';
        break;
      case 1:
        value = 1;
        settings.language = 'zh-CN';
        break;
      case 2:
        value = 2;
        settings.language = 'zh-HK';
        break;
      case 3:
        value = 3;
        settings.language = 'zh-TW';
        break;
    }
    wx.setStorageSync('settings', settings);
    getApp().setLocale();
    getApp().globalData.refreshOnIndex = true;
    this.setData({ pickerValue: value, showPopup: false });
    this.refreshSettings();
  },
  onCancel() {
    wx.vibrateShort();
    this.onClose();
  },
  onClose() {
    this.setData({
      showPopup: false,
    });
    wx.vibrateShort();
  },
  refreshSettings() {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('settingsPageTitle');
    let options = [
      getApp().globalData.translations.appTextLocaleNameSystem,
      '简体中文（zh-CN）',
      '香港繁體（zh-HK）',
      '臺灣正體（zh-TW）',
    ];
    let value;
    if (wx.getStorageSync('settings').language === 'system') value = 0;
    else {
      switch (getApp().getLocale()) {
        case 'zh-CN':
          value = 1;
          break;
        case 'zh-HK':
          value = 2;
          break;
        case 'zh-TW':
          value = 3;
          break;
        default:
          value = 0;
          break;
      }
    }
    this.setData({
      languageOptions: options,
      pickerValue: value,
    });
    // let disableAds = wx.getStorageSync('settings').disableAds
    // let overlayOn = wx.getStorageSync('settings').enableOverlay
    // if (disableAds === undefined)
    //   disableAds = false
    // if (overlayOn === undefined)
    //   overlayOn = false
    // this.setData({
    //   adsOn: !disableAds,
    //   overlayOn: overlayOn
    // })
  }, //,
  onChange() {
    wx.vibrateShort();
  },
  // onChangeAds() {
  //   if (this.data.adsOn) {
  //     wx.vibrateShort()
  //     wx.navigateTo({
  //       url: '/pages/disable_ads/disable_ads'
  //     })
  //   } else {
  //     let settings = wx.getStorageSync('settings') || {}
  //     settings.disableAds = false
  //     console.log('广告已开启')
  //     wx.setStorageSync('settings', settings)
  //     this.refreshSettings()
  //     wx.vibrateShort()
  //   }
  // },
  // onChangeOverlay() {
  //   let settings = wx.getStorageSync('settings') || {}
  //   settings.enableOverlay = !this.data.overlayOn
  //   wx.setStorageSync('settings', settings)
  //   console.log('启用暗色遮罩层：' + settings.enableOverlay)
  //   this.refreshSettings()
  //   wx.vibrateShort()
  // }
  onReachBottom() {
    wx.vibrateShort();
  },
  onAddToFavorites() {
    return {
      imageUrl: '/images/favorites-timeline.png',
    };
  },
});
