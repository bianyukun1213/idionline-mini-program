const call = require('../../tools/request.js')
const format = require('../../tools/format.js')
const color = require('../../tools/color.js')
const inf = require('../../tools/inf.js')
Page({
  data: {
    color: null,
    text: null,
    scene: null,
    idiName: null,
    pinyin: '',
    defs: null,
    launchInf: null,
    placeHolder: '请输入您要查询的成语',
    value: null,
    historyValue: [],
    logoUrl: '../../icons/idionline.svg',
    disableAds: false,
    searchBarValue: null,
    showPopup: false,
    startY: null,
    currentY: null,
    onTouch: false,
    showDailyIdiom: false,
    idMode: false,
    show: false,
    actions: [{
        name: '转发',
        openType: 'share'
      },
      {
        name: '生成海报',
      }
    ],
    filePath: null
  },
  //启动
  onLoad(query) {
    this.data['scene'] = decodeURIComponent(query.scene)
    if (query['showDailyIdiom'])
      this.data['showDailyIdiom'] = true
    console.log('场景：' + this.data['scene'])
    inf.getLaunchInf(this.callback)
  },
  onShow() {
    var reg = new RegExp('^[\u4e00-\u9fa5]{4}$') //汉字。
    var regS = new RegExp('【[\u4e00-\u9fa5]{4}】') //小冰成语接龙。
    var that = this
    wx.getClipboardData({ //向搜索框自动填充剪贴板数据。
      success(res) {
        if (reg.test(res.data) && that.data['historyValue'].indexOf(res.data) == -1) {
          //填充历史里有的成语不再填充。
          that.setData({
            value: res.data
          })
          that.data['historyValue'].push(res.data)
          console.log('填充历史：', that.data['historyValue'])
          wx.showToast({
            title: '已自动填充！'
          })
        } else if (regS.test(res.data)) {
          wx.vibrateShort()
          call.get({
            url: 'idiom/solitaire/' + regS.exec(res.data)[0].replace('【', '').replace('】', ''),
            doSuccess: that.doneSolitaire,
            exHandler: that.exHandlerS
          })
        }
      }
    })
  },
  doneSolitaire(data) {
    wx.setClipboardData({
      data: data,
      success(res) {
        console.log('已复制成语接龙返回数据到剪贴板：' + data)
      }
    })
    wx.vibrateShort()
  },
  exHandlerS() {
    wx.showToast({
      title: '未找到可接龙成语！',
      icon: 'none'
    })
  },
  //获取启动信息的回调函数。
  callback() {
    var launchInf = getApp().globalData['launchInf']
    this.setData({
      color: color.chk(),
      text: launchInf['text'],
      placeHolder: '目前已收录' + launchInf['idiomsCount'] + '条成语'
      //disableAds: launchInf['disableAds']
    })
    if (launchInf['dailyIdiom'] != null) {
      this.setData({
        idiName: launchInf['dailyIdiom']['name'],
        defs: launchInf['dailyIdiom']['definitions']
      })
      if (launchInf['dailyIdiom']['pinyin'] != null)
        this.setData({
          pinyin: '[' + launchInf['dailyIdiom']['pinyin'] + ']'
        })
    }
    color.apl()
    var reg = new RegExp('https?://.+\.(jpg|gif|png)')
    //匹配Logo地址正则，设置Logo。
    if (reg.test(launchInf['logoUrl']))
      this.setData({
        logoUrl: launchInf['logoUrl']
      })
    //显示对应的场景内容。
    for (var key in launchInf['argsDic']) {
      if (key == this.data['scene']) {
        console.log('查找到对应的场景内容：' + launchInf['argsDic'][this.data['scene']])
        wx.showModal({
          content: launchInf['argsDic'][this.data['scene']],
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.vibrateShort()
            }
          }
        })
        wx.vibrateShort()
      }
    }
    if (this.data['show']) {
      this.setData({
        showPopup: true
      })
      wx.vibrateShort()
    }
  },
  //搜索事件。
  onSearch(e) {
    wx.vibrateShort()
    this.data['idMode'] = false
    //正则表达式匹配，判断是向index请求还是向search请求。
    var reg = new RegExp('^[\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?$') //汉字。
    var reg2 = new RegExp('^[0-9a-zA-Z]{24}')
    var reg3 = new RegExp('^[A-Za-z]$')
    if (reg.test(e.detail) && e.detail.length > 1 && e.detail.length <= 12) {
      this.data['searchBarValue'] = e.detail //这里由于不用在wxml中渲染，就不调用setdata了。
      call.get({
        url: 'idiom/search/' + e.detail,
        doSuccess: this.nav,
        exHandler: this.exHandler
      })
    } else if (reg2.exec(e.detail)) {
      this.data['idMode'] = true
      this.data['searchBarValue'] = e.detail //同上。
      call.get({
        url: 'idiom/search/id/' + e.detail,
        doSuccess: this.nav,
        exHandler: this.exHandler
      })
    } else if (reg3.exec(e.detail)) {
      this.data['searchBarValue'] = e.detail //同上。
      call.get({
        url: 'idiom/index/' + e.detail,
        doSuccess: this.nav
      })
    } else {
      wx.showToast({
        title: '格式错误！',
        icon: 'none'
      })
      wx.vibrateLong()
    }
  },
  //成语未收录时：
  exHandler() {
    var dt = this.data['searchBarValue']
    console.log('查询无结果：' + dt)
    if (this.data['idMode']) {
      wx.showToast({
        title: '查询无结果！',
        icon: 'none'
      })
      wx.vibrateLong()
    } else {
      wx.showModal({
        title: '查询无结果',
        content: '未找到您要查询的成语“' + dt + '”。您仍可使用“聚合数据”接口继续查询。但请注意，“聚合数据”接口每天只能调用100次，您应确保输入的成语名称完整无误，以免浪费调用次数。您要继续查询吗？',
        confirmText: '继续查询',
        success(res) {
          if (res.confirm) {
            wx.vibrateShort()
            wx.navigateTo({
              url: '/pages/idiom_juhe/idiom?name=' + dt
            })
          }
        }
      })
      wx.vibrateShort()
    }
  },
  nav(data) {
    //获取key，其实就是第一个的key。
    var k
    for (var key in data) {
      k = key
    }
    if (Object.getOwnPropertyNames(data).length == 1 /*这一句返回个数，我谷歌了挺久的……*/ && (data[k] == this.data['searchBarValue'] || this.data['searchBarValue'] == '试试手气' || this.data['idMode'])) {
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
  onPopupClose() {
    this.setData({
      show: false,
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
        wx.vibrateShort()
        this.setData({
          showPopup: true
        })
        console.log('上划操作，已启用弹出层')
      } else if (currentY - startY >= 50 && showPopup) {
        this.onPopupClose()
        console.log('下划操作，已关闭弹出层')
      }
    }
  },
  //感应区触摸取消事件，触摸被打断时重置变量。
  onTouchCancel(e) {
    this.data['onTouch'] = false
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  eventGetImage(e) {
    wx.hideLoading()
    this.data['filePath'] = e.detail['tempFilePath']
    this.save()
  },
  save() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data['filePath'],
      fail() {
        wx.showToast({
          title: '保存失败！',
          icon: 'none'
        })
        wx.vibrateLong()
      }
    })
  },
  onSelect(event) {
    wx.vibrateShort()
    if (event.detail['name'] == '转发') {
      this.onShareAppMessage()
    } else if (event.detail['name'] == '生成海报') {
      if (this.data['filePath'] == null) {
        wx.showLoading({
          title: '正在生成~',
          mask: true
        })
        var name = format.formatDate(getApp().globalData['launchInf']['dateUT'], true) + '：' + this.data['idiName']
        if (this.data['defs'].length > 1)
          name = name + '（部分）'
        this.setData({
          painting: {
            width: 1080,
            height: 1440,
            views: [{
                type: 'image',
                url: '/icons/share_pic.png',
                width: 1080,
                height: 1440
              },
              {
                type: 'text',
                top: 100,
                left: 100,
                content: name,
                fontSize: 48,
                color: '#008080',
                textAlign: 'left',
                bolder: true
              },
              {
                type: 'rect',
                top: 160,
                left: 100,
                width: 880,
                height: 5,
                background: '#008080'
              },
              {
                type: 'text',
                top: 220,
                left: 100,
                width: 860,
                lineHeight: 50,
                MaxLineNumber: 15,
                content: this.data['defs'][0]['text'],
                fontSize: 36,
                color: '#008080',
                textAlign: 'left',
                breakWord: true
              }
            ]
          }
        })
      } else {
        this.save()
      }
    }
    this.onClose()
  },
  onShare() {
    wx.vibrateShort()
    this.setData({
      show: true
    })
  },
  onShareAppMessage() {
    if (this.data['idiName'] != null) {
      var date = format.formatDate(getApp().globalData['launchInf']['dateUT'], true)
      return {
        title: date + '：' + this.data['idiName'],
        imageUrl: '/icons/share.png',
        path: '/pages/index/index?showDailyIdiom=true'
      }
    }
    return {
      imageUrl: '/icons/share.png'
    }
  }
})