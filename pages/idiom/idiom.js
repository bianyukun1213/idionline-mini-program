const call = require('../../tools/request.js')
const format = require('../../tools/format.js')
const color = require('../../tools/color.js')
const info = require('../../tools/info.js')
var innerAudioContext
Page({
  data: {
    xhtad: {
      adData: {},
      ad: {
        banner: true // banner 广告开关
      }
    },
    platform: null,
    color: null,
    id: null,
    name: null,
    pinyin: '',
    origin: '',
    defs: null,
    lastEditor: null,
    updateTime: null,
    tTSText: null, //对应释义的文本。
    tTSCurrent: null,
    tTSSrc: {},
    shareFlag: false,
    openId: null,
    disableAdsLocal: false,
    disableAdsRemote: false,
    painting: null,
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
  onLoad(option) {
    color.apl()
    this.setData({
      color: color.chk()
    })
    this.data['openId'] = wx.getStorageSync('openId')
    call.get({
      url: 'idiom/' + option['id'] + '/' + this.data['openId'],
      doSuccess: this.fillData
    })
    info.getLaunchInfo(this.callback)
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onError(function callback(errCode) {
      console.log('音频播放错误：', errCode)
      wx.showToast({
        title: '音频播放出错！',
        icon: 'none'
      })
      innerAudioContext.stop()
    })
  },
  onUnload(e) {
    console.log('成语页面卸载')
    innerAudioContext.destroy()
  },
  //获取启动信息的回调函数。
  callback() {
    var launchInfo = getApp().globalData['launchInfo']
    var disableAds = wx.getStorageSync('settings')['disableAds']
    if (disableAds == undefined)
      disableAds = false
    this.setData({
      color: color.chk(),
      text: launchInfo['text'],
      platform: getApp().globalData['platform']['tag'],
      disableAdsLocal: disableAds,
      disableAdsRemote: launchInfo['disableAds']
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
      updateTime: format.formatDate(data['updateTimeUT'], false)
    })
    if (data['pinyin'] != null)
      this.setData({
        pinyin: '[' + data['pinyin'] + ']'
      })
    if (data['origin'] != null)
      this.setData({
        origin: '出自' + data['origin'] + '，'
      })
    this.data['shareFlag'] = true
    console.log('获取到成语释义：', this.data['defs'])
  },
  //跳转按钮点击事件。
  onClick(e) {
    wx.vibrateShort()
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id
    })
  },
  onMark() {
    wx.vibrateShort()
    var marked = wx.getStorageSync('markedIdioms') || {}
    marked[this.data['id']] = this.data['name']
    wx.setStorageSync('markedIdioms', marked)
    wx.showToast({
      title: '完成！'
    })
    console.log('已添加成语至收藏：' + this.data['name'])
  },
  onCorrect() {
    wx.vibrateShort()
    var json = {
      'id': this.data['id'],
      'name': this.data['name']
    }
    var str = JSON.stringify(json)
    wx.navigateTo({
      url: '/pages/correct/correct?str=' + str
    })
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
  onSolitaire() {
    wx.vibrateShort()
    call.get({
      url: 'idiom/solitaire/' + this.data['name'],
      doSuccess: this.doneSolitaire
    })
  },
  doneSolitaire(data) {
    wx.showModal({
      title: '成语接龙',
      content: data + '（仅供参考）',
      confirmText: '复制',
      success(res) {
        if (res.confirm) {
          wx.vibrateShort()
          wx.setClipboardData({
            data: data,
            success(res) {
              console.log('已复制成语接龙返回数据到剪贴板：' + data)
            }
          })
        }
      }
    })
    wx.vibrateShort()
  },
  onEdit() {
    wx.vibrateShort()
    if (this.data['openId'] != null && this.data['openId'] != '') {
      var json = {
        'id': this.data['id'],
        'openId': this.data['openId'],
        'name': this.data['name']
      }
      var updates = []
      for (var k in this.data['defs']) {
        updates.push({
          'source': this.data['defs'][k]['source'],
          'text': this.data['defs'][k]['text'],
          'addition': this.data['defs'][k]['addition'],
          'isBold': this.data['defs'][k]['isBold']
        })
      }
      json['updates'] = updates
      var str = JSON.stringify(json)
      wx.redirectTo({
        url: '/pages/edit/edit?str=' + str
      })
    } else {
      wx.showToast({
        title: '缺少OpenID！',
        icon: 'none'
      })
      wx.vibrateLong()
    }
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
      success() {
        wx.showToast({
          title: '已保存！'
        })
      },
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
        var name = this.data['name']
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
    if (this.data['shareFlag']) {
      wx.vibrateShort()
      this.setData({
        show: true
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '这个页面是空白的，转发没有任何意义，希望您取消转发。',
        showCancel: false,
        success(res) {
          if (res.confirm)
            wx.vibrateShort()
        }
      })
      wx.vibrateLong()
    }
  },
  onShareAppMessage() {
    console.log('尝试转发：' + this.data['name'])
    if (this.data['shareFlag']) {
      return {
        title: '点击查看“' + this.data['name'] + '”的释义',
        imageUrl: '/icons/share.png',
        path: '/pages/idiom/idiom?id=' + this.data['id']
      }
    } else {
      wx.showModal({
        title: '警告',
        content: '这个页面是空白的，转发没有任何意义，希望您取消转发。',
        showCancel: false,
        success(res) {
          if (res.confirm)
            wx.vibrateShort()
        }
      })
      wx.vibrateLong()
    }
    return {
      imageUrl: '/icons/share.png'
    }
  },
  onTTSTap(e) {
    if (innerAudioContext.paused) {
      wx.vibrateShort()
      // if (getApp().globalData['platform']['tag'] != 'WeChat') {
      //   console.log('由于接口的差异，暂时还不能使用朗读功能')
      //   wx.showModal({
      //     title: '暂不支持朗读',
      //     content: '在微信以外的平台上，由于文件下载接口的差异，暂时还不能使用朗读功能，请等待官方完善接口。',
      //     showCancel: false,
      //     success(res) {
      //       if (res.confirm) {
      //         wx.vibrateShort()
      //       }
      //     }
      //   })
      //   return
      // }
      if (this.data['openId'] == null || this.data['openId'] == '') {
        wx.showModal({
          title: '缺少OpenID',
          content: '您需要提供OpenID才能使用朗读功能，请去“帮助”页面获取OpenID。',
          showCancel: false,
          success(res) {
            if (res.confirm)
              wx.vibrateShort()
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
        var currentUT = format.getUnixTimestamp()
        console.log('当前时间戳：' + currentUT)
        console.log('Token时间戳：' + tokenUT)
        if (token == '' || currentUT > tokenUT - 10) { //如果token为''或时间超过token时间（预留了十秒左右），就重新获取token。
          call.get({
            doSuccess: this.tokenGot,
            type: 'TTS'
          })
          console.log('重获取Token')
        } else {
          call.downloadTTSAudio(token, this.data['openId'], this.data['tTSText'], this.onPlay)
          console.log('使用缓存Token')
        }
      } else {
        console.log('当前音频地址在变量中存在，将直接播放')
        innerAudioContext.src = this.data['tTSSrc'][this.data['tTSCurrent']]
        innerAudioContext.play()
      }
    }
  },
  tokenGot(data) {
    wx.setStorageSync('token', data['access_token'])
    call.downloadTTSAudio(data['access_token'], this.data['openId'], this.data['tTSText'], this.onPlay)
  },
  onPlay(src) {
    this.data['tTSSrc'][this.data['tTSCurrent']] = src
    innerAudioContext.src = src
    innerAudioContext.play()
  },
  onAdError(e) {
    console.log('广告加载错误：', e)
  }
})