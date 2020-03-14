const app = getApp()
Page({
  data: {
    id: '',
    getdate: '',
    caption: '',
    desc: '',
    disabled: false
  },
  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      const that = this
      let flag = false
      if (option.flag == '1') flag = true
      wx.request({
        url:
          app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Winning.ashx',
        data: {
          action: 'info',
          code: app.Graduate.code,
          gid: app.Graduate.gid,
          id: option.id
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          that.setData({
            hidden: true,
            getdate: res.data.GetDate,
            caption: res.data.Caption,
            desc: res.data.Description,
            id: option.id,
            disabled: flag
          })
        },
        fail: function() {},
        complete: function() {
          //
        }
      })
    }
  },

  bindDateChange1: function(e) {
    this.setData({
      getdate: e.detail.value
    })
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  // 保存数据
  formSubmit: function(e) {
    const that = this

    const formData = e.detail.value
    if (checknull(formData.Caption, '请填写奖惩情况')) return
    if (checknull(formData.GetDate, '请选择奖惩时间')) return

    wx.showLoading({
      title: '',
      mask: false
    })
    formData.action = 'modify'
    formData.id = that.data.id
    formData.code = app.Graduate.code
    formData.gid = app.Graduate.gid
    wx.request({
      url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Winning.ashx',
      data: formData,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功', // 弹出窗口
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: '../index'
        })
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败', // 弹出窗口
          icon: 'none',
          duration: 2000
        })
      },
      complete: function() {}
    })
  }
})

function checknull(data, tip) {
  if (data == '') {
    wx.showToast({
      title: tip, // 弹出窗口
      icon: 'none',
      duration: 2000
    })
    return true
  } else return false
}
