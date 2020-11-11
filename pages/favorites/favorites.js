const color = require('../../tools/color.js')
Page({
  data: {
    items: null,
    showText: true,
    overlayOn: false,
    tmp: [],
    page: 0,
    showPrev: false,
    showNext: false
  },
  onLoad() {
    color.apl(true)
    this.setData({
      color: color.chk()
    })
  },
  onShow() {
    var overlayOn = wx.getStorageSync('settings')['enableOverlay']
    if (overlayOn == undefined)
      overlayOn = false
    this.setData({
      overlayOn: overlayOn
    })
    this.loadData()
  },
  //加载缓存数据
  loadData() {
    var favorites = wx.getStorageSync('favorites') || {}
    var array = []
    this.data['tmp'] = []
    this.setData({
      items: null,
      showPrev: false,
      showNext: false
    })
    if (Object.getOwnPropertyNames(favorites).length > 0) {
      this.setData({
        showText: false
      })
    } else {
      this.setData({
        showText: true
      })
      return
    }
    for (var key in favorites) {
      var obj = {}
      obj[key] = favorites[key]
      array.push(obj)
    }
    var idx = 0
    for (var i = 0; i < array.length; i++) {
      if (i % 20 == 0 && i != 0) {
        this.data['tmp'].push(array.slice(idx, i))
        idx = i
      }
      if ((i + 1) == array.length)
        this.data['tmp'].push(array.slice(idx, (i + 1)))
    }
    //更新页面。
    if (this.data['tmp'][this.data['page']] == null && this.data['page'] != 0)
      this.setData({
        tmp: this.data['tmp'],
        items: this.data['tmp'][this.data['page'] - 1],
        page: this.data['page'] - 1
      })
    else
      this.setData({
        tmp: this.data['tmp'],
        items: this.data['tmp'][this.data['page']]
      })
    if (this.data['tmp'][this.data['page'] + 1] != null)
      this.setData({
        showNext: true
      })
    if (this.data['tmp'][this.data['page'] - 1] != null)
      this.setData({
        showPrev: true
      })
    console.log('渲染收藏数据：', this.data['items'])
  },
  onDelete(e) {
    //获取控件的id，也就是被移除成语的index。
    wx.vibrateShort()
    var index = e.currentTarget.id
    var favorites = wx.getStorageSync('favorites') || {}
    var name = favorites[index]
    delete favorites[index]
    wx.setStorageSync('favorites', favorites)
    wx.showToast({
      title: '【' + name + '】已移除！',
      icon: 'none',
      mask: true
    })
    console.log('已移除索引为 ' + index + ' 的成语')
    this.loadData()
  },
  onPrev() {
    wx.vibrateShort()
    this.setData({
      page: this.data['page'] - 1
    })
    this.loadData()
    console.log('翻到第 ' + (this.data['page'] + 1) + ' 页')
  },
  onNext() {
    wx.vibrateShort()
    this.setData({
      page: this.data['page'] + 1
    })
    this.loadData()
    console.log('翻到第 ' + (this.data['page'] + 1) + ' 页')
  },
  onClick() {
    wx.vibrateShort()
  },
  onTabItemTap() {
    wx.vibrateShort()
  }
})