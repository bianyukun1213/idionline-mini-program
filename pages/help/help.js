const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    version: '-',
    apiVer: '-',
    platTag: '-',
    platStr: '-',
    systemInfo: null,
    activeName: '1',
    color: null
  },
  onLoad() {
    color.apl()
    this.setData({
      color: color.chk()
    })
  },
  onShow() {
    this.setData({
      version: getApp().globalData['version'],
      platTag: getApp().globalData['platform']['tag'],
      platStr: getApp().globalData['platform']['str'],
      systemInfo: JSON.stringify(wx.getSystemInfoSync(), null, '\t')
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
  },
  onClean() {
    wx.showModal({
      title: '警告',
      content: '您的收藏数据与OpenID等都保存在缓存中，清除缓存将导致这些数据丢失。您确定要清除缓存吗？',
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
  onCopyBlog() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: 'https://bianyukun1213.github.io',
      success(res) {
        console.log('已复制博客链接到剪贴板')
      }
    })
  },
  onCopyInfo() {
    wx.vibrateShort()
    wx.setClipboardData({
      data: '小程序平台：' + this.data['platStr'] + '\n小程序版本：' + this.data['version'] + '\nWeb API版本：' + this.data['apiVer'] + '\n设备参数：\n' + this.data['systemInfo'],
      success(res) {
        console.log('已复制设备参数到剪贴板')
      }
    })
  },
  onLogin() {
    wx.vibrateShort()
    var that = this
    wx.showModal({
      title: 'OpenID',
      content: 'OpenID由数字与英文字母组成，仅用来识别您的身份，不包含您的隐私信息，您可放心使用！',
      confirmText: '获取',
      success(res) {
        if (res.confirm) {
          wx.vibrateShort()
          wx.login({
            success(res) {
              console.log(res)
              if (res.code)
                call.get({
                  url: 'editor/login/' + getApp().globalData['platform']['tag'] + '/' + res.code,
                  doSuccess: that.callback
                })
            }
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
      console.log('已获取OpenID：' + getApp().globalData['platform']['tag'] + '_' + data['openid'])
      wx.setStorageSync('openId', getApp().globalData['platform']['tag'] + '_' + data['openid'])
    } else {
      wx.showToast({
        title: '获取失败！',
        icon: 'none'
      })
      console.log('OpenID获取失败')
    }
  },
  onDisableAds() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '/pages/disable_ads/disable_ads'
    })
  }
})