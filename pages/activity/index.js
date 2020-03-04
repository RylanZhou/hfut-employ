//获取应用实例
let app = getApp()
Page({
  data: {},
  //页面启动
  onLoad: function() {
    let that = this
    if (app.Graduate.gid == null || app.Graduate.code == null) {
      app.launchurl = '/pages/dispatch'
      app.wxlogin()
    }
  },

  //页面跳转
  navToPage(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  },

  ClosedPage: function() {
    app.ClosedPage()
  },

  tempclose(event) {
    wx.showToast({
      title: event.currentTarget.dataset.title + '暂时关闭', //弹出窗口
      icon: 'none',
      duration: 2000
    })
    return false
  },

  clickFormView(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  }
})
