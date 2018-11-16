var call = require("../../utils/request.js")
var format = require("../../utils/format.js");
Page({
  data: {
    id: null,
    name: null,
    idx: null,
    defs: null,
    source: null,
    lastEditor: null,
    updateTime: null
  },
  onLoad: function(option) {
    call.get('idiom/'+option.id, this.fillData)
  },
  fillData: function(data) {
    wx.setNavigationBarTitle({
      title: data['name']
    })
    //赋一堆值。
    this.setData({
      id: data['id'],
      name: data['name'],
      idx: data['index'],
      defs: data['definitions'],
      source: data['source'],
      lastEditor: data['lastEditor'],
      updateTime: format.formatDate(data['updateTimeUT'])
    })
    console.log(this.data['defs'])
  },
  //跳转按钮点击事件。
  onClick(event) {
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + event.currentTarget.id
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data['name'] + '：' + this.data['defs'][0]['text'],
      path: '/pages/idiom/idiom?id='+this.data['id']
    }
  }
})