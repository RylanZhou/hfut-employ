const app = getApp()
Page({
  data: {
    cid: 0,
    jid: 0,
    Kindindex: 0,
    objectKindArray: [
      { id: 0, name: '' },
      { id: 1, name: '收取各种费用' },
      { id: 2, name: '且电话面试，并去外地就职或培训' },
      { id: 3, name: '详细打听家庭情况' },
      { id: 4, name: '详细打听个人借贷情况' },
      { id: 5, name: '涉及校园借贷' },
      { id: 6, name: '仅参加培训，非实际工作' },
      { id: 7, name: '虚假职位，用于单位宣传' }
    ],
    desc: ''
  },
  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      this.setData({
        cid: option.cid,
        jid: option.jid
      })
    }
  },

  KindPickerChange: function(e) {
    this.setData({
      Kindindex: e.detail.value
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
        title: '请选择投诉或举报原因', // 弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (checknull(formData.Description, '请填写投诉或举报内容')) return

    wx.showLoading({
      title: '',
      mask: false
    })
    formData.action = 'complaint'
    formData.year = app.Graduate.year
    formData.code = app.Graduate.code
    formData.gid = app.Graduate.gid
    formData.cid = that.data.cid
    formData.jid = that.data.jid
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/JobList.ashx?rand=' +
        Math.random(),
      data: formData,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功,平台会尽快核实！', // 弹出窗口
          icon: 'none',
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
