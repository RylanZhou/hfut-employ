// main.js
// 获取应用实例
import { getImageCache } from '../../../utils/imageCache.js'

const app = getApp()
Page({
  data: {
    jobstate: '',
    JobInfo: {
      id: [],
      cid: [],
      jobid: [],
      code: [],
      jobname: [],
      company: [],
      signstate: [],
      disabled: [],
      applystate: [],
      LogoUrl: [],
      date: []
    }
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  onShow: function() {
    this.getNoticeData()
  },

  onPullDownRefresh: function(e) {
    this.getNoticeData()
  },

  getNoticeData: function() {
    const that = this
    wx.showLoading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Mine/Notice.ashx?rand=' +
        Math.random(),
      data: {
        action: 'noticelist',
        year: app.Graduate.year,
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      method: 'get',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        const data = res.data.result.data
        const len = data.length

        that.setData({
          jobstate: res.data.result.jobstate
        })
        if (len == 0) return

        const JobInfoobj = {
          id: [],
          cid: [],
          jobid: [],
          code: [],
          jobname: [],
          company: [],
          signstate: [],
          disabled: [],
          applystate: [],
          jobstate: [],
          LogoUrl: [],
          date: []
        }

        for (let i = 0; i < len; i++) {
          JobInfoobj.id.push(data[i].id)
          JobInfoobj.cid.push(data[i].cid)
          JobInfoobj.code.push(data[i].code)
          JobInfoobj.jobid.push(data[i].jobid)
          JobInfoobj.jobname.push(data[i].jobname)
          JobInfoobj.company.push(data[i].company)
          JobInfoobj.signstate.push(data[i].signstate)
          JobInfoobj.disabled.push(data[i].disabled)
          JobInfoobj.applystate.push(data[i].applystate)
          JobInfoobj.jobstate.push(data[i].jobstate)
          const key = 'CompanylogoUrls_' + data[i].cid.toString()
          const path = wx.getStorageSync(key)
          if (path) JobInfoobj.LogoUrl.push(path)
          else {
            JobInfoobj.LogoUrl.push(data[i].LogoUrl)
            getImageCache(key, data[i].LogoUrl)
          }
          JobInfoobj.date.push(data[i].date)
        }

        that.setData({
          acount: len,
          JobInfo: JobInfoobj
        })
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  },

  // 页面跳转
  navToPage(event) {
    wx.showToast({
      jobname: '加载中',
      icon: 'loading',
      duration: 10000
    })
    const route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  }
})
