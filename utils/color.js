function applyMainColor() {
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: getApp().globalData['mainColor']
  })
}
module.exports.applyMainColor = applyMainColor