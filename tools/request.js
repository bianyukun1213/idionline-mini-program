function get(args) {
  var url = args['url']
  var data = args['data']
  var doSuccess = args['doSuccess']
  var exHandler = args['exHandler']
  var type = args['type']
  var urlBase
  console.log('请求参数列表：\nurl：', url, '\ndata：', data, '\ndoSuccess：', doSuccess, '\nexHandler：', exHandler, '\ntype：', type)
  if (type == 'TTS') {
    urlBase = 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=BfYDfQxbqmKPazSVr1He4Lap&client_secret=z9PXBM0P1bUFDEYgfiSnSax5mHZEHD18'
  } else {
    if (getApp().globalData['dbgMode']) {
      urlBase = 'http://localhost:12601/api/'
    } else {
      urlBase = 'https://idionline.picp.io/api/'
    }
  }
  if (url == undefined) {
    url = ''
  }
  wx.showLoading({
    title: '请稍候',
    mask: true
  })
  console.log('发送请求：' + urlBase + url)
  wx.request({
    url: urlBase + url,
    data: data,
    success(res) {
      wx.hideLoading()
      if (res.statusCode == 200 && typeof doSuccess == 'function') {
        if (type == 'TTS') {
          console.log('查询到数据：', res.data)
          doSuccess(res.data)
        } else {
          if (res.data['code'] == 0) {
            console.log('查询到数据：', res.data)
            doSuccess(res.data['result'])
          } else
            fail(res.statusCode, res.data['code'], res.data['msg'], exHandler)
        }
      } else if (res.statusCode == 404) {
        notFound(exHandler)
      } else {
        fail(res.statusCode, res.data['code'], res.data['msg'], exHandler)
      }
    },
    fail(err) {
      wx.hideLoading()
      fail(err.errMsg, exHandler)
    }
  })
}

function downloadTTSAudio(tok, cuid, tex, doSuccess) {
  wx.showLoading({
    title: '请稍候',
    mask: true
  })
  var url = 'https://tsn.baidu.com/text2audio?tok=' + tok + '&cuid=' + cuid + '&lan=zh&ctp=1&tex=' + tex
  console.log('请求百度语音合成数据：' + url)
  wx.downloadFile({
    url: url,
    success(res) {
      wx.hideLoading()
      if (res.statusCode === 200 && typeof doSuccess == 'function') {
        console.log('下载文件：' + res.tempFilePath)
        //这里不必校验文件格式，播放时会自动校验。
        doSuccess(res.tempFilePath)
      } else if (res.statusCode == 404) {
        notFound()
      } else {
        fail(res.statusCode)
      }
    },
    fail(err) {
      wx.hideLoading()
      fail(err.errMsg)
    }
  })
}

function uniFunc(url, method, dt, doSuccess) {
  wx.showLoading({
    title: '请稍候',
    mask: true
  })
  var urlNew
  if (getApp().globalData['dbgMode']) {
    urlNew = 'http://localhost:12601/api/' + url
  } else {
    urlNew = 'https://idionline.picp.io/api/' + url
  }
  console.log('进行操作：' + method + ' ' + url)
  wx.request({
    url: urlNew,
    method: method,
    data: dt,
    success(res) {
      wx.hideLoading()
      if (res.statusCode == 200 && res.data['code'] == 0 && typeof doSuccess == 'function') {
        console.log('查询到数据：', res.data)
        doSuccess(res.data['result'])
      } else if (res.statusCode == 404) {
        notFound()
      } else {
        fail(res.statusCode, res.data['code'], res.data['msg'])
      }
    },
    fail(err) {
      wx.hideLoading()
      fail(err.errMsg)
    }
  })
}

function fail(code, codeFromIdionline, state, exHandler) {
  console.log('错误：' + code + ',' + codeFromIdionline + ',' + state)
  if (typeof exHandler == 'function') {
    console.log('将执行exHandler()')
    exHandler()
  } else {
    wx.vibrateLong()
    if (codeFromIdionline != undefined)
      wx.showToast({
        title: '错误：' + state,
        icon: 'none'
      })
    else
      wx.showToast({
        title: '错误：' + code,
        icon: 'none'
      })
  }
}

function notFound(exHandler) {
  console.log('未查询到数据')
  if (typeof exHandler == 'function') {
    console.log('将执行exHandler()')
    exHandler()
  } else {
    wx.vibrateLong()
    wx.showToast({
      title: '很抱歉，未查询到数据！',
      icon: 'none'
    })
  }
}
module.exports.get = get
module.exports.downloadTTSAudio = downloadTTSAudio
module.exports.uniFunc = uniFunc