const call = require("../../tools/request.js")
const format = require("../../tools/format.js")
const color = require("../../tools/color.js")
const inf = require("../../tools/inf.js")
const guid = require("../../tools/guid.js")
var innerAudioContext
Page({
  data: {
    dt: null,
    name: null,
    defs: null,
    lastEditor: null,
    updateTime: null,
    tTSSource: null, //对应释义的文本。
    audioAddress: null
  },
  onLoad(option) {
    call.get('idiom/' + option.id, this.fillData)
    inf.getLaunchInf(this.callback)
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.mixWithOther = false
    innerAudioContext.onError(function callback(errCode) {
      console.log('音频播放错误：' + errCode)
      wx.showToast({
        title: '音频播放出错！',
        icon: 'none'
      })
    })
  },
  onUnload(e) {
    console.log('成语页面卸载')
    innerAudioContext.destroy()
  },
  //获取启动信息的回调函数。
  callback() {
    var launchInf = getApp().globalData['launchInf']
    this.setData({
      text: launchInf['text'],
      //disableAds: launchInf['disableAds']
    })
    color.apl()
  },
  fillData(data) {
    wx.setNavigationBarTitle({
      title: data['name']
    })
    //赋一堆值。
    this.data['dt'] = data
    this.setData({
      name: data['name'],
      defs: data['definitions'],
      lastEditor: data['lastEditor'],
      updateTime: format.formatDate(data['updateTimeUT'])
    })
    console.log('获取到成语释义：', this.data['defs'])
  },
  //跳转按钮点击事件。
  onClick(e) {
    wx.vibrateShort()
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id
    })
  },
  onMarkClick() {
    wx.vibrateShort()
    var marked = wx.getStorageSync('markedIdioms') || {}
    marked[this.data['dt']['id']] = this.data['name']
    wx.setStorageSync('markedIdioms', marked)
    wx.showToast({
      title: '完成！'
    })
    console.log('已添加成语至收藏：' + this.data['name'])
  },
  onLongPress() {
    var that = this
    wx.setClipboardData({
      data: JSON.stringify(this.data['dt']),
      success: function(res) {
        wx.vibrateShort()
        wx.showToast({
          title: 'JSON已复制'
        })
        console.log('已复制成语JSON到剪贴板：' + JSON.stringify(that.data['dt']))
      }
    })
  },
  onShareAppMessage() {
    console.log('尝试转发：' + this.data['name'])
    return {
      title: '点击查看“' + this.data['name'] + '”的释义',
      path: '/pages/idiom/idiom?id=' + this.data['dt']['id']
    }
  },
  onTTSTap(e) {
    if (innerAudioContext.paused) {
      wx.vibrateShort()
      if (this.data['audioAddress'] == null) {
        var tTSSource = this.data['defs'][e.currentTarget.id]['text'] //获取到对应的def。
        var substr = tTSSource.match(/〈.〉/g) //匹配“〈口〉”这种东西。
        for (var idx in substr) {
          tTSSource = tTSSource.replace(substr[idx], '')
        }
        tTSSource = tTSSource.replace('~', this.data['name']) //将“~”替换为成语名称、
        this.data['tTSSource'] = tTSSource
        var token = wx.getStorageSync('token')
        var tokenUT = token.split('.')[3] //token里存的到期时间，虽然我不确定它的角标是不是永远是3。
        var currentUT = format.getUnixTimestamp(false)
        console.log('当前时间戳：' + currentUT)
        console.log('Token时间戳：' + tokenUT)
        if (token == '' || currentUT > tokenUT - 10) { //如果token为''或时间超过token时间（预留了十秒左右），就重新获取token。
          call.getTTSToken(this.tokenGot)
          console.log('重获取Token')
        } else {
          call.downloadTTSAudio(token, guid.checkGuid(), this.data['tTSSource'], this.onPlay)
          console.log('使用缓存Token')
        }
      } else {
        wx.vibrateShort()
        console.log('直接用变量内的地址播放')
        innerAudioContext.play()
      }
    }
  },
  tokenGot(tok) {
    wx.setStorageSync('token', tok)
    call.downloadTTSAudio(tok, guid.checkGuid(), this.data['tTSSource'], this.onPlay)
  },
  onPlay(src) {
    this.data['audioAddress'] = src
    innerAudioContext.src = src
    innerAudioContext.play()
  }
})