function applyMainColor() {
  var color = getApp().globalData['launchInf']['mainColor'] //这句实际上必须写里面，不然获取到的会是设置color之前的null。
  var reg = new RegExp('^#[0-9a-fA-F]{6}$', 'g')
  if (reg.exec(color)) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
    wx.setTabBarStyle({
      color: '#CCCCCC',
      selectedColor: '#FFFFFF',
      backgroundColor: color
    })
  }
}
module.exports.applyMainColor = applyMainColor