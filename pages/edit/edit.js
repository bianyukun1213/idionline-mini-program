const CALL = require('../../tools/request.js');
const COLOR = require('../../tools/color.js');
const STTRANSLATION = require('../../tools/sTTranslation.js');
Page({
  data: {
    translations: {},
    id: '',
    //sessionId: '',
    name: '',
    indexOfIdiom: '',
    pinyin: '',
    origin: '',
    toBeCorrected: false,
    definitionUpdates: [],
    canBeRemoved: [],
    color: '',
    focus: {
      idiomIndex: false,
      idiomPinyin: false,
      idiomOrigin: false,
      source: -1,
      definitionText: -1,
    },
  },
  onLoad(option) {
    this.setData({ translations: getApp().globalData.translations });
    getApp().setPageTitleTranslation('editPageTitle');
    let json = JSON.parse(decodeURIComponent(option.str));
    //更新页面。
    //this.data.sessionId = json.sessionId;
    this.data.id = json.id;
    //this.data.sessionId = wx.getStorageSync('user').sessionId;
    CALL.get({
      url: 'idiom/' + this.data.id,
      // data: {
      //   sessionId: this.data.sessionId,
      // },
      doSuccess: this.fillData,
      exHandler: this.exHandler,
      ignoreS2T: true,
    });
  },
  onShow() {
    COLOR.apl();
  },
  fillData(data) {
    let definitionUpdates = [];
    for (let k in data.definitions) {
      if (data.definitions.hasOwnProperty(k)) {
        definitionUpdates.push({
          source: data.definitions[k].source,
          text: data.definitions[k].text,
          addition: data.definitions[k].addition,
          isBold: data.definitions[k].isBold,
        });
      }
    }
    this.setData({
      id: data.id,
      name: data.name,
      indexOfIdiom: data.index,
      pinyin: data.pinyin,
      origin: data.origin,
      toBeCorrected: data.toBeCorrected,
      definitionUpdates: definitionUpdates,
      focus: this.data.focus,
    });
    for (let k in definitionUpdates) {
      if (definitionUpdates.hasOwnProperty(k))
        this.data.canBeRemoved[k] = false;
    }
  },
  onChangeSource(event) {
    this.data.definitionUpdates[
      event.currentTarget.id.replace('source-', '')
    ].source = event.detail;
  },
  onChangeText(event) {
    this.data.definitionUpdates[
      event.currentTarget.id.replace('definition-text-', '')
    ].text = event.detail;
  },
  onChangeAddition(event) {
    this.data.definitionUpdates[
      event.currentTarget.id.replace('addition-', '')
    ].addition = event.detail;
  },
  onChangeName(event) {
    this.data.name = event.detail;
  },
  onChangeIndex(event) {
    this.data.indexOfIdiom = event.detail;
  },
  onChangePinyin(event) {
    this.data.pinyin = event.detail;
  },
  onChangeOrigin(event) {
    this.data.origin = event.detail;
  },
  check(event) {
    let tmp = this.data.definitionUpdates;
    tmp[
      event.currentTarget.id
        .replace('is-bold-checkbox-', '')
        .replace('is-bold-', '')
    ].isBold = !tmp[
      event.currentTarget.id
        .replace('is-bold-checkbox-', '')
        .replace('is-bold-', '')
    ].isBold;
    this.setData({
      definitionUpdates: tmp,
    });
    wx.vibrateShort();
  },
  correctionCheck() {
    this.setData({
      toBeCorrected: !this.data.toBeCorrected,
    });
    wx.vibrateShort();
  },
  onAdd() {
    wx.vibrateShort();
    let tmp = this.data.definitionUpdates;
    let tmpRm = this.data.canBeRemoved;
    let k;
    for (k in tmp) {
      if (tmp.hasOwnProperty(k)) k++;
    }
    tmp[k] = {
      source: '',
      text: '',
      addition: '',
      isBold: false,
    };
    tmpRm[k] = true;
    this.setData({
      definitionUpdates: tmp,
      canBeRemoved: tmpRm,
    });
  },
  onBsonEdit() {
    wx.vibrateShort();
    console.log(this.data.id);
    let json = {
      id: this.data.id,
      //sessionId: this.data.sessionId,
    };
    let str = encodeURIComponent(JSON.stringify(json));
    wx.navigateTo({
      url: '/pages/bson-edit/bson-edit?str=' + str,
    });
  },
  onDeleteItem(event) {
    wx.vibrateShort();
    console.log(event.currentTarget.id);
    let tmp = this.data.definitionUpdates;
    let tmpRm = this.data.canBeRemoved;
    delete tmp[event.currentTarget.id.replace('delete-item-', '')];
    delete tmpRm[event.currentTarget.id.replace('delete-item-', '')];
    this.setData({
      definitionUpdates: tmp,
      canBeRemoved: tmpRm,
    });
    //console.log('aaaaaaaaaaaaa',this.data.definitionUpdates[4],this.data.canBeRemoved[4])
    console.log(this.data.definitionUpdates);
  },
  onSubmit() {
    wx.vibrateShort();
    let reg = new RegExp(/^[A-Z]$/);
    let reg2 = new RegExp(/^[\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?$/);
    let pinyin = this.data.pinyin === '' ? null : this.data.pinyin;
    let origin = this.data.origin === '' ? null : this.data.origin;
    for (let k in this.data.definitionUpdates) {
      if (this.data.definitionUpdates.hasOwnProperty(k)) {
        if (
          this.data.definitionUpdates[k].source === '' ||
          this.data.definitionUpdates[k].text === '' ||
          !reg2.test(this.data.name) ||
          !reg.test(this.data.indexOfIdiom)
        ) {
          wx.showToast({
            title: this.data.translations.editToastTitleWrongDataFormat,
            icon: 'none',
            mask: true,
          });
          wx.vibrateLong();
          return;
        }
      }
    }
    let tmp = [];
    for (let k in this.data.definitionUpdates) {
      if (this.data.definitionUpdates.hasOwnProperty(k)) {
        if (typeof this.data.definitionUpdates[k] !== 'undefined') {
          let tmp2 = this.data.definitionUpdates[k];
          if (tmp2.addition === '') tmp2.addition = null;
          tmp.push(tmp2);
        }
      }
    }
    let dt = {
      //sessionId: this.data.sessionId,
      bsonStr: null,
      name: this.data.name,
      index: this.data.indexOfIdiom,
      pinyin: pinyin,
      origin: origin,
      toBeCorrected: this.data.toBeCorrected,
      definitionUpdates: tmp,
    };
    if (getApp().getLocale() === 'zh-HK' || getApp().getLocale() === 'zh-TW') {
      let str = JSON.stringify(dt);
      str = STTRANSLATION.simplized(str);
      dt = JSON.parse(str);
    }
    CALL.uniFunc('idiom/' + this.data.id, 'PUT', dt, this.done);
  },
  done(data) {
    wx.showToast({
      title: this.data.translations.editToastTitleUpdateSucceeded,
      icon: 'none',
      mask: true,
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.data.refresh = true;
    if (
      getApp().globalData.launchInfo.dailyIdiom !== null &&
      this.data.id === getApp().globalData.launchInfo.dailyIdiom.id
    )
      getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (
        getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
        'edit'
      )
        wx.navigateBack();
    }, 1500);
  },
  onDelete() {
    let that = this;
    wx.showModal({
      title: that.data.translations.editModalTitleWarning,
      content: that.data.translations.editModalContentAreYouSure,
      confirmText: that.data.translations.editModalConfirmTextDelete,
      confirmColor: '#ff0000',
      cancelText: that.data.translations.editModalCancelTextCancel,
      success(res) {
        wx.vibrateShort();
        if (res.confirm) {
          CALL.uniFunc(
            'idiom/' + that.data.id,
            'DELETE',
            //'"' + that.data.sessionId + '"',
            undefined,
            that.doneDelete
          );
        }
      },
    });
    wx.vibrateLong();
  },
  doneDelete(data) {
    wx.showToast({
      title: this.data.translations.editToastTitleDeleteSucceeded,
      icon: 'none',
      mask: true,
    });
    prevPage.setData({
      deleted: true,
    });
    getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (
        getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
          'edit' ||
        getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
          'idiom'
      )
        wx.switchTab({
          url: '/pages/index/index',
        });
    }, 1500);
  },
  exHandler(code, codeFromIdionline, msg) {
    wx.vibrateLong();
    if (typeof codeFromIdionline !== 'undefined')
      wx.showToast({
        title: this.data.translations.editToastTitleError + msg,
        icon: 'none',
        mask: true,
      });
    else
      wx.showToast({
        title: this.data.translations.editToastTitleError + code,
        icon: 'none',
        mask: true,
      });
    setTimeout(function () {
      if (
        getCurrentPages()[getCurrentPages().length - 1].route.split('/')[2] ===
        'edit'
      )
        wx.switchTab({
          url: '/pages/index/index',
        });
    }, 1500);
  },
  onReachBottom() {
    wx.vibrateShort();
  },
  onClear() {
    wx.vibrateShort();
  },
  onConfirm(e) {
    wx.vibrateShort();
    console.log(e.target.id);
    if (e.target.id === 'idiomName')
      this.setData({
        focus: {
          idiomIndex: true,
          idiomPinyin: false,
          idiomOrigin: false,
          source: -1,
          definitionText: -1,
        },
      });
    if (e.target.id === 'idiomIndex')
      this.setData({
        focus: {
          idiomIndex: false,
          idiomPinyin: true,
          idiomOrigin: false,
          source: -1,
          definitionText: -1,
        },
      });
    if (e.target.id === 'idiomPinyin')
      this.setData({
        focus: {
          idiomIndex: false,
          idiomPinyin: false,
          idiomOrigin: true,
          source: -1,
          definitionText: -1,
        },
      });
    if (e.target.id === 'idiomOrigin')
      this.setData({
        focus: {
          idiomIndex: true,
          idiomPinyin: false,
          idiomOrigin: false,
          source: 0,
          definitionText: -1,
        },
      });
    if (e.target.id.startsWith('source-'))
      this.setData({
        focus: {
          idiomIndex: false,
          idiomPinyin: false,
          idiomOrigin: false,
          source: -1,
          definitionText: parseInt(e.target.id.replace('source-', '')),
        },
      });
  },
  onAddToFavorites() {
    return {
      imageUrl: '/images/favorites-timeline.png',
    };
  },
});
