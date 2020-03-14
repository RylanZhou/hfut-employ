const app = getApp()
Page({
  data: {
    touch: { x: '', y: '' },
    cid: 0,
    Company: {
      cid: '',
      name: '',
      unitperpory: '',
      unitsize: '',
      industry: '',
      address: '',
      treatment: '',
      desc: '',
      favorites: '',
      joblist: [],
      jobidlist: [],
      salary: [],

      enableJump: 1
    }
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      const cid = option.cid
      this.setData({
        enableJump: option.jump
      })
      const that = this
      app.loading()
      wx.request({
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Activity/JobList.ashx?rand=' +
          Math.random(),
        data: {
          action: 'companyinfo',
          code: app.Graduate.code,
          gid: app.Graduate.gid,
          cid: cid
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          wx.hideLoading()
          that.setData({
            cid: option.cid,
            Company: res.data.Company
          })
        },
        fail: function(err) {
          app.applyfail()
        }
      })
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  // 页面跳转
  navToPage(event) {
    const route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  }
})
