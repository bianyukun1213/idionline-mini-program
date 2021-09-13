const call = require('../../tools/request.js');
const format = require('../../tools/format.js');
const color = require('../../tools/color.js');
const info = require('../../tools/info.js');
Page({
  data: {
    color: '',
    text: '',
    scene: '',
    idiName: '',
    idiId: '',
    pinyin: '',
    defs: [],
    defTexts: [],
    launchInfo: {},
    placeHolder: '请输入您要查询的成语',
    value: '',
    historyValue: [],
    logoUrl: '../../pics/idionline.png',
    searchBarValue: '',
    showPopup: false,
    startY: 0,
    currentY: 0,
    onTouch: false,
    showDailyIdiom: false,
    idMode: false,
    indexMode: false,
    filePath: '',
    shareIdiom: '',
    singlePage: false,
    dark: false,
    actions: [
      {
        name: '转发',
        openType: 'share',
      },
      {
        name: '生成海报',
      },
    ],
  },
  //启动
  onLoad(para) {
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
    if (wx.getLaunchOptionsSync().scene === 1154)
      this.setData({
        singlePage: true,
      });
    this.data.scene = decodeURIComponent(para.scene);
    if (para.showDailyIdiom) this.data.showDailyIdiom = true;
    this.data.shareIdiom = para.shareIdiom;
    console.log('页面参数：', para);
    info.getLaunchInfo(this.callback);
  },
  onShow() {
    color.apl();
    if (wx.getSystemInfoSync().theme === 'dark')
      this.setData({
        dark: true,
      });
    else
      this.setData({
        dark: false,
      });
    if (getApp().globalData.refreshOnIndex === true) {
      info.getLaunchInfo(this.callback, true);
      getApp().globalData.refreshOnIndex = false;
    }
    let reg = new RegExp(/^[\u4e00-\u9fa5]{4}$/); //汉字。
    let regS = new RegExp(/(「|【)[\u4e00-\u9fa5]{4}(」|】)/); //小冰成语接龙。
    let regId = new RegExp(/^[0-9a-zA-Z]{24}/);
    let that = this;
    wx.getClipboardData({
      //向搜索框自动填充剪贴板数据。
      success(res) {
        if (
          (reg.test(res.data) || regId.test(res.data)) &&
          that.data.historyValue.indexOf(res.data) === -1
        ) {
          //填充历史里有的成语不再填充。
          that.setData({
            value: res.data,
          });
          that.data.historyValue.push(res.data);
          console.log('填充历史：', that.data.historyValue);
          wx.showToast({
            title: '已自动填充！',
            mask: true,
          });
          wx.vibrateShort();
        } else if (regS.test(res.data)) {
          wx.vibrateShort();
          call.get({
            url:
              'idiom/playsolitaire/' +
              regS
                .exec(res.data)[0]
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
          title: '错误：' + msg,
          icon: 'none',
          mask: true,
        });
      else
        wx.showToast({
          title: '错误：' + code,
          icon: 'none',
          mask: true,
        });
      return;
    }
    wx.showToast({
      title: '未找到可接龙成语！',
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
      placeHolder: '目前已收录 ' + launchInfo.idiomsCount + ' 条成语',
    });
    if (launchInfo.dailyIdiom !== null) {
      this.setData({ defTexts: [] });
      let textsTmp = [];
      launchInfo.dailyIdiom.definitions.forEach((element) => {
        textsTmp[launchInfo.dailyIdiom.definitions.indexOf(element)] = [];
        let textTmp = element.text;
        for (let k in element.links) {
          textTmp = textTmp.replace(
            element.links[k],
            ' {split}{link:' + k + '}{split} '
          );
        }
        let arrayTmp = textTmp.split('{split}');
        arrayTmp.forEach((el) => {
          if (el.startsWith('{link:')) {
            let id = el.replace('{link:', '').replace('}', '');
            textsTmp[launchInfo.dailyIdiom.definitions.indexOf(element)].push({
              text: element.links[id],
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
    color.apl();
    let reg = new RegExp(/https?:\/\/.+\.(jpg|gif|png|webp)/);
    //匹配Logo地址正则，设置Logo。
    if (reg.test(launchInfo.logoUrl))
      this.setData({
        logoUrl: launchInfo.logoUrl,
      });
    if (justRefresh !== true) {
      //显示对应的场景内容。
      for (let key in launchInfo.argsDic) {
        if (key === this.data.scene) {
          console.log(
            '查找到对应的场景内容：' + launchInfo.argsDic[this.data.scene]
          );
          wx.showModal({
            content: launchInfo.argsDic[this.data.scene],
            showCancel: false,
            success() {
              wx.vibrateShort();
            },
          });
          wx.vibrateShort();
        }
      }
      if (this.data.showDailyIdiom && this.data.idiId !== '') {
        this.setData({
          showPopup: true,
        });
        wx.vibrateShort();
        if (this.data.shareIdiom !== this.data.idiId)
          wx.showToast({
            title: '每日成语已更换！',
            icon: 'none',
            mask: true,
          });
      }
    }
  },
  //搜索事件。
  onSearch(e) {
    wx.vibrateShort();
    if (e.detail === 'debug') {
      wx.redirectTo({
        url: '/pages/debug/debug?fromSearch=true',
      });
      return;
    }
    this.data.idMode = false;
    this.data.indexMode = false;
    let reg = new RegExp(/^[\u4e00-\u9fa5]+(，[\u4e00-\u9fa5]+)?$/); //汉字。
    let reg2 = new RegExp(/^[0-9a-zA-Z]{24}/);
    let reg3 = new RegExp(/^[A-Za-z]$/);
    if (reg.test(e.detail) && e.detail.length > 1 && e.detail.length <= 12) {
      this.data.searchBarValue = e.detail; //这里由于不用在wxml中渲染，就不调用setdata了。
      call.get({
        url: 'idiom/search/' + e.detail,
        doSuccess: this.navi,
        exHandler: this.exHandler,
      });
    } else if (reg2.exec(e.detail)) {
      this.data.idMode = true;
      this.data.searchBarValue = e.detail; //同上。
      call.get({
        url: 'idiom/search/' + e.detail,
        doSuccess: this.navi,
        exHandler: this.exHandler,
      });
    } else if (reg3.exec(e.detail)) {
      this.data.idMode = true;
      this.data.searchBarValue = e.detail; //同上。
      call.get({
        url: 'idiom/search/' + e.detail,
        doSuccess: this.navi,
        exHandler: this.exHandler,
      });
    } else {
      wx.showToast({
        title: '格式错误！',
        icon: 'none',
        mask: true,
      });
      wx.vibrateLong();
    }
  },
  //成语未收录时：
  exHandler(code, codeFromIdionline, msg) {
    let dt = this.data.searchBarValue;
    console.log('查询无结果：' + dt);
    if (codeFromIdionline !== 20001) {
      wx.vibrateLong();
      if (typeof codeFromIdionline !== 'undefined')
        wx.showToast({
          title: '错误：' + msg,
          icon: 'none',
          mask: true,
        });
      else
        wx.showToast({
          title: '错误：' + code,
          icon: 'none',
          mask: true,
        });
      return;
    }
    if (this.data.idMode || this.data.indexMode) {
      wx.showToast({
        title: '查询无结果！',
        icon: 'none',
        mask: true,
      });
      wx.vibrateLong();
    }
    // else {
    //   wx.showModal({
    //     title: '查询无结果',
    //     content:
    //       '未找到您要查询的成语【' +
    //       dt +
    //       '】。服务器已尝试从其他数据源自动收录。您可以稍微等待，然后再次搜索。',
    //     showCancel: false,
    //     success() {
    //       wx.vibrateShort();
    //     },
    //   });
    //   wx.vibrateLong();
    // }
  },
  navi(data) {
    //获取key，其实就是第一个的key。
    let k;
    for (let key in data) {
      k = key;
    }
    if (
      Object.keys(data).length === 1 &&
      (data[k] === this.data.searchBarValue || this.data.idMode)
    ) {
      wx.navigateTo({
        url: '/pages/idiom/idiom?id=' + k,
      });
    } else {
      let linkType = 'navigateTo';
      for (let key in data) {
        if (data[key].indexOf(this.data.searchBarValue) !== -1) {
          linkType = 'redirectTo';
          break;
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
    wx.saveImageToPhotosAlbum({
      filePath: this.data.filePath,
      success() {
        wx.showToast({
          title: '已保存！',
          mask: true,
        });
      },
      fail() {
        wx.showToast({
          title: '保存失败！',
          icon: 'none',
          mask: true,
        });
        wx.vibrateLong();
      },
    });
  },
  onSelect(event) {
    wx.vibrateShort();
    if (event.detail.name === '转发') {
      this.onShareAppMessage();
    } else if (event.detail.name === '生成海报') {
      if (this.data.filePath === '') {
        wx.showLoading({
          title: '正在生成',
          mask: true,
        });
        let name =
          format.formatDate(getApp().globalData.launchInfo.dateUT, true) +
          '：【' +
          this.data.idiName +
          '】';
        if (this.data.defs.length > 1) name = name + '（部分）';
        this.setData({
          painting: {
            width: 1080,
            height: 1440,
            views: [
              {
                type: 'image',
                url: '/pics/sharing-pic.png',
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
    if (this.data.idiId !== '') {
      let date = format.formatDate(getApp().globalData.launchInfo.dateUT, true);
      return {
        title: date + '：【' + this.data.idiName + '】',
        imageUrl: '/pics/sharing.png',
        path:
          '/pages/index/index?showDailyIdiom=true&shareIdiom=' +
          this.data.idiId,
      };
    }
    return {
      imageUrl: '/pics/sharing.png',
    };
  },
  onShareTimeline() {
    if (this.data.idiId !== '') {
      let date = format.formatDate(getApp().globalData.launchInfo.dateUT, true);
      return {
        title: date + '：【' + this.data.idiName + '】',
        imageUrl: '/pics/sharing.png',
        query: 'showDailyIdiom=true&shareIdiom=' + this.data.idiId,
      };
    }
    return {
      imageUrl: '/pics/sharing.png',
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
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id,
    });
  },
});
