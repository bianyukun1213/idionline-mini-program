const color = require('../../tools/color.js');
Page({
  data: {
    color: '',
  },
  onLoad() {},
  onShow() {
    color.apl();
    this.refreshSettings();
  },
  refreshSettings() {
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
});
