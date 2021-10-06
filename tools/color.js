function apl() {
  let currentPage = getCurrentPages()[getCurrentPages().length - 1];
  if (wx.getSystemInfoSync().theme === 'dark') {
    currentPage.setData({
      color: '#464f7a',
    });
    return;
  }
  let color = '';
  if (Object.keys(getApp().globalData.launchInfo).length === 0)
    color = '#008080';
  else color = getApp().globalData.launchInfo.themeColor; //这句实际上必须写里面，不然获取到的会是设置color之前的null。
  let reg = new RegExp(/^#[0-9a-fA-F]{6}$/);
  let currentPageName = currentPage.route.split('/')[2];
  //目前除微信平台，设置导航栏颜色都有瑕疵。
  if (getApp().globalData.platform.tag === 'WeChat') {
    if (!reg.test(color)) color = '#008080';
    color = color.toLowerCase();
  } else {
    color = '#008080';
  }
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: color,
  });
  if (
    currentPageName === 'index' ||
    currentPageName === 'favorites' ||
    currentPageName === 'about'
  )
    wx.setTabBarStyle({
      color: '#cccccc',
      selectedColor: '#ffffff',
      backgroundColor: color,
    });
  currentPage.setData({
    color: color,
  });
}

module.exports.apl = apl;
