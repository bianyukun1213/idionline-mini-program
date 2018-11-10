Page({
  data: {
    idioms: null
  },
  onLoad: function(option) {
    var json = JSON.parse(option.str)
    this.setData({
      idioms: json
    })
  }
})