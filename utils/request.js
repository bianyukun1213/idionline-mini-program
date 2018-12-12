const host = 'https://idionline.picp.io/api/'
//网上抄的
function get(url, doSuccess) {
  console.log(getApp())
  wx.showLoading({
    title: '请稍候~'
  })
  console.log('发送请求：' + host + url)
  wx.request({
    url: host + url,
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200 && typeof doSuccess == 'function') {
        console.log('查询到数据：', res.data)
        doSuccess(res.data)
      } else if (res.statusCode == 404) {
        console.log('未查询到数据：' + res.statusCode)
        wx.showToast({
          title: '很抱歉，未查询到数据！',
          icon: 'none'
        })
      } else {
        console.log('错误：' + res.statusCode)
        wx.showToast({
          title: '错误：' + res.statusCode,
          icon: 'none'
        })
      }
    },
    fail: function(err) {
      wx.hideLoading()
      console.log('错误：' + err.errMsg)
      wx.showToast({
        title: '错误：' + err.errMsg,
        icon: 'none'
      })
    }
  })
}
module.exports.get = get