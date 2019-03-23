const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    version: '-',
    version_api: '-',
    platform: '-',
    systemInfo: null,
    activeName: '1'
  },
  onLoad() {
    color.apl()
  },
  onShow() {
    this.setData({
      version: getApp().globalData['version'],
      platform: getApp().globalData['platform'],
      systemInfo: wx.getSystemInfoSync()
    })
    if (getApp().globalData['launchInf'] != null) {
      this.setData({
        version_api: getApp().globalData['launchInf']['version']
      })
    }
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
      content: '您的登录信息与收藏数据都保存在缓存中，清除缓存将导致这些数据丢失。您确定要清除缓存吗？',
      confirmText: '清除',
      confirmColor: '#FF0000',
      success(res) {
        if (res.confirm) {
          wx.vibrateShort()
          wx.clearStorageSync()
          wx.showToast({
            title: '完成！'
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
  },
  onLogin() {
    wx.vibrateShort()
    var that = this
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
          call.get({
            url: 'editor/login/' + res.code,
            doSuccess: that.callback
          })
        }
      }
    })
  },
  callback(data) {
    if (data['openid'] != null) {
      wx.showToast({
        title: '完成！'
      })
      console.log('已获取登录信息：' + data['openid'])
      wx.setStorageSync('openId', data['openid'])
    } else {
      wx.showToast({
        title: '获取失败！',
        icon: 'none'
      })
      console.log('登录信息获取失败')
    }
  }
})