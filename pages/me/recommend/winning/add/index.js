let app = getApp()
Page({
  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    }
  },
  data: {
    addnext: false,
    getdate: '',
    caption: '',
    desc: ''
  },

  bindDateChange1: function(e) {
    this.setData({
      getdate: e.detail.value
    })
  },

  addNext: function() {
    this.setData({
      addnext: true
    })
  },

  addExit: function() {
    this.setData({
      addnext: false
    })
  },

  // 保存数据
  formSubmit: function(e) {
    let that = this

    let formData = e.detail.value
    if (checknull(formData.Caption, '请填写奖惩情况')) return
    if (checknull(formData.GetDate, '请选择奖惩情况')) return

    wx.showLoading({
      title: '',
      mask: false
    })
    formData.action = 'add'
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
        wx.showToast({
          title: '保存成功', //弹出窗口
          icon: 'success',
          duration: 2000
        })
        if (that.data.addnext) {
          //清空并添加下一条
          that.setData({
            getdate: '',
            caption: '',
            desc: ''
          })
        } else {
          //返回上级页面
          wx.redirectTo({
            url: '../index'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '保存失败', //弹出窗口
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
      title: tip, //弹出窗口
      icon: 'none',
      duration: 2000
    })
    return true
  } else return false
}
