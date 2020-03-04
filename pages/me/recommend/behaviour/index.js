const app = getApp()
Page({
  data: {
    Behaviour: ''
  },
  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      const that = this

      // 发起一个网络请求
      wx.request({
        url: app.api.baseUrl + 'Graduate/Mine/Aboutme.ashx',
        data: {
          action: 'info',
          code: app.Graduate.code,
          gid: app.Graduate.gid
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          that.setData({
            Behaviour: res.data
          })
        },
        fail: function() {
          //
        },
        complete: function() {
          //
        }
      })
    }
  },
  handleJumpBack() {
    wx.navigateBack()
  }
})
