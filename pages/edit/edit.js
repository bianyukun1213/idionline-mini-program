const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    id: null,
    openId: null,
    name: null,
    updates: null,
    canBeRemoved: [],
    color: null,
    overlayOn: false
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option['str'])
    //更新页面。
    this.data['id'] = json['id']
    this.data['openId'] = json['openId']
    this.setData({
      name: json['name'],
      updates: json['updates'],
      color: color.chk()
    })
    for (var k in json['updates']) {
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
    this.data['updates'][event.currentTarget.id]['source'] = event.detail
  },
  onChangeText(event) {
    this.data['updates'][event.currentTarget.id]['text'] = event.detail
  },
  onChangeAddition(event) {
    this.data['updates'][event.currentTarget.id]['addition'] = event.detail
  },
  check(event) {
    var tmp = this.data['updates']
    tmp[event.currentTarget.id]['isBold'] = !tmp[event.currentTarget.id]['isBold']
    this.setData({
      updates: tmp
    })
  },
  onAdd() {
    wx.vibrateShort()
    var tmp = this.data['updates']
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
      updates: tmp,
      canBeRemoved: tmpRm
    })
    console.log(this.data['updates'])
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
    var tmp = this.data['updates']
    var tmpRm = this.data['canBeRemoved']
    delete tmp[event.currentTarget.id]
    delete tmpRm[event.currentTarget.id]
    this.setData({
      updates: tmp,
      canBeRemoved: tmpRm
    })
    console.log(this.data['updates'])
  },
  onSubmit() {
    wx.vibrateShort()
    for (var k in this.data['updates']) {
      if (this.data['updates'][k]['addition'] == '')
        this.data['updates'][k]['addition'] = null
      if (this.data['updates'][k]['source'] == null || this.data['updates'][k]['text'] == null || this.data['updates'][k]['source'] == '' || this.data['updates'][k]['text'] == '') {
        wx.showToast({
          title: '存在空位！',
          icon: 'none'
        })
        wx.vibrateLong()
        return
      }
    }
    var tmp = []
    for (var k in this.data['updates']) {
      if (this.data['updates'][k] != undefined)
        tmp.push(this.data['updates'][k])
    }
    var dt = {
      'openId': this.data['openId'],
      'bsonMode': false,
      'bsonStr': null,
      'updates': tmp
    }
    call.uniFunc('idiom/' + this.data['id'], 'PUT', dt, this.done)
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      refresh: true
    })
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
        if (res.confirm) {
          wx.vibrateShort()
          call.uniFunc('idiom/' + that.data['id'], 'DELETE', '\"' + that.data['openId'] + '\"', that.deleteDone)
        }
      }
    })
    wx.vibrateLong()
  },
  deleteDone(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var currentPage = pages[pages.length - 1]
    prevPage.setData({
      deleted: true
    })
    setTimeout(function () {
      if (currentPage == getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/index/index'
        })
    }, 1500)
  }
})