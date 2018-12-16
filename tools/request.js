//网上抄的
function get(url, doSuccess) {
  wx.showLoading({
    title: '请稍候~',
    mask: true
  })
  console.log('发送请求：https://idionline.picp.io/api/ + url')
  wx.request({
    url: 'https://idionline.picp.io/api/' + url,
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200 && typeof doSuccess == 'function') {
        console.log('查询到数据：', res.data)
        doSuccess(res.data)
      } else if (res.statusCode == 404) {
        notFound()
      } else {
        fail(res.statusCode)
      }
    },
    fail: function(err) {
      fail(err.errMsg)
    }
  })
}

function getTTSToken(doSuccess) {
  wx.showLoading({
    title: '请稍候~',
    mask: true
  })
  var url = 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=BfYDfQxbqmKPazSVr1He4Lap&client_secret=z9PXBM0P1bUFDEYgfiSnSax5mHZEHD18'
  console.log('请求百度语音合成Token：' + url)
  wx.request({
    url: url,
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200 && typeof doSuccess == 'function') {
        console.log('请求到Token：' + res.data['access_token'])
        doSuccess(res.data['access_token'])
      } else if (res.statusCode == 404) {
        notFound()
      } else {
        fail(res.statusCode)
      }
    },
    fail: function(err) {
      fail(err.errMsg)
    }
  })
}

function getTTSAudio(tok, cuid, tex, doSuccess) {
  wx.showLoading({
    title: '请稍候~',
    mask: true
  })
  var url = 'https://tsn.baidu.com/text2audio?tok=' + tok + '&cuid=' + cuid + '&lan=zh&ctp=1&tex=' + tex
  console.log('请求百度语音合成数据：' + url)
  wx.request({
    url: url,
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200 && typeof doSuccess == 'function') {
        if (res['header']['Content-Type'] = 'audio/mp3') {
          console.log('请求到语音合成数据')
          doSuccess(url)
        } else {
          console.log('语音合成服务返回错误：' + res.data['err_detail'])
          wx.showToast({
            title: '错误：' + res.data['err_detail'],
            icon: 'none'
          })
        }
      } else if (res.statusCode == 404) {
        notFound()
      } else {
        fail(res.statusCode)
      }
    },
    fail: function(err) {
      fail(err.errMsg)
    }
  })
}

function fail(code) {
  console.log('错误：' + code)
  wx.showToast({
    title: '错误：' + code,
    icon: 'none'
  })
}

function notFound() {
  console.log('未查询到数据：' + res.statusCode)
  wx.showToast({
    title: '很抱歉，未查询到数据！',
    icon: 'none'
  })
}
module.exports.get = get
module.exports.getTTSAudio = getTTSAudio
module.exports.getTTSToken = getTTSToken