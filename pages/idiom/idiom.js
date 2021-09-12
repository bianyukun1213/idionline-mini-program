const call = require('../../tools/request.js');
const format = require('../../tools/format.js');
const color = require('../../tools/color.js');
const info = require('../../tools/info.js');
let innerAudioContext;
Page({
  data: {
    refresh: false,
    deleted: false,
    platform: '',
    color: '',
    id: '',
    name: '',
    index: '',
    pinyin: '',
    py: '',
    origin: '',
    ori: '',
    tbc: '',
    defs: [],
    lastEditor: '',
    updateTime: '',
    toBeCorrected: false,
    tTSText: '', //对应释义的文本。
    tTSCurrent: '',
    tTSSrc: {},
    shareFlag: false,
    sessionId: '',
    painting: {},
    show: false,
    filePath: '',
    singlePage: false,
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
  onLoad(option) {
    if (wx.getLaunchOptionsSync().scene === 1154)
      this.setData({
        singlePage: true,
      });
    info.getLaunchInfo(this.callback);
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onError(function callback(errCode) {
      console.log('音频播放错误：', errCode);
      wx.showToast({
        title: '音频播放出错！',
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
    color.apl();
    if (this.data.deleted)
      wx.switchTab({
        url: '/pages/index/index',
      });
    if (this.data.refresh) {
      this.refresh();
      this.data.refresh = false;
    }
  },
  refresh() {
    this.data.sessionId = wx.getStorageSync('user').sessionId;
    call.get({
      url: 'idiom/' + this.data.id,
      data: {
        sessionId: this.data.sessionId,
      },
      doSuccess: this.fillData,
      exHandler: this.exHandler,
    });
    this.data.tTSText = '';
    this.data.tTSCurrent = '';
    this.data.tTSSrc = {};
    innerAudioContext.stop();
  },
  //获取启动信息的回调函数。
  callback() {
    this.setData({
      text: getApp().globalData.launchInfo.text,
    });
    color.apl();
  },
  fillData(data) {
    wx.setNavigationBarTitle({
      title: '【' + data.name + '】',
    });
    //赋一堆值。
    this.setData({
      id: data.id,
      name: data.name,
      defs: data.definitions,
      lastEditor: data.lastEditor,
      updateTime: format.formatDate(data.updateTimeUT, false),
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
    if (data.origin !== null)
      this.setData({
        origin: data.origin,
        ori:
          '出自《' +
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
        tbc: '，有待订正',
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
  //跳转按钮点击事件。
  onClick(e) {
    wx.vibrateShort();
    innerAudioContext.stop();
    wx.redirectTo({
      url: '/pages/idiom/idiom?id=' + e.currentTarget.id,
    });
  },
  onCollect() {
    wx.vibrateShort();
    let favorites = wx.getStorageSync('favorites') || {};
    favorites[this.data.id] = this.data.name;
    wx.setStorageSync('favorites', favorites);
    wx.showToast({
      title: '完成！',
      mask: true,
    });
    console.log('已添加成语至收藏：【' + this.data.name+'】');
  },
  onCorrect() {
    wx.vibrateShort();
    innerAudioContext.stop();
    let json = {
      id: this.data.id,
      name: this.data.name,
    };
    let str = JSON.stringify(json);
    wx.navigateTo({
      url: '/pages/correction/correction?str=' + str,
      fail: this.failToNavigate,
    });
  },
  onLongPress() {
    wx.vibrateShort();
    let that = this;
    innerAudioContext.stop();
    wx.setClipboardData({
      data: this.data.id,
      success() {
        console.log('已复制成语 Id 到剪贴板：' + that.data.id);
      },
    });
  },
  onSolitaire() {
    wx.vibrateShort();
    call.get({
      url: 'idiom/playsolitaire/' + this.data.name,
      doSuccess: this.doneSolitaire,
      exHandler: this.exHandlerS,
    });
  },
  doneSolitaire(data) {
    wx.showModal({
      title: '成语接龙（仅供参考）',
      content: '〖' + data + '〗',
      confirmText: '复制',
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
    if (
      typeof this.data.sessionId !== 'undefined' &&
      this.data.sessionId !== ''
    ) {
      innerAudioContext.stop();
      let json = {
        id: this.data.id,
        sessionId: this.data.sessionId,
        name: this.data.name,
        indexOfIdiom: this.data.index,
        pinyin: this.data.pinyin,
        origin: this.data.origin,
        toBeCorrected: this.data.toBeCorrected,
      };
      let definitionUpdates = [];
      for (let k in this.data.defs) {
        definitionUpdates.push({
          source: this.data.defs[k].source,
          text: this.data.defs[k].text,
          addition: this.data.defs[k].addition,
          isBold: this.data.defs[k].isBold,
        });
      }
      json.definitionUpdates = definitionUpdates;
      let str = JSON.stringify(json);
      wx.navigateTo({
        url: '/pages/edit/edit?str=' + str,
        fail: this.failToNavigate,
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
  },
  onClose() {
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
        let name = '【' + this.data.name + '】';
        if (this.data.defs.length > 1) name = name + '（部分）';
        this.setData({
          painting: {
            width: 1080,
            height: 1440,
            views: [
              {
                type: 'image',
                url: '/icons/sharing-pic.png',
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
    console.log('尝试转发【' + this.data.name + '】');
    if (this.data.shareFlag) {
      return {
        title: '点击查看【' + this.data.name + '】的释义',
        imageUrl: '/icons/sharing.png',
        path: '/pages/idiom/idiom?id=' + this.data.id,
      };
    }
    return {
      imageUrl: '/icons/sharing.png',
      path: '/pages/index/index',
    };
  },
  onShareTimeline() {
    return {
      title: '点击查看【' + this.data.name + '】的释义',
      imageUrl: '/icons/sharing.png',
    };
  },
  onTTSTap(e) {
    if (innerAudioContext.paused) {
      if (wx.getLaunchOptionsSync().scene === 1154) {
        wx.showToast({
          title: '更多功能需前往小程序使用！',
          icon: 'none',
          mask: true,
        });
        wx.vibrateLong();
        return;
      }
      wx.vibrateShort();
      this.data.tTSCurrent = e.currentTarget.id;
      console.log('变量中的音频地址：', this.data.tTSSrc);
      if (typeof this.data.tTSSrc[this.data.tTSCurrent] === 'undefined') {
        console.log('当前音频地址在变量中不存在');
        let tTSText = this.data.defs[this.data.tTSCurrent].text; //获取到对应的def。
        let substr = tTSText.match(/(\(.*?\)|（.*?）|\[.*?\]|{.*?})/g); //匹配“〈口〉”这种东西和各种括号中的内容，方头括号、六角括号除外。
        for (let idx in substr) {
          tTSText = tTSText.replace(substr[idx], '');
        }
        tTSText = tTSText.replace(/(~|～)/g, this.data.name); //将“~”替换为成语名称。
        this.data.tTSText = tTSText;
        let token = wx.getStorageSync('token');
        let tokenUT = token.split('.')[3]; //token里存的到期时间，虽然我不确定它的角标是不是永远是3。
        let currentUT = format.getUnixTimestamp();
        console.log('当前时间戳：' + currentUT);
        console.log('Token 时间戳：' + tokenUT);
        if (token === '' || currentUT > tokenUT - 10) {
          //如果token为''或时间超过token时间（预留了十秒左右），就重新获取token。
          call.get({
            doSuccess: this.tokenGotten,
            type: 'TTS',
          });
          console.log('重获取 Token');
        } else {
          call.downloadTTSAudio(
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
    call.downloadTTSAudio(
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
    let currentPage = getCurrentPages()[getCurrentPages().length - 1];
    setTimeout(function () {
      if (currentPage === getCurrentPages()[getCurrentPages().length - 1])
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
});
