function apl() {
  chk(setBar)
}

function setBar(color) {
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

function chk(callb) {
  if (getApp().globalData['launchInfo'] != null) {
    var color = getApp().globalData['launchInfo']['themeColor'] //这句实际上必须写里面，不然获取到的会是设置color之前的null。
    var reg = new RegExp('^#[0-9a-fA-F]{6}$')
    //目前除微信平台，设置导航栏颜色都有瑕疵。
    if (reg.test(color) && getApp().globalData['platform']['tag'] == 'WeChat') {
      if (typeof callb == 'function') {
        callb(color)
      } else {
        return color
      }
    } else {
      return '#008080'
    }
  } else {
    return '#008080'
  }
}
module.exports.apl = apl
module.exports.chk = chk