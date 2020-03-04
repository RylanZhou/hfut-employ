// main.js
// 获取应用实例
import { getImageCache } from '../../../utils/imageCache.js'
const app = getApp()
Page({
  data: {
    startX: 0, // 开始坐标
    startY: 0,
    acount: 0,
    JobInfo: {
      jobid: [],
      code: [],
      jobname: [],
      company: [],
      jobaddtion: [],
      salary: [],
      LogoUrl: [],
      date: [],
      isTouchMove: []
    }
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      this.getFavoritesData()
    }
  },

  getFavoritesData: function() {
    const that = this
    wx.showLoading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/JobList.ashx?rand=' +
        Math.random(),
      data: {
        action: 'favoriteslist',
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        const data = res.data.result.data
        const len = data.length
        if (len == 0) return

        const JobInfoobj = {
          jobid: [],
          code: [],
          jobname: [],
          company: [],
          jobaddtion: [],
          salary: [],
          LogoUrl: [],
          date: [],
          isTouchMove: []
        }

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
          JobInfoobj.date.push(data[i].date)
          JobInfoobj.isTouchMove.push(false)
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

  handleJumpBack() {
    wx.navigateBack()
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
  },

  // 手指触摸动作开始 记录起点X坐标

  touchstart: function(e) {
    const that = this
    // 开始触摸时 重置所有删除
    const isTouchMove = that.data.JobInfo.isTouchMove
    isTouchMove.forEach(function(v, i) {
      if (isTouchMove[i]) {
        // 只操作为true的
        isTouchMove[i] = false
      }
    })

    const JobInfotmp = that.data.JobInfo
    JobInfotmp.isTouchMove = isTouchMove
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      JobInfo: JobInfotmp
    })
  },

  // 滑动事件处理

  touchmove: function(e) {
    const that = this
    const index = e.currentTarget.dataset.index // 当前索引
    const startX = that.data.startX // 开始X坐标
    const startY = that.data.startY // 开始Y坐标
    const touchMoveX = e.changedTouches[0].clientX // 滑动变化坐标
    const touchMoveY = e.changedTouches[0].clientY // 滑动变化坐标
    // 获取滑动角度

    const angle = that.angle(
      {
        X: startX,
        Y: startY
      },
      {
        X: touchMoveX,
        Y: touchMoveY
      }
    )

    const isTouchMove = that.data.JobInfo.isTouchMove

    isTouchMove.forEach(function(v, i) {
      isTouchMove[i] = false

      // 滑动超过30度角 return

      if (Math.abs(angle) > 30) return

      if (i == index) {
        if (touchMoveX > startX) isTouchMove[i] = false
        // 右滑
        else isTouchMove[i] = true // 左滑
      }
    })

    // 更新数据

    const JobInfotmp = that.data.JobInfo
    JobInfotmp.isTouchMove = isTouchMove
    that.setData({
      JobInfo: JobInfotmp
    })
  },

  angle: function(start, end) {
    const _X = end.X - start.X
    const _Y = end.Y - start.Y
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
  },

  // 删除事件

  del: function(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Activity/JobList.ashx',
      data: {
        action: 'favoritesdel',
        code: app.Graduate.code,
        gid: app.Graduate.gid,
        jid: e.currentTarget.dataset.jid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        const tmp = that.data.JobInfo
        tmp.jobid.splice(index, 1)
        tmp.code.splice(index, 1)
        tmp.jobname.splice(index, 1)
        tmp.company.splice(index, 1)
        tmp.jobaddtion.splice(index, 1)
        tmp.salary.splice(index, 1)
        tmp.LogoUrl.splice(index, 1)
        tmp.date.splice(index, 1)
        tmp.isTouchMove.splice(index, 1)
        that.setData({
          JobInfo: tmp
        })
        wx.showToast({
          icon: 'none',
          title: '删除成功'
        })
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  }
})