const call = require('../../tools/request.js')
Page({
  data: {
    name: '正在请求数据，请稍候……',
    pinyin: '正在请求数据，请稍候……',
    chengyujs: '正在请求数据，请稍候……',
    from_: null,
    example: null,
    yufa: null,
    yinzhengjs: null,
    tongyi: null,
    fanyi: null
  },
  onLoad(option) {
    console.log('搜索成语：' + option.name)
    this.data['name'] = option.name
    call.get_juhe('word=' + option.name + '&key=59a83fe5879d3ca2ce0eef7183db90ad', this.fillData)
  },
  fillData(data) {
    if (data['reason'] != 'success') {
      this.setData({
        name: data['reason'],
        pinyin: data['reason'],
        chengyujs: data['reason']
      })
    } else {
      this.setData({
        name: this.data['name'],
        pinyin: data['result']['pinyin'],
        chengyujs: data['result']['chengyujs'],
        from_: data['result']['from_'],
        example: data['result']['example'],
        yufa: data['result']['yufa'],
        yinzhengjs: data['result']['yinzhengjs'],
        tongyi: data['result']['tongyi'],
        fanyi: data['result']['fanyi']
      })
      wx.setNavigationBarTitle({
        title: this.data['name']
      })
    }
  }
})