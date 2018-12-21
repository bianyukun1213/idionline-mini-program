function apl() {
  var color = getApp().globalData['launchInf']['themeColor'] //这句实际上必须写里面，不然获取到的会是设置color之前的null。
  var reg = new RegExp('^#[0-9a-fA-F]{6}$')
  if (reg.test(color)) {
    console.log('颜色正则匹配')
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
module.exports.apl = apl