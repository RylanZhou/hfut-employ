// main.js
// 获取应用实例
var app = getApp()
Page({
  data: {
    kind: 1,
    acount: 0,
    pageindex: 1,
    pagecount: 1,
    key: '',
    isHideLoadMore: true,
    isHideLoading: true,
    closed: false,
    LoadMore: '正在加载更多',
    Market: {
      theme: [],
      code: [],
      rid: [],
      logoUrls: [],
      units: [],
      jobs: []
    }
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      this.getMarketData()
    }
  },

  keyInput(e) {
    this.setData({
      key: e.detail
    })
    if (!this.data.key) {
      this.getMarketData()
    }
  },

  search: function() {
    this.setData({
      pageindex: 1,
      closed: false
    })
    this.getMarketData()
  },

  getMarketData: function() {
    var that = this
    app.toastLoading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/Recruitment.ashx?rand=' +
        Math.random(),
      data: {
        action: 'jobfairlist',
        kind: that.data.kind,
        code: app.Graduate.code,
        gid: app.Graduate.gid,
        pageindex: that.data.pageindex,
        key: that.data.key
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        var data = res.data.result.data
        var pagecount = res.data.result.pagecount
        var len = data.length
        if (len == 0) {
          that.setData({
            acount: 0,
            isHideLoadMore: true,
            isHideLoading: true
          })
          app.toastFailed('暂无网络招聘会信息')
        } else {
          if (that.data.pageindex > pagecount) {
            that.setData({
              closed: true,
              isHideLoadMore: false,
              isHideLoading: true,
              LoadMore: '浏览安徽全省就业市场'
            })
            return
          }
        }

        that.setData({
          acount: len,
          Market: data,
          isHideLoadMore: true
        })
        app.toastClear()
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  },

  // 页面跳转
  navToPage(event) {
    app.toastLoading()
    const route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  }
})
