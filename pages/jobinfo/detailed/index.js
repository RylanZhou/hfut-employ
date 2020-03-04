// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from '../../miniprogram_npm/regenerator-runtime/index'
import { getJobDetailById, applyJob, setFavorite } from '../../../apis/jobList'

const app = getApp()

Page({
  data: {
    touch: { x: '', y: '' },
    jobid: '',
    cid: '',
    info: {}
  },

  onLoad(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      wx.showShareMenu()
      this.setData({
        jobid: option.jobid,
        cid: option.cid
      })
      this.jobinfo()
    }
  },

  async jobinfo() {
    app.toastLoading()
    try {
      const data = await getJobDetailById(this.data.jobid, app.Graduate)
      this.setData({
        info: { ...data }
      })
      app.toastClear()
    } catch (error) {
      console.log(error)
      app.toastFailed('获取信息失败')
    }
  },

  async handleFavorite() {
    try {
      app.toastLoading()
      await setFavorite(app.Graduate, this.data)
      this.setData({
        'info.favorites': !this.data.info.favorites
      })
      app.toastClear()
    } catch (error) {
      app.toastFailed('设置失败')
      console.log(error)
    }
  },

  jumpToCompanyPage() {
    wx.navigateTo({
      url: `../company/index?cid=${this.data.cid}&jid=${this.data.jobid}`
    })
  },

  jumpToReportPage() {
    wx.navigateTo({
      url: `../complaint/index?cid=${this.data.cid}&jid=${this.data.jobid}`
    })
  },

  handleTouchStart(e) {
    const { changedTouches: touch } = e
    this.setData({
      'touch.x': touch[0].clientX,
      'touch.y': touch[0].clientY
    })
  },

  handleTouchEnd(e) {
    const THRESHOLD = 50
    const { changedTouches: touch } = e
    const endX = touch[0].clientX
    const endY = touch[0].clientY
    const { x: startX, y: startY } = this.data.touch
    if (endX - startX > THRESHOLD && Math.abs(endY - startY) < THRESHOLD) {
      this.handleJumpBack()
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  async handleApplication() {
    try {
      const result = await this.confirmApplication()
      if (!result.confirm) return
      app.toastLoading()
      await applyJob(app.Graduate, this.data)
      this.setData({
        'info.apply': true
      })

      // TODO:
      // x08ypqtNotp7NjM5rO7GkgHjyGbFcf2b9L7RDmWA2CI
      // 面试通知 远程面试通知 签约通知
      // if (this.data.tmplIds) {
      //   wx.requestSubscribeMessage({
      //     tmplIds: [this.data.tmplIds]
      //   })
      // }
      app.toastClear()
    } catch (error) {
      console.log(error)
      app.toastFailed('申请失败')
    }
    // const that = this
    // wx.showModal({
    //   title: '提示',
    //   content: '确定要申请这个岗位吗',
    //   confirmColor: 'red',
    //   success: function(res) {
    //     if (res.confirm) {
    //       app.loading()
    //       wx.request({
    //         url:
    //           app.api.baseUrl +
    //           app.Graduate.code +
    //           '/Graduate/Activity/JobList.ashx',
    //         data: {
    //           action: 'jobapply',
    //           year: app.Graduate.year,
    //           code: app.Graduate.code,
    //           gid: app.Graduate.gid,
    //           college: app.Graduate.college,
    //           jid: that.data.JOB.jobid,
    //           cid: that.data.JOB.cid,
    //           openid: app.Graduate.openid
    //         },
    //         method: 'get',
    //         header: {
    //           'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //           console.log(res)
    //           wx.hideLoading()
    //           const objjob = that.data.JOB
    //           objjob.apply = true
    //           that.setData({
    //             JOB: objjob
    //           })

    //           wx.showToast({
    //             icon: 'none',
    //             title: res.data.m
    //           })

    //         },
    //         fail: function(err) {
    //           app.applyfail()
    //         }
    //       })
    //     }
    //   }
    // })
  },

  confirmApplication() {
    return new Promise((resolve) => {
      wx.showModal({
        title: '提示',
        content: '确定要申请这个岗位吗',
        confirmColor: 'red',
        success: (result) => resolve(result)
      })
    })
  }
})
