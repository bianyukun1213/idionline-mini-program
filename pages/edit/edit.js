const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    id: null,
    openId: null,
    name: null,
    indexOfIdiom: null,
    pinyin: null,
    origin: null,
    toBeCorrected: false,
    definitionUpdates: null,
    canBeRemoved: [],
    color: null,
    overlayOn: false
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option['str'])
    //更新页面。
    this.data['openId'] = json['openId']
    this.setData({
      id: json['id'],
      name: json['name'],
      indexOfIdiom: json['indexOfIdiom'],
      pinyin: json['pinyin'],
      origin: json['origin'],
      toBeCorrected: json['toBeCorrected'],
      definitionUpdates: json['definitionUpdates'],
      color: color.chk()
    })
    for (var k in json['definitionUpdates']) {
      this.data['canBeRemoved'][k] = false
    }
  },
  onShow() {
    var overlayOn = wx.getStorageSync('settings')['enableOverlay']
    if (overlayOn == undefined)
      overlayOn = false
    this.setData({
      overlayOn: overlayOn
    })
  },
  onChangeSource(event) {
    this.data['definitionUpdates'][event.currentTarget.id]['source'] = event.detail
  },
  onChangeText(event) {
    this.data['definitionUpdates'][event.currentTarget.id]['text'] = event.detail
  },
  onChangeAddition(event) {
    this.data['definitionUpdates'][event.currentTarget.id]['addition'] = event.detail
  },
  onChangeName(event) {
    this.data['name'] = event.detail
  },
  onChangeIndex(event) {
    this.data['indexOfIdiom'] = event.detail
  },
  onChangePinyin(event) {
    this.data['pinyin'] = event.detail
  },
  onChangeOrigin(event) {
    this.data['origin'] = event.detail
  },
  check(event) {
    var tmp = this.data['definitionUpdates']
    tmp[event.currentTarget.id]['isBold'] = !tmp[event.currentTarget.id]['isBold']
    this.setData({
      definitionUpdates: tmp
    })
    wx.vibrateShort()
  },
  correctionCheck() {
    this.setData({
      toBeCorrected: !this.data['toBeCorrected']
    })
    wx.vibrateShort()
  },
  onAdd() {
    wx.vibrateShort()
    var tmp = this.data['definitionUpdates']
    var tmpRm = this.data['canBeRemoved']
    var k
    for (k in tmp) {
      k++
    }
    tmp[k] = {
      'source': null,
      'text': null,
      'addition': null,
      'isBold': false
    }
    tmpRm[k] = true
    this.setData({
      definitionUpdates: tmp,
      canBeRemoved: tmpRm
    })
  },
  onBsonEdit() {
    wx.vibrateShort()
    console.log(this.data['id'])
    var json = {
      'id': this.data['id'],
      'openId': this.data['openId']
    }
    var str = JSON.stringify(json)
    wx.redirectTo({
      url: '/pages/edit_bson/edit_bson?str=' + str
    })
  },
  onDeleteItem(event) {
    wx.vibrateShort()
    console.log(event.currentTarget.id)
    var tmp = this.data['definitionUpdates']
    var tmpRm = this.data['canBeRemoved']
    delete tmp[event.currentTarget.id]
    delete tmpRm[event.currentTarget.id]
    this.setData({
      definitionUpdates: tmp,
      canBeRemoved: tmpRm
    })
    console.log(this.data['definitionUpdates'])
  },
  onSubmit() {
    wx.vibrateShort()
    var reg = new RegExp('^[A-Z]$')
    var reg2 = new RegExp('^[\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?$')
    if (this.data['pinyin'] == '')
      this.data['pinyin'] = null
    if (this.data['origin'] == '')
      this.data['origin'] = null
    for (var k in this.data['definitionUpdates']) {
      if (this.data['definitionUpdates'][k]['addition'] == '')
        this.data['definitionUpdates'][k]['addition'] = null
      if (this.data['definitionUpdates'][k]['source'] == null || this.data['definitionUpdates'][k]['text'] == null || this.data['definitionUpdates'][k]['source'] == '' || this.data['definitionUpdates'][k]['text'] == '' || !reg2.test(this.data['name']) || !reg.test(this.data['indexOfIdiom'])) {
        wx.showToast({
          title: '数据格式不正确！',
          icon: 'none',
          mask: true
        })
        wx.vibrateLong()
        return
      }
    }
    var tmp = []
    for (var k in this.data['definitionUpdates']) {
      if (this.data['definitionUpdates'][k] != undefined)
        tmp.push(this.data['definitionUpdates'][k])
    }
    var dt = {
      'openId': this.data['openId'],
      'bsonStr': null,
      'name': this.data['name'],
      'index': this.data['indexOfIdiom'],
      'pinyin': this.data['pinyin'],
      'origin': this.data['origin'],
      'toBeCorrected': this.data['toBeCorrected'],
      'definitionUpdates': tmp
    }
    call.uniFunc('idiom/' + this.data['id'], 'PUT', dt, this.done)
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none',
      mask: true
    })
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      refresh: true
    })
    if (this.data['id'] == getApp().globalData['launchInfo']['dailyIdiom']['id'])
      getApp().globalData['refreshOnIndex'] = true
    setTimeout(function () {
      if (getCurrentPages()[getCurrentPages().length - 2] == prevPage)
        wx.navigateBack()
    }, 1500)
  },
  onDelete() {
    var that = this
    wx.showModal({
      title: '警告',
      content: '您确定要删除这条成语吗？',
      confirmText: '删除',
      confirmColor: '#FF0000',
      success(res) {
        wx.vibrateShort()
        if (res.confirm) {
          call.uniFunc('idiom/' + that.data['id'], 'DELETE', '\"' + that.data['openId'] + '\"', that.doneDelete)
        }
      }
    })
    wx.vibrateLong()
  },
  doneDelete(data) {
    wx.showToast({
      title: data,
      icon: 'none',
      mask: true
    })
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var currentPage = pages[pages.length - 1]
    prevPage.setData({
      deleted: true
    })
    if (this.data['id'] == getApp().globalData['launchInfo']['dailyIdiom']['id'])
      getApp().globalData['refreshOnIndex'] = true
    setTimeout(function () {
      if (currentPage == getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/index/index'
        })
    }, 1500)
  }
})