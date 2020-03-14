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
      id: [],
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
      this.getApplyData()
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  getApplyData: function() {
    const that = this
    wx.showLoading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/JobList.ashx?rand=' +
        Math.random(),
      data: {
        action: 'applylist',
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        const data = res.data.result.data
        const len = data.length
        if (len !== 0) {
          that.setData({
            acount: len,
            JobInfo: data.map((each) => {
              const key = `CompanylogoUrls_${each.cid}`
              const path = wx.getStorageSync(key)
              if (path) {
                each.LogoUrl = path
              } else {
                getImageCache(key, each.LogoUrl)
              }
              each.isTouchMove = false
              return each
            })
          })
        }
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
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/JobList.ashx?rand=' +
        Math.random(),
      data: {
        action: 'jobapplydel',
        code: app.Graduate.code,
        id: e.currentTarget.dataset.id
      },
      method: 'get',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        const JobInfo = [...that.data.JobInfo]
        JobInfo.splice(index, 1)
        that.setData({
          JobInfo
        })
        app.toastSuccess('删除成功')
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  }
})
