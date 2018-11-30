var color = require("../../utils/color.js")
Page({
  data: {
    idioms: null
  },
  onLoad(option) {
    color.applyMainColor()
    //这里为了使列表渲染的顺序与服务器返回数据的顺序相同，
    //使用了和收藏页一样的构造数组的方法。
    //好像直接用服务器返回的id当index渲染的话，微信会自己再拍一次序。
    var json = JSON.parse(option.str)
    var tmp = []
    var x
    for (x in json) {
      var item = new Object({
        id: x,
        name: json[x]
      })
      tmp = tmp.concat(item)
    }
    console.log('已构造返回结果的数组：', tmp)
    //更新页面。
    this.setData({
      idioms: tmp
    })
  }
})