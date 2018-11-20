function applyMainColor() {
  var color = getApp().globalData['mainColor']//这句实际上必须写里面，不然获取到的会是设置color之前的null。
  if (color != null) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
  }
}
module.exports.applyMainColor = applyMainColor