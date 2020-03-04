const app = getApp()
Page({
  data: {
    Graduate: {
      disabled: true,
      TelphoneSelf: {
        ctrlclass: 'weui-input_readonly',
        text: '',
        disabled: true
      },
      Email: {
        ctrlclass: 'weui-input_readonly',
        text: '',
        disabled: true
      },
      IM: {
        ctrlclass: 'weui-input_readonly',
        text: '',
        disabled: true
      },
      HomeAddress: {
        ctrlclass: 'weui-input_readonly',
        text: '',
        disabled: true
      },
      HomePost: {
        ctrlclass: 'weui-input_readonly',
        text: '',
        disabled: true
      },
      Homephone: {
        ctrlclass: 'weui-input_readonly',
        text: '',
        disabled: true
      }
    }
  },

  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/dispatch'
      app.wxlogin()
    } else {
      const that = this
      app.loading()
      wx.request({
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Dispatch/LinkInfo.ashx?rand=' +
          Math.random(),
        data: {
          action: 'info',
          code: app.Graduate.code,
          gid: app.Graduate.gid
        },
        header: { 'Content-Type': 'application/json' },
        success: function(res) {
          wx.stopPullDownRefresh()
          wx.hideLoading()
          that.setData({
            Graduate: res.data
          })
        },
        fail: function(err) {
          app.applyfail()
        }
      })
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  onPullDownRefresh: function(e) {
    this.onLoad()
  },

  // 保存数据
  formSubmit: function(e) {
    const that = this
    const formData = e.detail.value
    let nulltxt = ''

    if (
      that.data.Graduate.TelphoneSelf.required == true &&
      formData.TelphoneSelf == ''
    ) {
      nulltxt = '联系电话'
    } else if (
      that.data.Graduate.Email.required == true &&
      formData.Email == ''
    ) {
      nulltxt = '电子邮箱'
    } else if (that.data.Graduate.IM.required == true && formData.IM == '') {
      nulltxt = 'QQ号码'
    } else if (
      that.data.Graduate.Homephone.required == true &&
      formData.Homephone == ''
    ) {
      nulltxt = '家庭联系电话'
    } else if (
      that.data.Graduate.HomeAddress.required == true &&
      formData.HomeAddress == ''
    ) {
      nulltxt = '家庭详细地址'
    } else if (
      that.data.Graduate.HomePost.required == true &&
      formData.HomePost == ''
    ) {
      nulltxt = '邮政编码'
    }

    if (nulltxt != '') {
      wx.showToast({
        title: nulltxt + '不能为空', // 弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showLoading({
      title: '正在保存...'
    })
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Dispatch/LinkInfo.ashx?rand=' +
        Math.random(),
      data: {
        action: 'save',
        code: app.Graduate.code,
        gid: app.Graduate.gid,
        year: app.Graduate.year,
        TelphoneSelf: formData.TelphoneSelf,
        Email: formData.Email,
        IM: formData.IM,
        HomeAddress: formData.HomeAddress,
        HomePost: formData.HomePost,
        Homephone: formData.Homephone
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        const r = res.data.r
        if (r == 0) {
          wx.showToast({
            title: res.data.m, // 弹出窗口
            icon: 'success',
            duration: 2000
          })
        } else if (r == 1) {
          wx.showToast({
            title: res.data.m, // 弹出窗口
            icon: 'none',
            duration: 5000
          })
        }
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  }
})
