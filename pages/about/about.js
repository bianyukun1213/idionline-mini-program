const color = require('../../tools/color.js')
const call = require('../../tools/request.js')
Page({
  data: {
    version: '-',
    apiVer: '-',
    platTag: '-',
    platStr: '-',
    sysInfo: null,
    activeName: ['1', '2'],
    color: null,
    overlayOn: false
  },
  onLoad() {
    color.apl(true)
    this.setData({
      color: color.chk()
    })
  },
  onShow() {
    this.refresh()
  },
  refresh() {
    var overlayOn = wx.getStorageSync('settings')['enableOverlay']
    if (overlayOn == undefined)
      overlayOn = false
    this.setData({
      overlayOn: overlayOn,
      version: getApp().globalData['version'],
      platTag: getApp().globalData['platform']['tag'],
      platStr: getApp().globalData['platform']['str'],
      sysInfo: JSON.stringify(getApp().globalData['sysInfo'], null, '\t')
    })
    if (getApp().globalData['launchInfo'] != null)
      this.setData({
        apiVer: getApp().globalData['launchInfo']['version']
      })
  },
  onChange(e) {
    this.setData({
      activeName: e.detail
    })
    if (e.detail == '') {
      console.log('已关闭折叠面板')
    } else {
      console.log('已切换折叠面板到：' + e.detail)
    }
    wx.vibrateShort()
  },
  onClean() {
    var that = this
    wx.showModal({
      title: '警告',
      content: '您的设置、收藏数据等都保存在设备储存中，清空储存将导致这些数据丢失。您确定要继续吗？',
      confirmText: '继续',
      confirmColor: '#FF0000',
      success(res) {
        wx.vibrateShort()
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({
            title: '完成！',
            mask: true
          })
          that.refresh()
          console.log('设备储存已清理')
        }
      }
    })
    wx.vibrateLong()
  },
  onCopy() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: 'https://github.com/bianyukun1213/idionline',
      success() {
        console.log('已复制 GitHub 链接到剪贴板')
      }
    })
  },
  viewDocument() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '/pages/document/document'
    })
  },
  navi2Settings() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },
  onCopyBlog() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: 'https://his2nd.life',
      success() {
        console.log('已复制博客链接到剪贴板')
      }
    })
  },
  onCopyInfo() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: '小程序平台：' + this.data['platStr'] + '\n小程序版本：' + this.data['version'] + '\nWeb API版本：' + this.data['apiVer'] + '\n设备参数：\n' + this.data['sysInfo'],
      success() {
        console.log('已复制设备参数到剪贴板')
      }
    })
  },
  onTabItemTap() {
    wx.vibrateShort()
  }
})