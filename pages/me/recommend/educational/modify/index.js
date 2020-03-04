let app = getApp()
Page({
  data: {
    id: '',
    beginfrom: '',
    endto: '',
    Education: 0,
    objectEducationArray: app.objectEducationArray,
    school: '',
    description: '',
    disabled: false
  },
  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      let that = this
      let flag = false
      if (option.flag == '1') flag = true
      wx.request({
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Mine/Educational.ashx',
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
          console.log(res)
          that.setData({
            hidden: true,
            beginfrom: res.data.BeginFrom,
            endto: res.data.EndTo,
            educationindex: res.data.Education,
            school: res.data.School,
            description: res.data.Description,
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

  EducationPickerChange: function(e) {
    this.setData({
      educationindex: e.detail.value
    })
  },

  // 保存数据
  formSubmit: function(e) {
    let that = this
    let formData = e.detail.value
    if (checknull(formData.School, '请填写学校名称')) return
    if (checknull(formData.BeginFrom, '请填写开始时间')) return
    if (checknull(formData.EndTo, '请填写结束时间')) return
    if (checknull(formData.Description, '请填写主修课程')) return
    if (that.data.educationindex == 0) {
      wx.showToast({
        title: '请选择学历', //弹出窗口
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
    formData.Education = app.objectEducationArray[that.data.educationindex].id
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Educational.ashx',
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
        wx.redirectTo({
          url: '../index'
        })
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
