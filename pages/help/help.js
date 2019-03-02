const color = require('../../tools/color.js')
Page({
  data: {
    version: null,
    platform: null,
    systemInfo: null,
    activeName: '1'
  },
  onLoad() {
    color.apl()
    this.setData({
      version: getApp().globalData['version'],
      platform: getApp().globalData['platform'],
      systemInfo: wx.getSystemInfoSync()
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
  },
  onClean() {
    wx.showModal({
      title: '警告',
      content: '您的一些设置与收藏数据也保存在缓存中，清除缓存将导致这些信息丢失，您确定要清除缓存吗？',
      confirmText: '清除',
      confirmColor: '#FF0000',
      success(res) {
        if (res.confirm) {
          wx.vibrateShort()
          wx.clearStorageSync()
          wx.showToast({
            title: '缓存已清除'
          })
          console.log('已清除缓存')
        }
      }
    })
    wx.vibrateLong()
  },
  onCopy() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: 'https://github.com/bianyukun1213/idionline',
      success(res) {
        console.log('已复制GitHub链接到剪贴板')
      }
    })
  },
  onCopy_blog() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: 'https://bianyukun1213.github.io',
      success(res) {
        console.log('已复制博客链接到剪贴板')
      }
    })
  }
})