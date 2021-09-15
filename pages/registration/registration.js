const call = require('../../tools/request.js');
const color = require('../../tools/color.js');
const md5 = require('../../tools/md5.js');
Page({
  data: {
    username: '',
    password: '',
    show: false,
    color: '',
  },
  onLoad() {},
  onShow() {
    color.apl();
  },
  onRegister() {
    wx.vibrateShort();
    let reg1 = new RegExp(/^[0-9A-Za-z]{2,16}$/);
    let reg2 = new RegExp(
      /^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/
    );
    if (!reg1.test(this.data.username) || !reg2.test(this.data.password)) {
      wx.vibrateLong();
      wx.showToast({
        title: '用户名或密码格式不正确！',
        icon: 'none',
        mask: true,
      });
      return;
    }
    let that = this;
    call.uniFunc(
      'editor/register',
      'POST',
      {
        username: that.data.username,
        password: md5(that.data.password),
      },
      that.callback
    );
  },
  onChange(event) {
    if (event.target.id === 'field-username') this.data.username = event.detail;
    else this.data.password = event.detail;
    if (
      this.data.username === '' ||
      this.data.password === ''
    ) {
      this.setData({
        show: false,
      });
    } else {
      this.setData({
        show: true,
      });
    }
  },
  callback(data) {
    wx.showToast({
      title: '注册成功！',
      mask: true,
    });
    console.log('注册成功：' + data);
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    setTimeout(function () {
      if (currentPage === getCurrentPages()[getCurrentPages().length - 1])
        wx.switchTab({
          url: '/pages/index/index',
        });
    }, 1500);
  },
});
