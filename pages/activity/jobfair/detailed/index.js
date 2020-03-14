const app = getApp()
Page({
  data: {
    code: '',
    rid: '',
    acount: 0,
    pageindex: 1,
    pagecount: 1,
    key: '',
    closed: false,
    Theme: '',
    dataMarket: [],
    Market: []
  },

  keyInput: function(e) {
    this.setData({
      key: e.detail
    })
  },

  search: function() {
    this.setData({
      pageindex: 1,
      closed: false
    })
    this.getJobData()
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      this.setData({
        rid: option.rid,
        code: option.code,
        Theme: option.theme
      })
      this.getJobData()
    }
  },

  getJobData: function() {
    var that = this
    app.toastLoading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/Recruitment.ashx?rand=' +
        Math.random(),
      data: {
        action: 'jobfairinfo',
        code: that.data.code,
        rid: that.data.rid,
        gid: app.Graduate.gid,
        pageindex: that.data.pageindex,
        key: that.data.key
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        const { Market } = res.data
        const dataMarket = Market.Companyid.map((each, index) => ({
          CompanyId: each,
          Company: Market.Company[index]
        }))
        that.setData({
          dataMarket,
          Market: dataMarket.slice(0, Math.min(20, dataMarket.length)),
          closed: true,
          isHideLoadMore: false,
          isHideLoading: true
        })
        app.toastClear()
      },
      fail: (error) => {
        console.log(error)
        app.toastFailed('加载失败')
      }
    })
  },

  handlePageScrollToLower() {
    const displayedLength = this.data.Market.length
    const totalLength = this.data.dataMarket.length
    if (displayedLength < totalLength) {
      const toBeLoaded = this.data.dataMarket.slice(
        displayedLength,
        Math.min(displayedLength + 20, totalLength)
      )
      this.setData({
        Market: [...this.data.Market, ...toBeLoaded]
      })
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  navToTab(event) {
    wx.switchTab({
      url: event.currentTarget.dataset.route
    })
  },

  // 页面跳转
  navToPage(event) {
    const route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  }
})
