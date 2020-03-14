const app = getApp()
Page({
  data: {
    Kindindex: 0,
    objectKindArray: [
      {
        id: 0,
        name: ''
      },
      {
        id: 1,
        name: '社团活动'
      },
      {
        id: 2,
        name: '兼职实习'
      },
      {
        id: 3,
        name: '任职经历'
      }
    ],
    id: '',
    beginfrom: '',
    endto: '',
    caption: '',
    desc: '',
    disabled: false
  },

  KindPickerChange: function(e) {
    this.setData({
      Kindindex: e.detail.value
    })
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
        url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Social.ashx',
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
            Kindindex: res.data.Kind,
            beginfrom: res.data.BeginFrom,
            endto: res.data.EndTo,
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
      beginfrom: e.detail.value
    })
  },
  bindDateChange2: function(e) {
    this.setData({
      endto: e.detail.value
    })
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  // 保存数据
  formSubmit: function(e) {
    const that = this

    const formData = e.detail.value
    if (that.data.Kindindex == 0) {
      wx.showToast({
        title: '请选择证书类别', // 弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (checknull(formData.Caption, '请填写活动名称')) return
    if (checknull(formData.BeginFrom, '请选择开始时间')) return
    if (checknull(formData.EndTo, '请选择结束时间')) return

    if (formData.BeginFrom > formData.EndTo) {
      wx.showToast({
        title: '开始时间不能大于结束时间', // 弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showLoading({
      title: '',
      mask: false
    })
    formData.action = 'modify'
    formData.id = that.data.id
    formData.code = app.Graduate.code
    formData.gid = app.Graduate.gid

    wx.request({
      url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Social.ashx',
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
          url: '../index?kind=' + that.data.kind
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
