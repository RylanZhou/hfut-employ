const app = getApp()
Page({
  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    }
  },
  data: {
    addnext: false,
    beginfrom: '',
    endto: '',
    Education: 0,
    objectEducationArray: app.objectEducationArray,
    school: '',
    description: ''
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

  EducationPickerChange: function(e) {
    this.setData({
      educationindex: e.detail.value
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
    if (checknull(formData.School, '请填写学校名称')) return
    if (checknull(formData.BeginFrom, '请填写开始时间')) return
    if (checknull(formData.EndTo, '请填写结束时间')) return
    if (checknull(formData.Description, '请填写主修课程')) return
    if (that.data.educationindex == 0) {
      wx.showToast({
        title: '请选择学历', // 弹出窗口
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
    formData.Education = app.objectEducationArray[that.data.educationindex].id

    console.log(app.objectEducationArray[that.data.educationindex])
    console.log(formData)
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/educational.ashx',
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
          icon: 'success',
          duration: 2000
        })
        if (that.data.addnext) {
          // 清空并添加下一条
          that.setData({
            education: '',
            beginfrom: '',
            endto: '',
            school: '',
            educationindex: 0,
            description: ''
          })
        } else {
          // 返回上级页面
          wx.redirectTo({
            url: '../index'
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
