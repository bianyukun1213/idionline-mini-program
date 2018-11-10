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
    updateTime: null,
    showBtn: null
  },
  onLoad: function(option) {
    call.get('idiom/'+option.id, this.fillData)
  },
  fillData: function(data) {
    wx.setNavigationBarTitle({
      title: data['idiomName']
    })
    //解析释义JSON，赋一堆值。
    var defsJSON = JSON.parse(data['definitions'])
    this.setData({
      id: data['id'],
      name: data['idiomName'],
      idx: data['index'],
      defs: defsJSON,
      source: data['source'],
      lastEditor: data['lastEditor'],
      updateTime: format.formatDate(data['updateTimeUT'])
    })
    console.log(this.data['defs'])
    //控制跳转按钮是否显示。
    if (defsJSON['subid'].length == defsJSON['subtext'].length && defsJSON['subid'].length > 0) {
      this.setData({
        showBtn: true
      })
    }
  },
  //跳转按钮点击事件。
  onClick(event) {
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + event.currentTarget.id
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data['name'] + '：' + this.data['defs']['defs'][0]['text'],
      path: '/pages/idiom/idiom?id='+this.data['id']
    }
  }
})