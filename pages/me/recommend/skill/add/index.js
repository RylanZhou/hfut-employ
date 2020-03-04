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
    number: ''
  },

  bindDateChange1: function(e) {
    this.setData({
      getdate: e.detail.value
    })
  },

  SkillKindPickerChange: function(e) {
    this.setData({
      Skillkindindex: e.detail.value
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
    if (checknull(formData.GetDate, '请填写获得时间')) return
    if (that.data.Skillkindindex == 0) {
      wx.showToast({
        title: '请选择证书类别', //弹出窗口
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
    formData.SkillKind = that.data.Skillkindindex
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
          title: '保存成功', //弹出窗口
          icon: 'success',
          duration: 2000
        })
        if (that.data.addnext) {
          //清空并添加下一条
          that.setData({
            skillkind: '',
            getdate: '',
            caption: '',
            department: '',
            number: '',
            Skillkindindex: 0
          })
        } else {
          //返回上级页面
          wx.redirectTo({
            url: '../index'
          })
        }
      },
      fail: function() {
        wx.hideLoading()
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
