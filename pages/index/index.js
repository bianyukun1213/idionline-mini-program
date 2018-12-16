const call = require("../../utils/request.js")
const color = require("../../utils/color.js")
const inf = require("../../utils/inf.js")
Page({
  data: {
    text: null,
    idiName: null,
    defs: null,
    launchInf: null,
    placeHolder: '请输入您要搜索的成语',
    logoUrl: '../../icons/idionline.svg',
    disableAds: false,
    searchBarValue: null,
    showPopup: false,
    startY: null,
    currentY: null,
    onTouch: false
  },
  //启动
  onLoad() {
    inf.getLaunchInf(this.callback)
  },
  //获取启动信息的回调函数。
  callback() {
    var launchInf = getApp().globalData['launchInf']
    this.setData({
      text: launchInf['text'],
      placeHolder: '目前已收录' + launchInf['idiomsCount'] + '条成语'
      //disableAds: launchInf['disableAds']
    })
    if (launchInf['dailyIdiom'] != null) {
      this.setData({
        idiName: launchInf['dailyIdiom']['name'],
        defs: launchInf['dailyIdiom']['definitions']
      })
    }
    color.applyMainColor()
    var reg = new RegExp('https?://.+\.(jpg|gif|png)', 'g')
    //匹配Logo地址正则，设置Logo。
    if (reg.exec(launchInf['logoUrl'])) {
      this.setData({
        logoUrl: launchInf['logoUrl']
      })
    }
  },
  //搜索事件。
  onSearch(e) {
    //正则表达式匹配，判断是向index请求还是向search请求。
    var reg = new RegExp('^[\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?$', 'g') //汉字。
    var reg2 = new RegExp('^[A-Za-z]$', 'g')
    if (reg.exec(e.detail)) {
      this.data['searchBarValue'] = e.detail //这里由于不用在wxml中渲染，就不调用setdata了。
      call.get('idiom/search/' + e.detail, this.nav)
    } else if (reg2.exec(e.detail)) {
      this.data['searchBarValue'] = e.detail //同上。
      call.get('idiom/index/' + e.detail, this.nav)
    } else {
      wx.vibrateLong()
      wx.showToast({
        title: '请您输入汉字或单个英文字母！',
        icon: 'none'
      })
    }
  },
  nav(data) {
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
        wx.vibrateShort()
        console.log('上划操作，已启用弹出层')
      } else if (currentY - startY >= 50 && showPopup) {
        this.setData({
          showPopup: false
        })
        //wx.vibrateShort()
        console.log('下划操作，已关闭弹出层')
      }
    }
  },
  //感应区触摸取消事件，触摸被打断时重置变量。
  onTouchCancel(e) {
    this.data['onTouch'] = false
  },
})