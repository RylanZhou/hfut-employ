const app = getApp()
Page({
  data: {
    id: '',
    getdate: '',
    Skillkindindex: 0,
    objectSkillkindArray: [
      { id: 0, name: '' },
      { id: 1, name: '语言类' },
      { id: 2, name: '软件类' },
      { id: 3, name: '技能类' },
      { id: 4, name: '活动类' }
    ],
    caption: '',
    department: '',
    number: '',
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
        url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Skill.ashx',
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
            Skillkindindex: res.data.SkillKind,
            caption: res.data.Caption,
            department: res.data.Department,
            number: res.data.Number,
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

  SkillKindPickerChange: function(e) {
    this.setData({
      Skillkindindex: e.detail.value
    })
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
    if (checknull(formData.GetDate, '请选择获得时间')) return
    if (that.data.Skillkindindex == 0) {
      wx.showToast({
        title: '请选择证书类别', // 弹出窗口
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
      url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Skill.ashx',
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
