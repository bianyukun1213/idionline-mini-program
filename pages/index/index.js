var call = require("../../utils/request.js")
Page({
  data: {
    text: null,
    idiName: null,
    defs: null,
    placeHolder: '请输入您要搜索的成语'
  },
  //启动
  onLoad: function() {
    var date = new Date()
    date.setMilliseconds(0)
    date.setSeconds(0)
    date.setMinutes(0)
    date.setHours(0)
    call.get('idiom/count/', this.fillDataF)
    call.get('launchinf/' + Date.parse(date) / 1000, this.fillDataS)
  },
  fillDataF: function(data) {
    this.setData({
      placeHolder: '目前已收录' + data + '个成语'
    })
  },
  fillDataS: function(data) {
    //如果启动信息数量大于1（即有当天数据）……
    //注意这里跟下面不一样，要用2，至于为什么我也不是很懂，反正在
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
    //这里，可以看出来[]这样的后面还有个length，{}这样的就没有……
    if (Object.getOwnPropertyNames(data).length > 2) {
      //判断当天信息中是否含有text，有则显示，没有则显示默认的。
      if (data[1]['text'] != null) {
        this.setData({
          text: data[1]['text']
        })
      } else {
        this.setData({
          text: data[0]['text']
        })
      }
    } else
      //没有当天数据的情况：
      this.setData({
        text: data[0]['text']
      })
    call.get('idiom/' + data[1]['dailyIdiomId'], this.fillDataT)
  },
  fillDataT: function(data) {
    this.setData({
      idiName: data['name'],
      defs: data['definitions']
    })
  },
  //搜索事件
  onSearch(event) {
    //正则表达式匹配，判断是向index请求还是向search请求。
    var reg = new RegExp('^[\u4e00-\u9fa5]+$', 'g')//汉字。
    var reg2 = new RegExp('^[A-Za-z]$', 'g')
    if (reg.exec(event.detail)) {
      call.get('idiom/search/' + event.detail, this.nav)
    } else if (reg2.exec(event.detail)) {
      call.get('idiom/index/' + event.detail, this.nav)
    } else {
      wx.showToast({
        title: '请您输入汉字或单个英文字母！',
        icon: 'none'
      })
    }
  },
  nav: function(data) {
    if (Object.getOwnPropertyNames(data).length == 1 /*这一句返回个数，我谷歌了挺久的……*/ ) {
      //获取key作为参数
      for (var key in data) {
        wx.navigateTo({
          url: '/pages/idiom/idiom?id=' + key
        })
      }
    } else {
      var str = JSON.stringify(data)
      wx.navigateTo({
        url: '/pages/select/select?str=' + str
      })
    }
  }
})