const CALL = require('../../tools/request.js');
const FORMAT = require('../../tools/format.js');
const COLOR = require('../../tools/color.js');
const INFO = require('../../tools/info.js');
const STTRANSLATION = require('../../tools/sTTranslation.js');
let innerAudioContext;
Page({
  data: {
    translations: {},
    refresh: false,
    //deleted: false,
    platform: '',
    color: '',
    id: '',
    name: '',
    index: '',
    pinyin: '',
    py: '',
    origin: '',
    ori: '',
    tags: [],
    tbc: '',
    defs: [],
    defTexts: [],
    lastEditor: '',
    updateTime: '',
    toBeCorrected: false,
    tTSText: '', //对应释义的文本。
    tTSCurrent: '',
    tTSSrc: {},
    shareFlag: false,
    //sessionId: '',
    painting: {},
    show: false,
    filePath: '',
    singlePage: false,
    longinSucceed: false,
    options: [],
  },
  onLoad(option) {
    this.setData({
      translations: getApp().globalData.translations
    });
    this.setData({
      options: [{
          name: this.data.translations.idiomSharingOptionName1,
          icon: getApp().globalData.platform.tag === 'QQ' ? 'qq' : 'wechat',
          openType: 'share',
        },
        {
          name: this.data.translations.idiomSharingOptionName2,
          icon: 'poster',
        },
        {
          name: this.data.translations.idiomSharingOptionName3,
          icon: 'link',
        },
      ],
    });
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
    INFO.getLaunchInfo(this.callback);
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onError(function callback(errCode) {
      console.log('音频播放错误：', errCode);
      wx.showToast({
        title: this.data.translations.idiomToastTitleAudioError,
        icon: 'none',
        mask: true,
      });
      innerAudioContext.stop();
    });
    this.data.id = option.id;
    this.refresh();
  },
  onUnload() {
    console.log('成语页面卸载');
    innerAudioContext.destroy();
  },
  onShow() {
    COLOR.apl();
    // if (this.data.deleted)
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   });
    if (this.data.name !== '')
      wx.setNavigationBarTitle({
        title: '【' + this.data.name + '】',
      });
    if (this.data.refresh) {
      this.refresh();
      this.data.refresh = false;
    }
  },
  refresh() {
    //this.data.sessionId = wx.getStorageSync('user').sessionId;
    CALL.get({
      url: 'idiom/' + this.data.id,
      // data: {
      //   sessionId: this.data.sessionId,
      // },
      doSuccess: this.fillData,
      exHandler: this.exHandler,
    });
    this.data.tTSText = '';
    this.data.tTSCurrent = '';
    this.data.tTSSrc = {};
    innerAudioContext.stop();
    if (this.data.loginSucceeded) this.doEdit();
  },
  //获取启动信息的回调函数。
  callback() {
    this.setData({
      text: getApp().globalData.launchInfo.text,
    });
    COLOR.apl();
  },
  fillData(data) {
    if (
      getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
      'idiom'
    )
      wx.setNavigationBarTitle({
        title: '【' + data.name + '】',
      });
    this.setData({
      defTexts: []
    });
    let textsTmp = [];
    data.definitions.forEach((element) => {
      textsTmp[data.definitions.indexOf(element)] = [];
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
          textsTmp[data.definitions.indexOf(element)].push({
            text: element.links[id],
            isLink: true,
            id: id,
          });
        } else {
          textsTmp[data.definitions.indexOf(element)].push({
            text: el,
            isLink: false,
          });
        }
      });
    });
    //赋一堆值。
    this.setData({
      id: data.id,
      name: data.name,
      defs: data.definitions,
      defTexts: textsTmp,
      lastEditor: data.lastEditor,
      updateTime: FORMAT.formatDate(data.updateTimeUT, false),
    });
    if (data.pinyin !== null)
      this.setData({
        pinyin: data.pinyin,
        py: data.pinyin,
      });
    else
      this.setData({
        pinyin: '',
        py: '',
      });
    if (data.tags !== null)
      this.setData({
        tags: data.tags,
      });
    else
      this.setData({
        tags: [],
      });
    if (data.origin !== null)
      this.setData({
        origin: data.origin,
        ori: this.data.translations.idiomTextOriginateFrom +
          '《' +
          data.origin
          .replace('《', '{左单书名号}')
          .replace('》', '{右单书名号}')
          .replace('〈', '{左双书名号}')
          .replace('〉', '{右双书名号}')
          .replace('{左单书名号}', '〈')
          .replace('{右单书名号}', '〉')
          .replace('{左双书名号}', '《')
          .replace('{右双书名号}', '》') +
          '》，',
      });
    else
      this.setData({
        origin: '',
        ori: '',
      });
    if (data.toBeCorrected)
      this.setData({
        tbc: this.data.translations.idiomTextToBeCorrected,
      });
    else
      this.setData({
        tbc: '',
      });
    this.data.index = data.index;
    this.data.toBeCorrected = data.toBeCorrected;
    this.data.shareFlag = true;
    let favorites = wx.getStorageSync('favorites') || {};
    if (typeof favorites[this.data.id] !== 'undefined') {
      favorites[this.data.id] = this.data.name;
      wx.setStorageSync('favorites', favorites);
    }
    console.log('获取到成语释义：', this.data.defs);
  },
  onClick(e) {
    wx.vibrateShort();
    innerAudioContext.stop();
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id.split('-')[0],
    });
  },
  onClickTag(e) {
    wx.vibrateShort();
    innerAudioContext.stop();
    let value = '标签：' + this.data.tags[e.currentTarget.id.split('-')[1]];
    wx.setClipboardData({
      data: value,
    });
  },
  onCollect() {
    wx.vibrateShort();
    let favorites = wx.getStorageSync('favorites') || {};
    favorites[this.data.id] = this.data.name;
    wx.setStorageSync('favorites', favorites);
    wx.showToast({
      title: this.data.translations.idiomToastTitleCompletion,
      mask: true,
    });
    console.log('已添加成语至收藏：【' + this.data.name + '】');
  },
  onCorrect() {
    wx.vibrateShort();
    innerAudioContext.stop();
    let json = {
      id: this.data.id,
      name: this.data.name,
    };
    let str = encodeURIComponent(JSON.stringify(json));
    wx.navigateTo({
      url: '/pages/correction/correction?str=' + str,
      fail: this.failToNavigate,
    });
  },
  copyId() {
    wx.vibrateShort();
    let that = this;
    //innerAudioContext.stop();
    wx.setClipboardData({
      data: this.data.id,
      success() {
        console.log('已复制成语 Id 到剪贴板：' + that.data.id);
      },
    });
  },
  onSolitaire() {
    wx.vibrateShort();
    let str = this.data.name;
    if (getApp().getLocale() === 'zh-HK' || getApp().getLocale() === 'zh-TW') {
      str = STTRANSLATION.simplized(str);
    }
    CALL.get({
      url: 'idiom/playsolitaire/' + str,
      doSuccess: this.doneSolitaire,
      exHandler: this.exHandlerS,
    });
  },
  doneSolitaire(data) {
    wx.showModal({
      title: this.data.translations.idiomModalTitleSolitaire,
      content: '〖' + data + '〗',
      confirmText: this.data.translations.idiomModalConfirmTextCopyResult,
      cancelText: this.data.translations.idiomModalCancelTextCancel,
      success(res) {
        wx.vibrateShort();
        if (res.confirm)
          wx.setClipboardData({
            data: data,
            success() {
              console.log('已复制成语接龙返回数据到剪贴板：' + data);
            },
          });
      },
    });
  },
  onEdit() {
    wx.vibrateShort();
    if (typeof getApp().globalData.user.sessionId !== 'undefined')
      this.doEdit();
    else {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
  },
  doEdit() {
    this.data.loginSucceeded = false;
    innerAudioContext.stop();
    let json = {
      id: this.data.id,
      //sessionId: this.data.sessionId,
      // name: this.data.name,
      // indexOfIdiom: this.data.index,
      // pinyin: this.data.pinyin,
      // origin: this.data.origin,
      // toBeCorrected: this.data.toBeCorrected,
    };
    //let definitionUpdates = [];
    // for (let k in this.data.defs) {
    //   if (this.data.defs.hasOwnProperty(k)) {
    //     definitionUpdates.push({
    //       source: this.data.defs[k].source,
    //       text: this.data.defs[k].text,
    //       addition: this.data.defs[k].addition,
    //       isBold: this.data.defs[k].isBold,
    //     });
    //   }
    // }
    // json.definitionUpdates = definitionUpdates;
    let str = encodeURIComponent(JSON.stringify(json));
    wx.navigateTo({
      url: '/pages/edit/edit?str=' + str,
      fail: this.failToNavigate,
    });
  },
  onClose() {
    wx.vibrateShort();
    this.setData({
      show: false,
    });
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
          title: that.data.translations.idiomToastTitleSaved,
          mask: true,
        });
      },
      fail() {
        wx.showToast({
          title: that.data.translations.idiomToastTitleSaveFailed,
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
          title: this.data.translations.idiomLoadingTitleGenerating,
          mask: true,
        });
        let name = '【' + this.data.name + '】';
        if (this.data.defs.length > 1)
          name = name + this.data.translations.idiomTextPartial;
        this.setData({
          painting: {
            width: 1080,
            height: 1440,
            views: [{
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
  onShare() {
    wx.vibrateShort();
    this.setData({
      show: true,
    });
  },
  onShareAppMessage() {
    console.log('尝试转发【' + this.data.name + '】');
    if (this.data.shareFlag) {
      return {
        title: this.data.translations.idiomTextSharing1 +
          this.data.name +
          this.data.translations.idiomTextSharing2,
        imageUrl: '/images/sharing.png',
      };
    }
    return {
      title: this.data.translations.idiomTextInvalidSharing,
      imageUrl: '/images/sharing.png',
    };
  },
  onShareTimeline() {
    console.log('尝试转发【' + this.data.name + '】');
    if (this.data.shareFlag) {
      return {
        title: this.data.translations.idiomTextSharing1 +
          this.data.name +
          this.data.translations.idiomTextSharing2,
        imageUrl: '/images/favorites-timeline.png',
      };
    }
    return {
      title: this.data.translations.idiomTextInvalidSharing,
      imageUrl: '/images/favorites-timeline.png',
    };
  },
  onTTSTap(e) {
    wx.vibrateShort();
    wx.showToast({
      title: this.data.translations.idiomToastTitleUnavailable,
      icon: 'none',
      mask: true,
    });
    return;
    if (innerAudioContext.paused) {
      if (wx.getLaunchOptionsSync().scene === 1154) {
        wx.showToast({
          title: this.data.translations.idiomToastTitleMoreFeatures,
          icon: 'none',
          mask: true,
        });
        wx.vibrateLong();
        return;
      }
      wx.vibrateShort();
      this.data.tTSCurrent = e.currentTarget.id.replace('speaker-', '');
      console.log('变量中的音频地址：', this.data.tTSSrc);
      if (typeof this.data.tTSSrc[this.data.tTSCurrent] === 'undefined') {
        console.log('当前音频地址在变量中不存在');
        let tTSText = this.data.defs[this.data.tTSCurrent].text; //获取到对应的def。
        let substr = tTSText.match(/(\(.*?\)|（.*?）|\[.*?\]|{.*?})/g); //匹配“〈口〉”这种东西和各种括号中的内容，方头括号、六角括号除外。
        for (let idx in substr) {
          if (substr.hasOwnProperty(idx))
            tTSText = tTSText.replace(substr[idx], '');
        }
        tTSText = tTSText.replace(/(~|～)/g, this.data.name); //将“~”替换为成语名称。
        this.data.tTSText = tTSText;
        let token = wx.getStorageSync('token');
        let tokenUT = token.split('.')[3]; //token里存的到期时间，虽然我不确定它的角标是不是永远是3。
        let currentUT = FORMAT.getUnixTimestamp();
        console.log('当前时间戳：' + currentUT);
        console.log('Token 时间戳：' + tokenUT);
        if (token === '' || currentUT > tokenUT - 10) {
          //如果token为''或时间超过token时间（预留了十秒左右），就重新获取token。
          CALL.get({
            doSuccess: this.tokenGotten,
            type: 'TTS',
          });
          console.log('重获取 Token');
        } else {
          CALL.downloadTTSAudio(
            token,
            'Idionline',
            this.data.tTSText,
            this.onPlay
          );
          console.log('使用缓存 Token');
        }
      } else {
        console.log('当前音频地址在变量中存在，将直接播放');
        innerAudioContext.src = this.data.tTSSrc[this.data.tTSCurrent];
        innerAudioContext.play();
      }
    }
  },
  tokenGotten(data) {
    wx.setStorageSync('token', data.access_token);
    CALL.downloadTTSAudio(
      data.access_token,
      'Idionline',
      this.data.tTSText,
      this.onPlay
    );
  },
  onPlay(src) {
    this.data.tTSSrc[this.data.tTSCurrent] = src;
    innerAudioContext.src = src;
    innerAudioContext.play();
  },
  exHandler(code, codeFromIdionline, msg) {
    wx.vibrateLong();
    if (typeof codeFromIdionline !== 'undefined')
      wx.showToast({
        title: this.data.translations.idiomToastTitleError + msg,
        icon: 'none',
        mask: true,
      });
    else
      wx.showToast({
        title: this.data.translations.idiomToastTitleError + code,
        icon: 'none',
        mask: true,
      });
    setTimeout(function () {
      if (
        getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
        'idiom'
      )
        wx.switchTab({
          url: '/pages/index/index',
        });
    }, 1500);
  },
  exHandlerS(code, codeFromIdionline, msg) {
    if (codeFromIdionline !== 20001) {
      wx.vibrateLong();
      if (typeof codeFromIdionline !== 'undefined')
        wx.showToast({
          title: this.data.translations.idiomToastTitleError + msg,
          icon: 'none',
          mask: true,
        });
      else
        wx.showToast({
          title: this.data.translations.idiomToastTitleError + code,
          icon: 'none',
          mask: true,
        });
      return;
    }
    wx.showToast({
      title: this.data.translations.idiomToastTitleSolitaireUnavailable,
      icon: 'none',
      mask: true,
    });
    wx.vibrateLong();
  },
  onCopy(e) {
    wx.vibrateShort();
    let index = e.currentTarget.id.replace('text-', '');
    wx.setClipboardData({
      data: this.data.defs[index].text,
    });
  },
  onReachBottom() {
    wx.vibrateShort();
  },
  onAddToFavorites() {
    return {
      imageUrl: '/images/favorites-timeline.png',
    };
  },
});