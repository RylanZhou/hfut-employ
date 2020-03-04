const app = getApp()
Page({
  data: {
    Graduate: {
      Heathly: '',
      Degree: '',
      OrginPlace: '',
      IT: '',
      Language: '',
      Hobby: '',
      Ability: '',
      Introduction: ''
    }
  },
  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      const that = this

      wx.showLoading()
      // 发起一个网络请求
      wx.request({
        url:
          app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Aboutme.ashx',
        data: {
          action: 'info',
          code: app.Graduate.code,
          gid: app.Graduate.gid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 'application/json'
        },
        success: function(res) {
          that.setData({
            Graduate: res.data
          })
          wx.hideLoading()
        },
        fail: function() {
          wx.hideLoading()
        },
        complete: function() {
          //
        }
      })
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  // 保存数据
  formSubmit: function(e) {
    const that = this

    const formData = e.detail.value
    if (checknull(formData.Heathly, '请填写健康状况')) return

    formData.action = 'modify'
    formData.code = app.Graduate.code
    formData.gid = app.Graduate.gid
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Mine/Aboutme.ashx?rand=' +
        Math.random(),
      data: formData,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.showToast({
          title: '保存成功', // 弹出窗口
          icon: 'success',
          duration: 2000
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
  },

  backToPage: function(e) {
    wx.navigateBack()
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
