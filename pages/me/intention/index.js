const app = getApp()
Page({
  data: {
    gid: '',
    UnitProperty: '',
    Industry: '',
    JobPost: '',
    JobCity: '',
    UnitPropertyStr: '',
    IndustryStr: '',
    JobPostStr: '',
    JobCityStr: '',
    WorkKindindex: -1,
    Salaryindex: -1,
    AcceptOtherindex: -1,
    objectSalaryArray: app.objectSalaryArray,
    objectWorkKindArray: [
      {
        id: 1,
        name: '全职'
      },
      {
        id: 2,
        name: '实习'
      }
    ],
    objectAcceptOtherArray: [
      {
        id: 1,
        name: '完全匹配'
      },
      {
        id: 2,
        name: '专业大类匹配'
      },
      {
        id: 3,
        name: '专业无要求'
      }
    ]
  },
  // 页面跳转
  navToPage(event) {
    const route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  },

  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    }
  },

  onShow: function() {
    console.log(app.api.baseUrl)
    console.log(app.Graduate.code)
    console.log(app.Graduate.gid)
    const that = this
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Intention.ashx',
      data: {
        action: 'info',
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          gid: app.Graduate.gid,
          WorkKindindex: res.data.WorkKind,
          AcceptOtherindex: res.data.AcceptOther,
          Salaryindex: res.data.Salary,
          UnitProperty: res.data.UnitProperty,
          Industry: res.data.Industry,
          JobPost: res.data.JobPost,
          JobCity: res.data.JobCity,
          UnitPropertyStr: res.data.UnitPropertyStr,
          IndustryStr: res.data.IndustryStr,
          JobPostStr: res.data.JobPostStr,
          JobCityStr: res.data.JobCityStr,
          id: res.data.ID
        })
      },
      fail: function() {},
      complete: function() {}
    })
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  WorkKindPickerChange: function(e) {
    this.setData({
      WorkKindindex: e.detail.value
    })
  },
  AcceptOtherPickerChange: function(e) {
    this.setData({
      AcceptOtherindex: e.detail.value
    })
  },
  SalaryPickerChange: function(e) {
    this.setData({
      Salaryindex: e.detail.value
    })
  },

  // 保存数据
  formSubmit: function(e) {
    const that = this
    const formData = e.detail.value
    const formId = e.detail.formId
    formData.action = 'modify'
    formData.code = app.Graduate.code
    formData.gid = app.Graduate.gid
    formData.WorkKind = that.data.objectWorkKindArray[formData.WorkKind].id
    formData.Salary = app.objectSalaryArray[formData.Salary].id
    formData.AcceptOther =
      that.data.objectAcceptOtherArray[formData.AcceptOther].id

    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Intention.ashx',
      data: formData,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.formIdSubmit(formId)
        wx.showToast({
          title: res.data.m, // 弹出窗口
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  },

  formIdSubmit: function(formId) {
    const formdata = {
      action: 'matchingnotice',
      code: app.Graduate.code,
      gid: app.Graduate.gid,
      openid: app.Graduate.openid,
      formId: formId
    }
    if (
      app.Graduate.market &&
      app.Graduate.jobinfo &&
      formId &&
      formId !== 'the formId is a mock one'
    ) {
      wx.request({
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Activity/JobList.ashx?rand=' +
          Math.random(),
        data: formdata,
        success: function(res) {}
      })
    }
  }
})
