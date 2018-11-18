var color = getApp().globalData['mainColor']

function applyMainColor() {
  if (color != null) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
  }
}
module.exports.applyMainColor = applyMainColor