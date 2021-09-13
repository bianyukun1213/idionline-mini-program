function get(args) {
  let url = args.url;
  let data = args.data;
  let doSuccess = args.doSuccess;
  let exHandler = args.exHandler;
  let type = args.type;
  let urlBase;
  console.log(
    '请求参数列表：\nurl：',
    url,
    '\ndata：',
    data,
    '\ndoSuccess：',
    doSuccess,
    '\nexHandler：',
    exHandler,
    '\ntype：',
    type
  );
  if (type === 'TTS') {
    urlBase =
      'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=BfYDfQxbqmKPazSVr1He4Lap&client_secret=z9PXBM0P1bUFDEYgfiSnSax5mHZEHD18';
  } else {
    if (getApp().globalData.dbgMode) {
      urlBase = 'http://bianyukun1213.tpddns.cn:12601/api/';
    } else {
      urlBase = 'https://idionline.hollisdevhub.com/api/';
    }
  }
  if (typeof url === 'undefined') {
    url = '';
  }
  wx.showLoading({
    title: '加载中……',
    mask: true,
  });
  console.log('发送请求：' + urlBase + url);
  wx.request({
    url: urlBase + url,
    data: data,
    success(res) {
      wx.hideLoading();
      if (res.statusCode === 200 && typeof doSuccess === 'function') {
        if (type === 'TTS') {
          console.log('查询到数据：', res.data);
          doSuccess(res.data);
        } else {
          if (res.data.code === 0) {
            console.log('查询到数据：', res.data);
            doSuccess(res.data.result);
          } else fail(res.statusCode, res.data.code, res.data.msg, exHandler);
        }
      } else if (res.statusCode === 404) {
        notFound('未查询到数据', undefined, undefined, exHandler);
      } else {
        fail(res.statusCode, res.data.code, res.data.msg, exHandler);
      }
    },
    fail(err) {
      wx.hideLoading();
      fail(err.errMsg, undefined, undefined, exHandler);
    },
  });
}

function downloadTTSAudio(tok, cuid, tex, doSuccess) {
  wx.showLoading({
    title: '加载中……',
    mask: true,
  });
  let url =
    'https://tsn.baidu.com/text2audio?tok=' +
    tok +
    '&cuid=' +
    cuid +
    '&lan=zh&ctp=1&tex=' +
    tex;
  console.log('请求百度语音合成数据：' + url);
  wx.downloadFile({
    url: url,
    success(res) {
      wx.hideLoading();
      if (res.statusCode === 200 && typeof doSuccess === 'function') {
        console.log('下载文件：' + res.tempFilePath);
        //这里不必校验文件格式，播放时会自动校验。
        doSuccess(res.tempFilePath);
      } else if (res.statusCode === 404) {
        notFound('未查询到数据', undefined, undefined, exHandler);
      } else {
        fail(res.statusCode);
      }
    },
    fail(err) {
      wx.hideLoading();
      fail(err.errMsg);
    },
  });
}

function uniFunc(url, method, dt, doSuccess) {
  wx.showLoading({
    title: '加载中……',
    mask: true,
  });
  let urlNew;
  if (getApp().globalData.dbgMode) {
    urlNew = 'http://bianyukun1213.tpddns.cn:12601/api/' + url;
  } else {
    urlNew = 'https://idionline.hollisdevhub.com/api/' + url;
  }
  console.log('进行操作：' + method + ' ' + url);
  wx.request({
    url: urlNew,
    method: method,
    data: dt,
    success(res) {
      wx.hideLoading();
      if (
        res.statusCode === 200 &&
        res.data.code === 0 &&
        typeof doSuccess === 'function'
      ) {
        console.log('查询到数据：', res.data);
        doSuccess(res.data.result);
      } else if (res.statusCode === 404) {
        notFound();
      } else {
        fail(res.statusCode, res.data.code, res.data.msg);
      }
    },
    fail(err) {
      wx.hideLoading();
      fail(err.errMsg);
    },
  });
}

function fail(code, codeFromIdionline, msg, exHandler) {
  console.log('错误：' + code + ',' + codeFromIdionline + ',' + msg);
  if (typeof exHandler === 'function') {
    console.log('将执行 exHandler()');
    exHandler(code, codeFromIdionline, msg);
  } else {
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
  }
}

function notFound(code, codeFromIdionline, msg, exHandler) {
  console.log('未查询到数据');
  if (typeof exHandler === 'function') {
    console.log('将执行 exHandler()');
    exHandler(code, codeFromIdionline, msg);
  } else {
    wx.vibrateLong();
    wx.showToast({
      title: '很抱歉，未查询到数据！',
      icon: 'none',
      mask: true,
    });
  }
}
module.exports.get = get;
module.exports.downloadTTSAudio = downloadTTSAudio;
module.exports.uniFunc = uniFunc;
