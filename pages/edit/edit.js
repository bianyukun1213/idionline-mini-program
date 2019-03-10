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
    var json = JSON.parse(option.str)
    //更新页面。
    this.setData({
      id: json['id'],
      openId: json['openId'],
      updates: json['updates']
    })
    wx.setNavigationBarTitle({
      title: json['name']
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
      'openId': this.data['openId'],
      'updates': tmp
    }
    call.updateIdiom(this.data['id'], dt, this.done)
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
      content: '您确定要删除这条成语吗？',
      confirmText: '删除',
      confirmColor: '#FF0000',
      success(res) {
        if (res.confirm) {
          wx.vibrateShort()
          call.deleteIdiom(that.data['id'], that.data['openId'], that.deleteDone)
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