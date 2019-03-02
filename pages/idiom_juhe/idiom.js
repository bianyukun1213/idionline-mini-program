const call = require('../../tools/request.js')
Page({
  data: {
    name: '正在查询……',
    pinyin: '正在查询……',
    chengyujs: '正在查询……',
    from_: null,
    example: null,
    yufa: null,
    yinzhengjs: null,
    tongyi: null,
    fanyi: null,
    shareFlag: false
  },
  onLoad(option) {
    console.log('搜索成语：' + option.name)
    this.data['name'] = option.name
    call.get({
      url: 'word=' + option.name + '&key=59a83fe5879d3ca2ce0eef7183db90ad',
      doSuccess: this.fillData,
      type: 'Juhe'
    })
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
      this.data['shareFlag'] = true
      wx.setNavigationBarTitle({
        title: this.data['name']
      })
    }
  },
  onShareAppMessage() {
    console.log('尝试转发：' + this.data['name'])
    if (this.data['shareFlag']) {
      return {
        title: '点击查看“' + this.data['name'] + '”的释义，内容来自聚合数据',
        path: '/pages/idiom_juhe/idiom?name=' + this.data['name']
      }
    } else {
      wx.showModal({
        content: '这个页面是空白的，转发没有任何意义，希望您取消转发。',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.vibrateShort()
          }
        }
      })
      wx.vibrateShort()
    }
  },
})