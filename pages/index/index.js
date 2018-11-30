var call = require("../../utils/request.js")
var color = require("../../utils/color.js")
Page({
  data: {
    text: null,
    idiName: null,
    defs: null,
    placeHolder: '请输入您要搜索的成语',
    logoUrl: '../../icons/idionline.png',
    disableAds: false,
    searchBarValue: null,
    showPopup: false,
    startY: null,
    currentY: null,
    onTouch: false
  },
  //启动
  onLoad() {
    var date = new Date()
    date.setMilliseconds(0)
    date.setSeconds(0)
    date.setMinutes(0)
    date.setHours(0)
    call.get('idiom/count/', this.fillDataF)
    call.get('launchinf/' + Date.parse(date) / 1000, this.fillDataS)
  },
  fillDataF(data) {
    this.setData({
      placeHolder: '目前已收录' + data + '个成语'
    })
  },
  fillDataS(data) {
    //如果启动信息数量大于1（即有当天数据）……
    //注意这里跟下面不一样，要用2，至于为什么我也不是很懂，反正在
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
    //这里，可以看出来[]这样的后面还有个length，{}这样的就没有……
    if (Object.getOwnPropertyNames(data).length > 2) {
      this.setText(data[1]['text'], data[0]['text'])
      this.setColor(data[1]['mainColor'], data[0]['mainColor'])
      this.setLogo(data[1]['logoUrl'], data[0]['logoUrl'])
      this.setAds(data[1]['disableAds'], data[0]['disableAds'])
      this.setDailyIdiom(data[1]['dailyIdiomId'], data[0]['dailyIdiomId'])
    } else {
      //没有当天数据的情况：
      //同样，依次为设置文本、主颜色、logo地址。
      this.setText(null, data[0]['text'])
      this.setColor(null, data[0]['mainColor'])
      this.setLogo(null, data[0]['logoUrl'])
      this.setAds(null, data[0]['disableAds'])
      this.setDailyIdiom(null, data[0]['dailyIdiomId'])
    }
  },
  setText(current, deft) {
    //判断当天信息中是否含有text，有则显示，没有则显示默认的。
    if (current != null) {
      this.setData({
        text: current //当天信息。
      })
    } else {
      this.setData({
        text: deft //默认信息。
      })
    }
  },
  setColor(current, deft) {
    var reg = new RegExp('^#[0-9a-fA-F]{6}$', 'g')
    if (reg.exec(current)) {
      getApp().globalData['mainColor'] = current //应用主题色到全局变量。
    } else if (reg.exec(deft)) {
      getApp().globalData['mainColor'] = deft //应用主题色到全局变量。
    }
    color.applyMainColor() //应用主题色，如果写在onLoad()里，虽然模拟器里会闪烁一次，但是安卓实机不会观察到绿色。
    //如果主颜色为空，就跳过tabbar设置。
    if (getApp().globalData['mainColor'] != null) {
      //应用tabbar颜色，只需这里调用一次。
      wx.setTabBarStyle({
        color: '#CCCCCC',
        selectedColor: '#FFFFFF',
        backgroundColor: getApp().globalData['mainColor']
      })
    }
  },
  setLogo(current, deft) {
    var reg = new RegExp('https?://.+\.(jpg|gif|png)', 'g')
    //匹配Logo地址正则，设置当天Logo。若当天logo无法解析，则尝试应用服务器默认logo。
    if (reg.exec(current)) {
      this.setData({
        logoUrl: current
      })
    } else if (reg.exec(deft)) {
      this.setData({
        logoUrl: deft
      })
    }
  },
  setAds(current, deft) {
    if (current == true) {
      this.setData({
        disableAds: current
      })
    } else {
      this.setData({
        disableAds: deft
      })
    }
    console.log('关闭广告：' + this.data['disableAds'])
  },
  setDailyIdiom(current, deft) {
    if (current != null) {
      call.get('idiom/' + current, this.fillDataT)
    } else if (deft != null) {
      call.get('idiom/' + deft, this.fillDataT)
    }
  },
  fillDataT(data) {
    this.setData({
      idiName: data['name'],
      defs: data['definitions']
    })
  },
  //搜索事件。
  onSearch(e) {
    //正则表达式匹配，判断是向index请求还是向search请求。
    var reg = new RegExp('^[\u4e00-\u9fa5]+$', 'g') //汉字。
    var reg2 = new RegExp('^[A-Za-z]$', 'g')
    if (reg.exec(e.detail)) {
      this.data['searchBarValue'] = e.detail //这里由于不用在wxml中渲染，就不调用setdata了。
      console.log('已更新搜索栏输入值：' + this.data['searchBarValue'])
      call.get('idiom/search/' + e.detail, this.nav)
    } else if (reg2.exec(e.detail)) {
      this.data['searchBarValue'] = e.detail //同上。
      console.log('已更新搜索栏输入值：' + this.data['searchBarValue'])
      call.get('idiom/index/' + e.detail, this.nav)
    } else {
      wx.showToast({
        title: '请您输入汉字或单个英文字母！',
        icon: 'none'
      })
    }
  },
  nav: function(data) {
    //获取key，其实就是第一个的key。
    var k
    for (var key in data) {
      k = key
    }
    if (Object.getOwnPropertyNames(data).length == 1 /*这一句返回个数，我谷歌了挺久的……*/ && data[k] == this.data['searchBarValue']) {
      wx.navigateTo({
        url: '/pages/idiom/idiom?id=' + k
      })
    } else {
      var str = JSON.stringify(data)
      wx.navigateTo({
        url: '/pages/select/select?str=' + str
      })
    }
  },
  //弹出层关闭
  onClose() {
    this.setData({
      showPopup: false
    })
    console.log('点击操作，已关闭弹出层')
  },
  //感应区触摸开始事件，记录开始时触摸点的纵坐标。
  onTouchStart(e) {
    this.data['startY'] = e.touches[0].pageY
    console.log('开始点击纵坐标：' + e.touches[0].pageY)
  },
  //感应区触摸移动事件，记录滑动中触摸点的纵坐标。
  onTouchMove(e) {
    this.data['onTouch'] = true
    this.data['currentY'] = e.touches[0].pageY
    console.log('滑动操作：' + this.data['onTouch'])
  },
  //感应区触摸结束事件，计算坐标差，判断是否启用弹出层。
  onTouchEnd(e) {
    if (this.data['onTouch']) {
      this.data['onTouch'] = false
      var showPopup = this.data['showPopup']
      var startY = this.data['startY']
      var currentY = this.data['currentY']
      console.log('结束点击纵坐标：' + currentY)
      console.log('坐标差：' + (currentY - startY))
      if (currentY - startY <= -50 && !showPopup) {
        this.setData({
          showPopup: true
        })
        console.log('上划操作，已启用弹出层')
      } else if (currentY - startY >= 50 && showPopup) {
        this.setData({
          showPopup: false
        })
        console.log('下划操作，已关闭弹出层')
      }
    }
  },
  //感应区触摸取消事件，触摸被打断时重置变量。
  onTouchCancel(e) {
    this.data['onTouch'] = false
  },
})