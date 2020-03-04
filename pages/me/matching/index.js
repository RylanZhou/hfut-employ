// main.js
// 获取应用实例
import { getImageCache } from '../../../utils/imageCache.js'

const app = getApp()
Page({
  data: {
    booking: 0,
    acount: 0,
    pageindex: 1,
    pagecount: 1,
    key: '',
    isHideLoadMore: true,
    isHideLoading: true,
    closed: false,
    LoadMore: '正在加载更多',
    JobInfo: {
      jobid: [],
      code: [],
      jobname: [],
      company: [],
      jobaddtion: [],
      discipline: [],
      salary: [],
      LogoUrl: [],
      date: [],
      clickcount: []
    }
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      this.getJobData()
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  keyInput: function(e) {
    this.setData({
      key: e.detail.value
    })
  },

  search: function() {
    this.setData({
      pageindex: 1,
      closed: false
    })
    this.getJobData()
  },

  onPullDownRefresh: function(e) {
    this.setData({
      pageindex: 1,
      closed: false
    })
    this.getJobData()
  },

  onReachBottom: function(e) {
    if (!this.data.closed) {
      const pindex = this.data.pageindex
      this.setData({
        isHideLoadMore: false,
        isHideLoading: false,
        LoadMore: '正在加载更多',
        pageindex: pindex + 1
      })
      this.getJobData()
    }
  },

  getJobData: function() {
    const that = this
    app.loading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/JobList.ashx?rand=' +
        Math.random(),
      data: {
        action: 'matching',
        code: app.Graduate.code,
        year: app.Graduate.year,
        gid: app.Graduate.gid,
        pageindex: that.data.pageindex,
        key: that.data.key
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (res.data.result.data == undefined) return
        const data = res.data.result.data
        const booking = res.data.result.booking
        const acount = res.data.result.acount
        const pagecount = res.data.result.pagecount
        that.setData({
          booking: booking,
          acount: acount
        })

        if (booking == 0) {
          wx.showToast({
            title: '求职意向没有设置', // 弹出窗口
            icon: 'none',
            duration: 2000
          })
          wx.redirectTo({
            url: '../intention/index'
          })
          return
        }

        const len = data.length
        if (len == 0) {
          that.setData({
            acount: 0,
            isHideLoadMore: true,
            isHideLoading: true
          })
          wx.showToast({
            title: '暂无意向职位', // 弹出窗口
            icon: 'none',
            duration: 2000
          })
        } else {
          if (that.data.pageindex > pagecount) {
            that.setData({
              closed: true,
              isHideLoadMore: false,
              isHideLoading: true,
              LoadMore: '全部加载完毕'
            })
            return
          }
        }

        let JobInfoobj = {
          jobid: [],
          code: [],
          jobname: [],
          company: [],
          jobaddtion: [],
          salary: [],
          LogoUrl: [],
          discipline: [],
          clickcount: [],
          date: []
        }
        if (that.data.pageindex > 1) JobInfoobj = that.data.JobInfo

        for (let i = 0; i < len; i++) {
          JobInfoobj.code.push(data[i].code)
          JobInfoobj.jobid.push(data[i].jobid)
          JobInfoobj.jobname.push(data[i].jobname)
          JobInfoobj.company.push(data[i].company)
          JobInfoobj.jobaddtion.push(data[i].jobaddtion)
          JobInfoobj.salary.push(data[i].salary)
          const key = 'CompanylogoUrls_' + data[i].cid.toString()
          const path = wx.getStorageSync(key)
          if (path) JobInfoobj.LogoUrl.push(path)
          else {
            JobInfoobj.LogoUrl.push(data[i].LogoUrl)
            getImageCache(key, data[i].LogoUrl)
          }
          JobInfoobj.discipline.push(data[i].discipline)
          JobInfoobj.date.push(data[i].date)
          JobInfoobj.clickcount.push(data[i].clickcount)
        }

        that.setData({
          acount: len,
          JobInfo: JobInfoobj,
          isHideLoadMore: true
        })
      },
      fail: function(err) {
        app.applyfail()
      }
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
