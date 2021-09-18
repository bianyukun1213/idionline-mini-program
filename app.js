const COLOR = require('tools/color.js');
const I18N = require('tools/i18n.js');
App({
  towxml: require('/towxml/index'),
  globalData: {
    user: {},
    settings: {},
    locale: '',
    translations: {},
    debugMode: false,
    version: '1.52.0',
    platform: {
      tag: '',
      str: '',
    },
    launchInfo: {},
    refreshOnIndex: false,
  },
  onLaunch() {
    this.globalData.user = wx.getStorageSync('user') || {};
    let info = wx.getSystemInfoSync();
    this.setLocale(info);
    console.log('已启动：', info);
    if (info.isQB) {
      this.globalData.platform.tag = 'QB';
      this.globalData.platform.str = this.globalData.translations.appTextPlatformStringQB;
    } else if (info.AppPlatform === 'qq') {
      this.globalData.platform.tag = 'QQ';
      this.globalData.platform.str = this.globalData.translations.appTextPlatformStringQQ;
    } else {
      this.globalData.platform.tag = 'WeChat';
      this.globalData.platform.str = this.globalData.translations.appTextPlatformStringWechat;
    }
    console.log('平台：' + this.globalData.platform.str);
    console.log('版本：' + this.globalData.version);
  },
  onThemeChange() {
    COLOR.apl();
  },
  initiateSettings() {
    let settings = wx.getStorageSync('settings');
    if (settings === '') {
      settings = {};
      wx.setStorageSync('settings', settings);
    }
    this.globalData.settings = settings;
  },
  setLocale(info) {
    this.initiateSettings();
    let settings = this.globalData.settings;
    if (
      typeof settings.language === 'undefined' ||
      (settings.language !== 'system' &&
        !I18N.TRANSLATIONS.hasOwnProperty(settings.language))
    ) {
      settings.language = 'system';
      wx.setStorageSync('settings', settings);
    }
    if (settings.language === 'system') {
      if (typeof info !== 'undefined' && typeof info.language !== 'undefined') {
        let localeStr = info.language.replace('_', '-');
        if (I18N.TRANSLATIONS.hasOwnProperty(localeStr)) {
          this.globalData.locale = localeStr;
          let locale = this.getLocale();
          this.globalData.translations = I18N.TRANSLATIONS[locale];
          console.log('设置语言：' + locale);
          return;
        } else {
          this.globalData.locale = 'zh-CN';
          let locale = this.getLocale();
          this.globalData.translations = I18N.TRANSLATIONS[locale];
          console.log('设置语言：' + locale);
          return;
        }
      } else {
        let info = wx.getSystemInfoSync();
        if (
          typeof info !== 'undefined' &&
          typeof info.language !== 'undefined'
        ) {
          let localeStr = info.language.replace('_', '-');
          if (I18N.TRANSLATIONS.hasOwnProperty(localeStr)) {
            this.globalData.locale = localeStr;
            let locale = this.getLocale();
            this.globalData.translations = I18N.TRANSLATIONS[locale];
            console.log('设置语言：' + locale);
            return;
          } else {
            this.globalData.locale = 'zh-CN';
            let locale = this.getLocale();
            this.globalData.translations = I18N.TRANSLATIONS[locale];
            console.log('设置语言：' + locale);
            return;
          }
        } else {
          this.globalData.locale = 'zh-CN';
          let locale = this.getLocale();
          this.globalData.translations = I18N.TRANSLATIONS[locale];
          console.log('设置语言：' + locale);
          return;
        }
      }
    } else {
      this.globalData.locale = settings.language;
      let locale = this.getLocale();
      this.globalData.translations = I18N.TRANSLATIONS[locale];
      console.log('设置语言：' + locale);
    }
  },
  getLocale() {
    return this.globalData.locale;
  },
  setPageTitleTranslation(key) {
    if (typeof this.globalData.translations[key] !== 'undefined')
      wx.setNavigationBarTitle({
        title: this.globalData.translations[key],
      });
    else
      wx.setNavigationBarTitle({
        title: this.globalData.translations.appPageTitle,
      });
  },
  setTabBarTranslation() {
    if (typeof this.globalData.translations.appTabBarText1 !== 'undefined')
      wx.setTabBarItem({
        index: 0,
        text: this.globalData.translations.appTabBarText1,
      });
    if (typeof this.globalData.translations.appTabBarText2 !== 'undefined')
      wx.setTabBarItem({
        index: 1,
        text: this.globalData.translations.appTabBarText2,
      });
    if (typeof this.globalData.translations.appTabBarText3 !== 'undefined')
      wx.setTabBarItem({
        index: 2,
        text: this.globalData.translations.appTabBarText3,
      });
  },
});
