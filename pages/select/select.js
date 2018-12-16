const color = require("../../tools/color.js")
Page({
  data: {
    idioms: null
  },
  onLoad(option) {
    color.apl()
    var json = JSON.parse(option.str)
    //更新页面。
    this.setData({
      idioms: json
    })
  }
})