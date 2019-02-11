const call = require('../../tools/request.js')
const format = require('../../tools/format.js')
const color = require('../../tools/color.js')
const inf = require('../../tools/inf.js')
const guid = require('../../tools/guid.js')
var innerAudioContext
Page({
  data: {
    tagColor: null,
    id: null,
    name: null,
    pinyin: '',
    defs: null,
    lastEditor: null,
    updateTime: null,
    tTSText: null, //对应释义的文本。
    tTSCurrent: null,
    tTSSrc: {}
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
      tagColor: color.chk()
      //disableAds: launchInf['disableAds']
    })
    color.apl()
  },
  fillData(data) {
    wx.setNavigationBarTitle({
      title: data['name']
    })
    //赋一堆值。
    this.data['id'] = data['id']
    this.setData({
      name: data['name'],
      defs: data['definitions'],
      lastEditor: data['lastEditor'],
      updateTime: format.formatDate(data['updateTimeUT'])
    })
    if (data['pinyin'] != null) {
      this.setData({
        pinyin: '[' + data['pinyin'] + ']'
      })
    }
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
    marked[this.data['id']] = this.data['name']
    wx.setStorageSync('markedIdioms', marked)
    wx.showToast({
      title: '完成！'
    })
    console.log('已添加成语至收藏：' + this.data['name'])
  },
  onLongPress() {
    wx.vibrateShort()
    var that = this
    wx.setClipboardData({
      data: this.data['id'],
      success(res) {
        console.log('已复制成语Id到剪贴板：' + that.data['id'])
      }
    })
  },
  onShareAppMessage() {
    console.log('尝试转发：' + this.data['name'])
    return {
      title: '点击查看“' + this.data['name'] + '”的释义',
      path: '/pages/idiom/idiom?id=' + this.data['id']
    }
  },
  onTTSTap(e) {
    if (innerAudioContext.paused) {
      wx.vibrateShort()
      if (getApp().globalData['platform'] == 'QQ浏览器') {
        console.log('由于QQ浏览器上接口的差异，暂时还不能使用朗读功能')
        wx.showModal({
          title: '暂不支持朗读',
          content: '在QQ浏览器上，由于文件下载接口的差异，暂时还不能使用朗读功能！',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.vibrateShort()
            }
          }
        })
        return
      }
      this.data['tTSCurrent'] = e.currentTarget.id
      console.log('变量中的音频地址：', this.data['tTSSrc'])
      if (this.data['tTSSrc'][this.data['tTSCurrent']] == undefined) {
        console.log('当前音频地址在变量中不存在')
        var tTSText = this.data['defs'][this.data['tTSCurrent']]['text'] //获取到对应的def。
        var substr = tTSText.match(/(〈.*?〉|（.*?）)/g) //匹配“〈口〉”这种东西和括号中的内容。
        for (var idx in substr) {
          tTSText = tTSText.replace(substr[idx], '')
        }
        tTSText = tTSText.replace(/(~|～)/g, this.data['name']) //将“~”替换为成语名称、
        this.data['tTSText'] = tTSText
        var token = wx.getStorageSync('token')
        var tokenUT = token.split('.')[3] //token里存的到期时间，虽然我不确定它的角标是不是永远是3。
        var currentUT = format.getUnixTimestamp(false)
        console.log('当前时间戳：' + currentUT)
        console.log('Token时间戳：' + tokenUT)
        if (token == '' || currentUT > tokenUT - 10) { //如果token为''或时间超过token时间（预留了十秒左右），就重新获取token。
          call.getTTSToken(this.tokenGot)
          console.log('重获取Token')
        } else {
          call.downloadTTSAudio(token, guid.checkGuid(), this.data['tTSText'], this.onPlay)
          console.log('使用缓存Token')
        }
      } else {
        console.log('当前音频地址在变量中存在，将直接播放')
        innerAudioContext.src = this.data['tTSSrc'][this.data['tTSCurrent']]
        innerAudioContext.play()
      }
    }
  },
  tokenGot(tok) {
    wx.setStorageSync('token', tok)
    call.downloadTTSAudio(tok, guid.checkGuid(), this.data['tTSText'], this.onPlay)
  },
  onPlay(src) {
    this.data['tTSSrc'][this.data['tTSCurrent']] = src
    innerAudioContext.src = src
    innerAudioContext.play()
  }
})