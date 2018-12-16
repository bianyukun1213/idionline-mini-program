function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

function guid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
}

function checkGuid() {
  var g = wx.getStorageSync('guid')
  if (g == '') {
    g = guid.guid()
    wx.setStorageSync('guid', g)
    console.log('GUID已生成：' + g)
  }
  return g
}
module.exports.guid = guid
module.exports.checkGuid = checkGuid