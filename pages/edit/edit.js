const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
Page({
  data: {
    id: null,
    openId: null,
    updates: null,
    canBeRemoved: []
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option['str'])
    //更新页面。
    this.data['id'] = json['id']
    this.data['openId'] = json['openId']
    this.setData({
      updates: json['updates']
    })
    for (var k in json['updates']) {
      this.data['canBeRemoved'][k] = false
    }
  },
  onChangeSource(event) {
    this.data['updates'][event.currentTarget.id]['source'] = event.detail
  },
  onChangeText(event) {
    this.data['updates'][event.currentTarget.id]['text'] = event.detail
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
      'text': null
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
      if (this.data['updates'][k] != undefined) {
        tmp.push(this.data['updates'][k])
      }
    }
    var dt = {
      'openId': getApp().globalData['platform']['tag'] + '_' + this.data['openId'],
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
          call.uniFunc('idiom/' + that.data['id'], 'DELETE', '\'' + getApp().globalData['platform']['tag'] + '_' + that.data['openId'] + '\'', that.deleteDone)
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
  },
})