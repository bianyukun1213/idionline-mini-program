var color = require("../../utils/color.js")
Page({
  data: {
    items: null,
    showText: null
  },
  onLoad() {
    color.applyMainColor()
  },
  onShow() {
    this.loadData()
  },
  //加载缓存数据
  loadData() {
    //获取所有key。
    var keys = wx.getStorageInfoSync()['keys']
    var index = keys.indexOf('logs')
    var tmp = []
    var x
    //这里通常会有一个logs，需要把它剔除。
    if (index != -1) {
      keys.splice(index, 1)
    }
    //构造列表渲染的数组。
    for (x in keys) {
      var item = new Object({
        id: keys[x],
        name: wx.getStorageSync(keys[x])
      })
      tmp = tmp.concat(item)
    }
    //更新页面。
    this.setData({
      items: tmp
    })
    if (Object.getOwnPropertyNames(tmp).length > 1) {
      this.setData({
        showText: false
      })
      console.log('已构造收藏数据的数组：', tmp)
    } else {
      this.setData({
        showText: true
      })
    }
  },
  //下拉刷新。
  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  },
  onDelete(e) {
    var that = this;
    //获取控件的id，也就是被移除成语的index。
    var index = e.currentTarget['id']
    // wx.vibrateShort()
    // wx.showModal({
    //   title: '移除',
    //   content: '您确定要移除这条成语？',
    //   confirmColor: '#FF0000',
    //   success: function(res) {
    //     //确认，移除成语，刷新页面。
    //     if (res.confirm) {
    //       console.log('已移除索引为' + index + '的成语')
    //       wx.removeStorageSync(that.data['items'][index]['id'])
    //       that.loadData()
    //     }
    //   }
    // })
    wx.removeStorageSync(that.data['items'][index]['id'])
    console.log('已移除索引为' + index + '的成语')
    wx.vibrateShort()
    that.loadData()
  }
})