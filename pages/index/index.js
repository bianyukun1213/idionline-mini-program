const CALL = require('../../tools/request.js');
const FORMAT = require('../../tools/format.js');
const COLOR = require('../../tools/color.js');
const INFO = require('../../tools/info.js');
const STTRANSLATION = require('../../tools/sTTranslation.js');
Page({
  data: {
    translations: {},
    color: '',
    text: '',
    scene: '',
    idiName: '',
    idiId: '',
    pinyin: '',
    defs: [],
    defsLess: [],
    defTexts: [],
    //placeHolder: '',
    value: '',
    compValue: '',
    historyValue: [],
    logoUrl: '../../images/idionline.png',
    showPopup: false,
    startY: 0,
    currentY: 0,
    onTouch: false,
    showDailyIdiom: false,
    idMode: false,
    indexMode: false,
    filePath: '',
    sharedIdiom: '',
    singlePage: false,
    dark: false,
    options: [],
  },
  //启动
  onLoad(para) {
    if (getApp().globalData.platform.tag === 'WeChat') {
      wx.onThemeChange((result) => {
        if (result.theme === 'dark')
          this.setData({
            dark: true,
          });
        else
          this.setData({
            dark: false,
          });
      });
    }
    if (wx.getLaunchOptionsSync().scene === 1154) {
      let that = this;
      wx.showNavigationBarLoading({
        success: function () {
          wx.hideNavigationBarLoading();
        },
        fail: function () {
          that.setData({
            singlePage: true,
          });
        },
      });
    }
    this.data.scene = decodeURIComponent(para.scene);
    if (para.showDailyIdiom === 'true') this.data.showDailyIdiom = true;
    this.data.sharedIdiom = para.sharedIdiom;
    console.log('页面参数：', para);
    INFO.getLaunchInfo(this.callback);
  },
  onShow() {
    this.setData({
      translations: getApp().globalData.translations,
    });
    getApp().setTabBarTranslation();
    getApp().setPageTitleTranslation('appPageTitle');
    COLOR.apl();
    if (Object.keys(getApp().globalData.launchInfo).length === 0) {
      this.setData({
        //placeHolder: this.data.translations.indexPlaceholderSearch,
        options: [
          {
            name: this.data.translations.indexSharingOption1,
            icon: getApp().globalData.platform.tag === 'QQ' ? 'qq' : 'wechat',
            openType: 'share',
          },
          { name: this.data.translations.indexSharingOption2, icon: 'poster' },
          { name: this.data.translations.indexSharingOption3, icon: 'link' },
        ],
      });
    } else {
      this.setData({
        // placeHolder:
        //   this.data.translations.indexPlaceholderSearch1 +
        //   ' ' +
        //   getApp().globalData.launchInfo.idiomsCount +
        //   ' ' +
        //   this.data.translations.indexPlaceholderSearch2,
        options: [
          {
            name: this.data.translations.indexSharingOption1,
            icon: getApp().globalData.platform.tag === 'QQ' ? 'qq' : 'wechat',
            openType: 'share',
          },
          { name: this.data.translations.indexSharingOption2, icon: 'poster' },
          { name: this.data.translations.indexSharingOption3, icon: 'link' },
        ],
      });
    }
    if (wx.getSystemInfoSync().theme === 'dark')
      this.setData({
        dark: true,
      });
    else
      this.setData({
        dark: false,
      });
    if (getApp().globalData.refreshOnIndex === true) {
      INFO.getLaunchInfo(this.callback, true);
      getApp().globalData.refreshOnIndex = false;
    }
    let reg = new RegExp(/^[\u4e00-\u9fa5]{4}$/); //汉字。
    let regS = new RegExp(/(「|【)[\u4e00-\u9fa5]{4}(」|】)/); //小冰成语接龙。
    let regId = new RegExp(/^[0-9a-zA-Z]{24}$/);
    let that = this;
    wx.getClipboardData({
      //向搜索框自动填充剪贴板数据。
      success(res) {
        let str = res.data;
        if (
          (reg.test(str) || regId.test(str)) &&
          that.data.historyValue.indexOf(str) === -1
        ) {
          //填充历史里有的成语不再填充。
          that.setData({
            value: str,
          });
          that.data.historyValue.push(str);
          console.log('填充历史：', that.data.historyValue);
          wx.showToast({
            title: that.data.translations.indexToastTitleAutoFilled,
            mask: true,
          });
          wx.vibrateShort();
        } else if (regS.test(str)) {
          wx.vibrateShort();
          CALL.get({
            url:
              'idiom/playsolitaire/' +
              regS
                .exec(str)[0]
                .replace('「', '')
                .replace('」', '')
                .replace('【', '')
                .replace('】', ''),
            doSuccess: that.doneSolitaire,
            exHandler: that.exHandlerS,
          });
        }
      },
    });
  },
  doneSolitaire(data) {
    wx.setClipboardData({
      data: data,
      success() {
        console.log('已复制成语接龙返回数据到剪贴板：' + data);
      },
    });
    wx.vibrateShort();
  },
  exHandlerS(code, codeFromIdionline, msg) {
    if (codeFromIdionline !== 20001) {
      wx.vibrateLong();
      if (typeof codeFromIdionline !== 'undefined')
        wx.showToast({
          title: this.data.translations.indexToastTitleError + msg,
          icon: 'none',
          mask: true,
        });
      else
        wx.showToast({
          title: this.data.translations.indexToastTitleError + code,
          icon: 'none',
          mask: true,
        });
      return;
    }
    wx.showToast({
      title: this.data.translations.indexToastTitleSolitaireUnavailable,
      icon: 'none',
      mask: true,
    });
    wx.vibrateLong();
  },
  //获取启动信息的回调函数。
  callback(justRefresh) {
    let launchInfo = getApp().globalData.launchInfo;
    this.setData({
      text: launchInfo.text,
      // placeHolder:
      //   this.data.translations.indexPlaceholderSearch1 +
      //   ' ' +
      //   launchInfo.idiomsCount +
      //   ' ' +
      //   this.data.translations.indexPlaceholderSearch2,
    });
    if (launchInfo.dailyIdiom !== null) {
      this.setData({ defTexts: [] });
      let textsTmp = [];
      launchInfo.dailyIdiom.definitions.forEach((element) => {
        textsTmp[launchInfo.dailyIdiom.definitions.indexOf(element)] = [];
        let textTmp = element.text;
        for (let k in element.links) {
          if (element.links.hasOwnProperty(k)) {
            textTmp = textTmp
              .split(element.links[k])
              .join('{split}{link:' + k + '}{split}'); // 字符串多次替换。
          }
        }
        let arrayTmp = textTmp.split('{split}');
        arrayTmp.forEach((el) => {
          if (el.startsWith('{link:')) {
            let id = el.replace('{link:', '').replace('}', '');
            textsTmp[launchInfo.dailyIdiom.definitions.indexOf(element)].push({
              text: '〖' + element.links[id] + '〗',
              isLink: true,
              id: id,
            });
          } else {
            textsTmp[launchInfo.dailyIdiom.definitions.indexOf(element)].push({
              text: el,
              isLink: false,
            });
          }
        });
      });
      this.setData({
        idiName: launchInfo.dailyIdiom.name,
        idiId: launchInfo.dailyIdiom.id,
        defs: launchInfo.dailyIdiom.definitions,
        defsLess: [launchInfo.dailyIdiom.definitions[0]],
        defTexts: textsTmp,
      });
      if (launchInfo.dailyIdiom.pinyin !== null)
        this.setData({
          pinyin: launchInfo.dailyIdiom.pinyin,
        });
      else
        this.setData({
          pinyin: '',
        });
    } else
      this.setData({
        idiName: '',
        idiId: '',
        defs: '',
        defTexts: [],
        pinyin: '',
        showPopup: false,
      });
    COLOR.apl();
    let reg = new RegExp(/https?:\/\/.+\.(jpg|gif|png|webp)/);
    //匹配Logo地址正则，设置Logo。
    if (reg.test(launchInfo.logoUrl))
      this.setData({
        logoUrl: launchInfo.logoUrl,
      });
    if (justRefresh !== true) {
      //显示对应的场景内容。
      for (let key in launchInfo.argsDic) {
        if (launchInfo.argsDic.hasOwnProperty(key)) {
          if (key === this.data.scene) {
            console.log(
              '查找到对应的场景内容：' + launchInfo.argsDic[this.data.scene]
            );
            wx.showModal({
              title: this.data.translations.indexModalTitleFromCode,
              content: launchInfo.argsDic[this.data.scene],
              confirmText: this.data.translations.indexModalConfirmTextConfirm,
              showCancel: false,
              success() {
                wx.vibrateShort();
              },
            });
            wx.vibrateShort();
          }
        }
      }
      if (this.data.showDailyIdiom) {
        this.data.showDailyIdiom = false;
        if (this.data.idiId !== '') {
          this.setData({
            showPopup: true,
          });
          wx.vibrateShort();
          if (this.data.sharedIdiom !== this.data.idiId)
            wx.showToast({
              title: this.data.translations.indexToastTitleDailyIdiomChanged,
              icon: 'none',
              mask: true,
            });
        }
      }
    }
  },
  //搜索事件。
  onSearch(e) {
    wx.vibrateShort();
    this.data.compValue =
      getApp().getLocale() === 'zh-HK' || getApp().getLocale() === 'zh-TW'
        ? STTRANSLATION.traditionalized(e.detail)
        : e.detail;
    let val =
      getApp().getLocale() === 'zh-HK' || getApp().getLocale() === 'zh-TW'
        ? STTRANSLATION.simplized(e.detail)
        : e.detail;
    this.setData({ value: e.detail });
    if (val === 'debug') {
      wx.navigateTo({
        url: '/pages/debug/debug',
      });
      return;
    }
    this.data.idMode = false;
    this.data.indexMode = false;
    let reg = new RegExp(
      /^((标签：[\u4e00-\u9fa5]+)|([\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?))$/
    ); //汉字。
    let reg2 = new RegExp(/^[0-9a-zA-Z]{24}/);
    let reg3 = new RegExp(/^[A-Za-z]$/);
    if (reg.test(val) && val.length > 1 && val.length <= 12) {
      CALL.get({
        url: 'idiom/search/' + val,
        doSuccess: this.navi,
        exHandler: this.exHandler,
      });
    } else if (reg2.exec(val)) {
      this.data.idMode = true;
      CALL.get({
        url: 'idiom/search/' + val,
        doSuccess: this.navi,
        exHandler: this.exHandler,
      });
    } else if (reg3.exec(val)) {
      this.data.idMode = true;
      CALL.get({
        url: 'idiom/search/' + val,
        doSuccess: this.navi,
        exHandler: this.exHandler,
      });
    } else {
      wx.showToast({
        title: this.data.translations.indexToastTitleWrongDataFormat,
        icon: 'none',
        mask: true,
      });
      wx.vibrateLong();
    }
  },
  //成语未收录时：
  exHandler(code, codeFromIdionline, msg) {
    let dt = this.data.value;
    console.log('查询无结果：' + dt);
    if (codeFromIdionline !== 20001) {
      wx.vibrateLong();
      if (typeof codeFromIdionline !== 'undefined')
        wx.showToast({
          title: this.data.translations.indexToastTitleError + msg,
          icon: 'none',
          mask: true,
        });
      else
        wx.showToast({
          title: this.data.translations.indexToastTitleError + code,
          icon: 'none',
          mask: true,
        });
      return;
    }
    wx.showToast({
      title: this.data.translations.indexToastTitleNoResult,
      icon: 'none',
      mask: true,
    });
    wx.vibrateLong();
  },
  navi(data) {
    //获取key，其实就是第一个的key。
    let k;
    for (let key in data) {
      if (data.hasOwnProperty(key)) k = key;
    }
    if (
      Object.keys(data).length === 1 &&
      (data[k] === this.data.compValue || this.data.idMode)
    ) {
      wx.navigateTo({
        url: '/pages/idiom/idiom?id=' + k,
      });
    } else {
      let linkType = 'navigateTo';
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key].indexOf(this.data.compValue) !== -1) {
            linkType = 'redirectTo';
            break;
          }
        }
      }
      let str = encodeURIComponent(JSON.stringify(data));
      wx.navigateTo({
        url:
          '/pages/selection/selection?str=' +
          str +
          '&linkType="' +
          linkType +
          '"',
      });
    }
  },
  //弹出层关闭。
  onPopupClose() {
    this.setData({
      show: false,
      showPopup: false,
    });
    wx.vibrateShort();
    console.log('点击操作，已关闭弹出层');
  },
  //感应区触摸开始事件，记录开始时触摸点的纵坐标。
  onTouchStart(e) {
    this.data.startY = e.touches[0].pageY;
    console.log('开始点击纵坐标：' + e.touches[0].pageY);
  },
  //感应区触摸移动事件，记录滑动中触摸点的纵坐标。
  onTouchMove(e) {
    this.data.onTouch = true;
    this.data.currentY = e.touches[0].pageY;
    console.log('滑动操作：' + this.data.onTouch);
  },
  //感应区触摸结束事件，计算坐标差，判断是否启用弹出层。
  onTouchEnd(e) {
    if (this.data.onTouch) {
      this.data.onTouch = false;
      let showPopup = this.data.showPopup;
      let startY = this.data.startY;
      let currentY = this.data.currentY;
      console.log('结束点击纵坐标：' + currentY);
      console.log('坐标差：' + (currentY - startY));
      if (currentY - startY <= -50 && !showPopup) {
        this.setData({
          showPopup: true,
        });
        wx.vibrateShort();
        console.log('上划操作，已启用弹出层');
      } else if (currentY - startY >= 50 && showPopup) {
        this.onPopupClose();
        console.log('下划操作，已关闭弹出层');
      }
    }
  },
  //感应区触摸取消事件，触摸被打断时重置变量。
  onTouchCancel(e) {
    this.data.onTouch = false;
  },
  onClose() {
    wx.vibrateShort();
    this.setData({
      show: false,
    });
  },
  onNoticeBarClose() {
    wx.vibrateShort();
  },
  eventGetImage(e) {
    wx.hideLoading();
    this.data.filePath = e.detail.tempFilePath;
    this.save();
  },
  save() {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.filePath,
      success() {
        wx.showToast({
          title: that.data.translations.indexToastTitleSaved,
          mask: true,
        });
      },
      fail() {
        wx.showToast({
          title: that.data.translations.indexToastTitleSaveFailed,
          icon: 'none',
          mask: true,
        });
        wx.vibrateLong();
      },
    });
  },
  onSelect(event) {
    wx.vibrateShort();
    if (event.detail.index === 0) {
      this.onShareAppMessage();
    } else if (event.detail.index === 1) {
      if (this.data.filePath === '') {
        wx.showLoading({
          title: this.data.translations.indexLoadingTitleGenerating,
          mask: true,
        });
        let name =
          FORMAT.formatDate(getApp().globalData.launchInfo.dateUT, true) +
          '：【' +
          this.data.idiName +
          '】';
        if (this.data.defs.length > 1)
          name = name + this.data.translations.indexTextPartial;
        this.setData({
          painting: {
            width: 1080,
            height: 1440,
            views: [
              {
                type: 'image',
                url: '/images/sharing-pic.png',
                width: 1080,
                height: 1440,
              },
              {
                type: 'text',
                top: 100,
                left: 100,
                content: name,
                fontSize: 48,
                color: '#008080',
                textAlign: 'left',
                bolder: true,
              },
              {
                type: 'rect',
                top: 160,
                left: 100,
                width: 880,
                height: 5,
                background: '#008080',
              },
              {
                type: 'text',
                top: 220,
                left: 100,
                width: 860,
                lineHeight: 50,
                MaxLineNumber: 15,
                content: this.data.defs[0].text,
                fontSize: 36,
                color: '#008080',
                textAlign: 'left',
                breakWord: true,
              },
            ],
          },
        });
      } else {
        this.save();
      }
    } else if (event.detail.index === 2) {
      this.copyId();
    }
    this.onClose();
  },
  copyId() {
    wx.vibrateShort();
    let that = this;
    //innerAudioContext.stop();
    wx.setClipboardData({
      data: this.data.idiId,
      success() {
        console.log('已复制成语 Id 到剪贴板：' + that.data.idiId);
      },
    });
  },
  onShare() {
    wx.vibrateShort();
    this.setData({
      show: true,
    });
  },
  onShareAppMessage() {
    if (this.data.idiId !== '') {
      let date = FORMAT.formatDate(getApp().globalData.launchInfo.dateUT, true);
      return {
        title: date + '：【' + this.data.idiName + '】',
        imageUrl: '/images/sharing.png',
        path:
          '/pages/index/index?showDailyIdiom=true&sharedIdiom=' +
          this.data.idiId,
      };
    }
    return {
      title: this.data.translations.appPageTitle,
      imageUrl: '/images/sharing.png',
    };
  },
  onShareTimeline() {
    if (this.data.idiId !== '') {
      let date = FORMAT.formatDate(getApp().globalData.launchInfo.dateUT, true);
      return {
        title: date + '：【' + this.data.idiName + '】',
        imageUrl: '/images/favorites-timeline.png',
        query: 'showDailyIdiom=true&sharedIdiom=' + this.data.idiId,
      };
    }
    return {
      title: this.data.translations.appPageTitle,
      imageUrl: '/images/favorites-timeline.png',
    };
  },
  onNavi() {
    wx.vibrateShort();
    wx.navigateTo({
      url: '/pages/idiom/idiom?id=' + this.data.idiId,
    });
  },
  onTabItemTap() {
    wx.vibrateShort();
  },
  onCopy(e) {
    wx.vibrateShort();
    let index = e.currentTarget.id.replace('text-', '');
    wx.setClipboardData({
      data: this.data.defs[index].text,
    });
  },
  onClick(e) {
    wx.vibrateShort();
    wx.navigateTo({
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id.split('-')[0],
    });
  },
  onClear() {
    wx.vibrateShort();
  },
  onAddToFavorites() {
    return {
      imageUrl: '/images/favorites-timeline.png',
    };
  },
});
