const app = getApp()
Page({
  data: {
    Collegeindex: 0,
    openid: null,
    allow: false,
    objectCollegeArray: app.objectCollegeArray,

    loginForm: {
      name: '',
      studentNo: '',
      idNo: '',
      confirmed: false
    },

    protocolVisible: false
  },

  onLoad: function(option) {
    this.setData({
      openid: option.openid
    })
  },

  handleInputChange(e) {
    const key = `loginForm.${e.target.id}`
    this.setData({
      [key]: e.detail.value
    })
  },

  onConfirm() {
    this.setData({
      'loginForm.confirmed': !this.data.loginForm.confirmed
    })
  },

  showProtocol() {
    console.log('here')
    this.setData({
      protocolVisible: true
    })
  },

  closeProtocol() {
    this.setData({
      protocolVisible: false
    })
  },

  // 保存数据
  formSubmit() {
    const { name, studentNo, idNo, confirmed } = this.data.loginForm
    if (!name || !studentNo || !idNo) {
      app.toastFailed('请补全表单')
      return
    }
    if (!confirmed) {
      app.toastFailed('请阅读并确认用户协议')
      return
    }
    app.toastLoading()
    wx.request({
      url: app.api.loginUrl + 'UserInfo10359.ashx?rand=' + Math.random(),
      data: {
        action: 'binduser',
        openid: this.data.openid,
        name: name,
        studentnum: studentNo,
        idcode: idNo,
        code: 10359,
        college: '合肥工业大学'
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.count === 1) {
          // 用户绑定成功
          if (res.data.r === 1) {
            app.Graduate.openid = this.data.openid
            app.Graduate.year = res.data.year
            app.Graduate.code = res.data.code
            app.Graduate.college = res.data.college
            app.Graduate.gid = res.data.gid
            app.Graduate.education = res.data.education
            app.Graduate.discipline = res.data.discipline
            app.Graduate.disciplineName = res.data.disciplineName
            app.Graduate.name = res.data.name
            app.Graduate.photo = res.data.photo
            app.Graduate.market = res.data.market
            app.Graduate.jobinfo = res.data.jobinfo
            app.Graduate.market = res.data.market
            app.Graduate.opened = res.data.opened
            app.Graduate.automatic = res.data.automatic
            wx.setStorageSync('Graduate', app.Graduate)
            wx.reLaunch({
              // 重新回到首页
              url: '/pages/jobinfo/index'
            })
          } else if (res.data.r === 2) {
            //  多个用户，学号重复
            wx.showModal({
              title: '提示',
              content: '学号已经绑定其他微信号，请联系管理员老师'
            })
          }
        } else if (res.data.count === 0) {
          // 不存在
          // 当前用户没有注册，跳转到绑定页面
          wx.showModal({
            title: '提示',
            content: '信息不匹配或没有注册，请联系管理员老师'
          })
        } else if (res.data.count > 1) {
          // 不存在
          // 当前用户没有注册，跳转到绑定页面
          wx.showModal({
            title: '提示',
            content: '信息重复，请联系管理员老师'
          })
        }
      },
      fail(error) {
        console.log(error)
        app.toastFailed()
      }
    })
  }
})
