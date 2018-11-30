var color = require("../../utils/color.js")
Page({
  data: {
    activeName: '1'
  },
  onLoad() {
    color.applyMainColor()
  },
  onChange(e) {
    this.setData({
      activeName: e.detail
    })
    if (e.detail == '') {
      console.log('已关闭折叠面板')
    } else {
      console.log('已切换折叠面板到：' + e.detail)
    }
  }
})