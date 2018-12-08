const color = require("../../utils/color.js")
Page({
  data: {
    idioms: null
  },
  onLoad(option) {
    color.applyMainColor()
    var json = JSON.parse(option.str)
    //更新页面。
    this.setData({
      idioms: json
    })
  }
})