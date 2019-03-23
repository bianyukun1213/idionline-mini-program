const call = require('../../tools/request.js')
const color = require('../../tools/color.js')
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
    fanyi: null
  },
  onLoad(option) {
    color.apl()
    console.log('搜索成语：' + option['name'])
    this.data['name'] = option['name']
    call.get({
      url: 'word=' + option['name'] + '&key=59a83fe5879d3ca2ce0eef7183db90ad',
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
      wx.setNavigationBarTitle({
        title: this.data['name']
      })
      var dt = {
        'openId': 'Idionline',
        'name': this.data['name'],
        'pinyin': this.data['pinyin'],
        'source': '聚合数据',
        'defText': this.data['chengyujs']
      }
      call.uniFunc('idiom/create/from_juhe', 'POST', dt, this.done)
    }
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none'
    })
  }
})