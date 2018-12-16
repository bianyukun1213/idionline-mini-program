const color = require("../../utils/color.js")
Page({
  data: {
    activeName: '1',
    systemInfo: null
  },
  onLoad() {
    color.apl()
    this.setData({
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
  onClick() {
    wx.vibrateShort()
    console.log('用户发起客服会话')
  },
  onClear() {
    wx.vibrateLong()
    wx.showModal({
      title: '警告',
      content: '您的一些设置与收藏数据也保存在缓存中，清除缓存将导致这些信息丢失！',
      confirmText: '确认清除',
      confirmColor: '#FF0000',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.vibrateShort()
          wx.showToast({
            title: '缓存已清除'
          })
          console.log('已清除缓存')
        }
      }
    })
  },
  onCopy() {
    wx.setClipboardData({
      data: 'https://github.com/bianyukun1213/idionline',
      success: function(res) {
        wx.vibrateShort()
        wx.showToast({
          title: '完成！'
        })
        console.log('已复制GitHub链接到剪贴板')
      }
    })
  }
})