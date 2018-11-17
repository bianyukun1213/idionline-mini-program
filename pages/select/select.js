var color = require("../../utils/color.js")
Page({
  data: {
    idioms: null
  },
  onLoad(option) {
    color.applyMainColor()
    var json = JSON.parse(option.str)
    this.setData({
      idioms: json
    })
  }
})