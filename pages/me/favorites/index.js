// main.js
// 获取应用实例
import { getImageCache } from '../../../utils/imageCache.js'
const app = getApp()
Page({
  data: {
    startX: 0, // 开始坐标
    startY: 0,
    acount: 0,
    JobInfo: []
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
    app.toastLoading()
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
      success(res) {
        const { data } = res.data.result
        const len = data.length
        if (len) {
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
        app.toastClear()
      },
      fail(error) {
        console.log(error)
        app.applyfail()
      }
    })
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
  },

  // 手指触摸动作开始 记录起点X坐标

  touchstart(e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      JobInfo: this.data.JobInfo.map((each) => {
        if (each.isTouchMove) {
          each.isTouchMove = false
        }
        return each
      })
    })
  },

  // 滑动事件处理

  touchmove(e) {
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
    if (Math.abs(angle) > 30) {
      return
    }

    const JobInfo = [...this.data.JobInfo]
    JobInfo[index].isTouchMove = touchMoveX <= startX

    // 更新数据
    that.setData({
      JobInfo
    })
  },

  angle: function(start, end) {
    const _X = end.X - start.X
    const _Y = end.Y - start.Y
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
  },

  // 删除事件

  del(e) {
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
      success() {
        const JobInfo = [...that.data.JobInfo]
        JobInfo.splice(index, 1)
        that.setData({
          JobInfo
        })
        app.toastSuccess('删除成功')
      },
      fail(error) {
        console.log(error)
        app.toastFailed('删除失败')
      }
    })
  }
})
