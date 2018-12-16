function apl() {
  var color = getApp().globalData['launchInf']['mainColor'] //这句实际上必须写里面，不然获取到的会是设置color之前的null。
  var reg = new RegExp('^#[0-9a-fA-F]{6}$')//为什么开发工具不会打包上传这个文件？？？？？
  console.log('为什么开发工具不会打包上传这个文件？？？？？')
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