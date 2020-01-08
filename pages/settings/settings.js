const color = require('../../tools/color.js')
Page({
  data: {
    color: null,
    adsOn: null,
    overlayOn: null
  },
  onLoad() {
    color.apl()
    this.setData({
      color: color.chk()
    })
  },
  onShow() {
    this.refreshSettings()
  },
  refreshSettings() {
    var disableAds = wx.getStorageSync('settings')['disableAds']
    var overlayOn = wx.getStorageSync('settings')['enableOverlay']
    if (disableAds == undefined)
      disableAds = false
    if (overlayOn == undefined)
      overlayOn = false
    this.setData({
      adsOn: !disableAds,
      overlayOn: overlayOn
    })
  },
  onChangeAds() {
    if (this.data['adsOn'])
      wx.navigateTo({
        url: '/pages/disable_ads/disable_ads'
      })
    else {
      var settings = wx.getStorageSync('settings') || {}
      settings['disableAds'] = false
      wx.setStorageSync('settings', settings)
      this.refreshSettings()
    }
  },
  onChangeOverlay() {
    var settings = wx.getStorageSync('settings') || {}
    settings['enableOverlay'] = !this.data['overlayOn']
    wx.setStorageSync('settings', settings)
    this.refreshSettings()
  }
})