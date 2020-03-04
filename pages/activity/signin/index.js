//main.js
//获取应用实例
let app = getApp()
Page({
  data: {
    Weekly: {
      Order: [],
      action: [],
      bindtap: [],
      Class: [],
      Begin: [],
      End: [],
      Sign: []
    }
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      let that = this
      app.loading()
      wx.request({
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Activity/SignIn.ashx?rand=' +
          Math.random(),
        data: {
          action: 'list',
          code: app.Graduate.code,
          gid: app.Graduate.gid
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          wx.stopPullDownRefresh()
          that.setData({
            Weekly: res.data.Weekly
          })
          wx.hideLoading()
        },
        fail: function(err) {
          app.applyfail()
        }
      })
    }
  },

  onPullDownRefresh: function(e) {
    this.onLoad()
  },

  //页面跳转
  navToPage(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  },

  ClosedPage: function() {
    wx.showToast({
      icon: 'none',
      title: '签到已过期',
      duration: 3000
    })
  }
})
