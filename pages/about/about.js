const color = require('../../tools/color.js');
const call = require('../../tools/request.js');
Page({
  data: {
    version: '-',
    apiVer: '-',
    platTag: '-',
    platStr: '-',
    sysInfo: '-',
    activeName: ['1', '2'],
    color: '',
    dark: false,
    username: '-',
  },
  onLoad() {
    wx.onThemeChange((result) => {
      if (result.theme === 'dark')
        this.setData({
          dark: true,
        });
      else
        this.setData({
          dark: false,
        });
    });
    setInterval(this.refresh, 60000);
  },
  onShow() {
    color.apl();
    if (wx.getSystemInfoSync().theme === 'dark')
      this.setData({
        dark: true,
      });
    else
      this.setData({
        dark: false,
      });
    this.refresh();
  },
  refresh() {
    let tmp = wx.getStorageSync('user').username;
    tmp = typeof tmp === 'undefined' ? '-' : tmp;
    let version = getApp().globalData.debugMode
      ? getApp().globalData.version + ' [DEBUG]'
      : getApp().globalData.version;
    this.setData({
      version: version,
      platTag: getApp().globalData.platform.tag,
      platStr: getApp().globalData.platform.str,
      sysInfo: JSON.stringify(wx.getSystemInfoSync(), null, '\t'),
      username: tmp,
    });
    if (Object.keys(getApp().globalData.launchInfo).length !== 0)
      this.setData({
        apiVer: getApp().globalData.launchInfo.version,
      });
  },
  onChange(e) {
    this.setData({
      activeName: e.detail,
    });
    if (e.detail === '') {
      console.log('已关闭折叠面板');
    } else {
      console.log('已切换折叠面板到：' + e.detail);
    }
    wx.vibrateShort();
  },
  onClean() {
    let that = this;
    wx.showModal({
      title: '警告',
      content:
        '您的登录信息、收藏数据等都保存在设备储存中，清空储存将导致这些数据丢失。您确定要继续吗？',
      confirmText: '继续',
      confirmColor: '#FF0000',
      success(res) {
        wx.vibrateShort();
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '完成！',
            mask: true,
          });
          that.refresh();
          getApp().globalData.refreshOnIndex = true;
          console.log('设备储存已清理');
        }
      },
    });
    wx.vibrateLong();
  },
  viewDocument() {
    wx.vibrateShort();
    wx.navigateTo({
      url: '/pages/document/document',
    });
  },
  // navi2Settings() {
  //   wx.vibrateShort()
  //   wx.navigateTo({
  //     url: '/pages/settings/settings'
  //   })
  // },
  onCopyInfo() {
    wx.vibrateShort();
    wx.setClipboardData({
      data:
        '用户名：' +
        this.data.username +
        '\n小程序平台：' +
        this.data.platStr +
        '\n小程序版本：' +
        this.data.version +
        '\n后端服务版本：' +
        this.data.apiVer +
        '\n设备参数：\n' +
        this.data.sysInfo,
    });
  },
  onTabItemTap() {
    wx.vibrateShort();
  },
});
