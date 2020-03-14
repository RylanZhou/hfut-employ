const app = getApp()
Page({
  data: {
    Kindindex: 0,
    objectKindArray: [
      { id: 0, name: '' },
      { id: 1, name: '社团活动' },
      { id: 2, name: '兼职实习' },
      { id: 3, name: '任职经历' }
    ],
    addnext: false,
    beginfrom: '',
    caption: '',
    endto: '',
    desc: ''
  },
  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    }
  },

  KindPickerChange: function(e) {
    this.setData({
      Kindindex: e.detail.value
    })
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

  handleJumpBack() {
    wx.navigateBack()
  },

  // 保存数据
  formSubmit: function(e) {
    const that = this

    const formData = e.detail.value
    if (that.data.Kindindex == 0) {
      wx.showToast({
        title: '请选择在校经历', // 弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (checknull(formData.Caption, '请填写经历名称')) return
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
    formData.action = 'add'
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
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '保存成功', // 弹出窗口
          icon: 'none',
          duration: 2000
        })
        if (that.data.addnext) {
          // 清空并添加下一条
          that.setData({
            beginfrom: '',
            caption: '',
            endto: '',
            desc: '',
            Kindindex: 0
          })
        } else {
          // 返回上级页面
          wx.redirectTo({
            url: '../index?kind=' + that.data.kind
          })
        }
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
