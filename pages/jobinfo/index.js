// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from '../../miniprogram_npm/regenerator-runtime/index'
import { getImageCache } from '../../utils/imageCache.js'
import { getJobList } from '../../apis/jobList'

const app = getApp()
const ratio = 750 / wx.getStorageSync('screenWidth')
const LIMIT = 20

function toRpx(px) {
  return ratio * px
}

Page({
  data: {
    headerOpacity: 0,
    fixTopPosition: 'none',
    employmentListMarginTop: 0,
    lockScroll: false,

    pageindex: 1,
    pagecount: 1,
    key: '',
    code: '',
    wkind: 1,
    jobList: []
  },

  async onReady() {
    if (!app.Graduate.code) {
      app.launchurl = '/pages/jobinfo'
      await app.wxlogin()
    }
    this.getJobData()
    app.toastLoading()
  },

  handleSearchInput(e) {
    this.setData({
      key: e.detail
    })
    if (!this.data.key) {
      app.toastLoading()
      this.getJobData()
    }
  },

  handleSearch() {
    this.setData({
      pageindex: 1
    })
    app.toastLoading()
    this.getJobData()
  },

  handlePageScroll(e) {
    const { scrollTop } = e.detail
    let opacity = 0
    let position = 'none'
    let marginTop = 0
    if (toRpx(scrollTop) < 50) {
      opacity = 0
    } else {
      opacity = Math.min(1, toRpx(scrollTop) / 310)
      if (opacity === 1) {
        position = 'fixed'
        marginTop = 155
      }
    }
    this.setData({
      headerOpacity: opacity,
      fixTopPosition: position,
      employmentListMarginTop: marginTop
    })
  },

  async handlePageScrollToLower() {
    if (!this.data.lockScroll) {
      this.setData({
        isLoadingMoreItems: true,
        noMore: false,
        pageindex: this.data.pageindex + 1,
        lockScroll: true
      })
      await this.getJobData()
      this.setData({
        lockScroll: false,
        isLoadingMoreItems: false
      })
    }
  },

  async getJobData() {
    try {
      const { result } = await getJobList(this.data, app.Graduate)
      const { data, pagecount } = result
      const len = data.length
      if (len && len < LIMIT) {
        this.setData({
          noMore: true,
          lockScroll: true
        })
      } else if (!len || this.data.pageindex > pagecount) {
        this.setData({
          noMore: true,
          lockScroll: true
        })
        return
      }

      const newJobList = data.map((each) => {
        const key = `CompanyLogoUrls_${each.cid}`
        const path = wx.getStorageSync(key)
        if (!path) {
          getImageCache(key, each.LogoUrl)
        }
        each.LogoUrl = path || each.LogoUrl

        return each
      })

      const jobList =
        this.data.pageindex > 1
          ? [...this.data.jobList, ...newJobList]
          : newJobList

      this.setData({
        acount: len,
        jobList,
        isHideLoadMore: true
      })
      app.toastClear()
    } catch (error) {
      console.log(error)
      if (!app.Graduate.code) {
        app.toastFailed('请登录')
      } else {
        app.toastFailed('数据获取失败')
      }
    }
  },

  handleGoToDetail({ detail }) {
    app.toastLoading()
    wx.navigateTo({
      url: `./detailed/index?jobid=${detail.jobid}&cid=${detail.cid}`
    })
  }
})
