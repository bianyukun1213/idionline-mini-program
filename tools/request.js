//网上抄的
function get(url, doSuccess) {
  wx.showLoading({
    title: '请稍候~',
    mask: true
  })
  console.log('发送请求：https://idionline.picp.io/api/' + url)
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

function downloadTTSAudio(tok, cuid, tex, doSuccess) {
  wx.showLoading({
    title: '请稍候~',
    mask: true
  })
  var url = 'https://tsn.baidu.com/text2audio?tok=' + tok + '&cuid=' + cuid + '&lan=zh&ctp=1&tex=' + tex
  console.log('请求百度语音合成数据：' + url)
  wx.downloadFile({
    url: url,
    success(res) {
      wx.hideLoading()
      if (res.statusCode === 200 && typeof doSuccess == 'function') {
        console.log(res.tempFilePath)
        if (res.tempFilePath.slice(-3) == 'mp3') {
          console.log('下载到合成音频：' + res.tempFilePath)
          doSuccess(res.tempFilePath)
        } else {
          fail('文件格式错误')
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
module.exports.getTTSToken = getTTSToken
module.exports.downloadTTSAudio = downloadTTSAudio