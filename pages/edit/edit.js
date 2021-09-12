const call = require('../../tools/request.js');
const color = require('../../tools/color.js');
Page({
  data: {
    id: '',
    sessionId: '',
    name: '',
    indexOfIdiom: '',
    pinyin: '',
    origin: '',
    toBeCorrected: false,
    definitionUpdates: [],
    canBeRemoved: [],
    color: '',
  },
  onLoad(option) {
    let json = JSON.parse(option.str);
    //更新页面。
    this.data.sessionId = json.sessionId;
    this.setData({
      id: json.id,
      name: json.name,
      indexOfIdiom: json.indexOfIdiom,
      pinyin: json.pinyin,
      origin: json.origin,
      toBeCorrected: json.toBeCorrected,
      definitionUpdates: json.definitionUpdates, //,
    });
    for (let k in json.definitionUpdates) {
      this.data.canBeRemoved[k] = false;
    }
  },
  onShow() {
    color.apl();
  },
  onChangeSource(event) {
    this.data.definitionUpdates[event.currentTarget.id].source = event.detail;
  },
  onChangeText(event) {
    this.data.definitionUpdates[event.currentTarget.id].text = event.detail;
  },
  onChangeAddition(event) {
    this.data.definitionUpdates[event.currentTarget.id].addition = event.detail;
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
    tmp[event.currentTarget.id].isBold = !tmp[event.currentTarget.id].isBold;
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
      k++;
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
      sessionId: this.data.sessionId,
    };
    let str = JSON.stringify(json);
    wx.redirectTo({
      url: '/pages/edit_bson/edit_bson?str=' + str,
    });
  },
  onDeleteItem(event) {
    wx.vibrateShort();
    console.log(event.currentTarget.id);
    let tmp = this.data.definitionUpdates;
    let tmpRm = this.data.canBeRemoved;
    delete tmp[event.currentTarget.id];
    delete tmpRm[event.currentTarget.id];
    this.setData({
      definitionUpdates: tmp,
      canBeRemoved: tmpRm,
    });
    console.log(this.data.definitionUpdates);
  },
  onSubmit() {
    wx.vibrateShort();
    let reg = new RegExp(/^[A-Z]$/);
    let reg2 = new RegExp(/^[\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?$/);
    let pinyin = this.data.pinyin === '' ? null : this.data.pinyin;
    let origin = this.data.origin === '' ? null : this.data.origin;
    for (let k in this.data.definitionUpdates) {
      if (
        this.data.definitionUpdates[k].source === '' ||
        this.data.definitionUpdates[k].text === '' ||
        !reg2.test(this.data.name) ||
        !reg.test(this.data.indexOfIdiom)
      ) {
        wx.showToast({
          title: '数据格式不正确！',
          icon: 'none',
          mask: true,
        });
        wx.vibrateLong();
        return;
      }
    }
    let tmp = [];
    for (let k in this.data.definitionUpdates) {
      if (typeof this.data.definitionUpdates[k] !== 'undefined') {
        let tmp2 = this.data.definitionUpdates[k];
        if (tmp2.addition === '') tmp2.addition = null;
        tmp.push(tmp2);
      }
    }
    let dt = {
      sessionId: this.data.sessionId,
      bsonStr: null,
      name: this.data.name,
      index: this.data.indexOfIdiom,
      pinyin: pinyin,
      origin: origin,
      toBeCorrected: this.data.toBeCorrected,
      definitionUpdates: tmp,
    };
    call.uniFunc('idiom/' + this.data.id, 'PUT', dt, this.done);
  },
  done(data) {
    wx.showToast({
      title: data,
      icon: 'none',
      mask: true,
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.data.refresh = true;
    if (this.data.id === getApp().globalData.launchInfo.dailyIdiom.id)
      getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (getCurrentPages()[getCurrentPages().length - 2] === prevPage)
        wx.navigateBack();
    }, 1500);
  },
  onDelete() {
    let that = this;
    wx.showModal({
      title: '警告',
      content: '您确定要删除这条成语吗？',
      confirmText: '删除',
      confirmColor: '#FF0000',
      success(res) {
        wx.vibrateShort();
        if (res.confirm) {
          call.uniFunc(
            'idiom/' + that.data.id,
            'DELETE',
            '"' + that.data.sessionId + '"',
            that.doneDelete
          );
        }
      },
    });
    wx.vibrateLong();
  },
  doneDelete(data) {
    wx.showToast({
      title: data,
      icon: 'none',
      mask: true,
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let currentPage = pages[pages.length - 1];
    prevPage.setData({
      deleted: true,
    });
    if (this.data.id === getApp().globalData.launchInfo.dailyIdiom.id)
      getApp().globalData.refreshOnIndex = true;
    setTimeout(function () {
      if (currentPage === getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/index/index',
        });
    }, 1500);
  },
});
