import { getImageCache } from '../../../utils/userCache.js'

const app = getApp()
Page({
  data: {
    src: '/assets/emotion.png',
    graduate: {},
    score: 0
  },

  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    }

    if (app.Graduate.photo != null && app.Graduate.photo != '') {
      getImageCache(
        'Headportrait',
        app.api.baseUrl + app.Graduate.code + '/' + app.Graduate.photo
      ).then((res) => {
        this.setData({
          src: res
        })
      })
    }
    this.setData({
      graduate: app.Graduate
    })
  },

  onShow: function() {
    const that = this
    wx.request({
      url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Config.ashx',
      data: {
        action: 'score',
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        const data = res.data
        that.setData({
          score: data.score
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  navToPage: function(event) {
    const route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  },

  ClosedPage: function() {
    app.ClosedPage()
  },

  // 上传头像
  uploadphoto: function() {
    const that = this
    wx.chooseImage({
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url:
            app.api.baseUrl +
            app.Graduate.code +
            '/Graduate/Mine/UploadPhoto.ashx',
          filePath: tempFilePaths[0],
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'uploadFile',
          formData: {
            gid: app.Graduate.gid,
            code: app.Graduate.code,
            year: app.Graduate.year
          },
          success: function(res) {
            that.setData({
              src: tempFilePaths[0]
            })

            app.Graduate.photo =
              'Upload/Photo/' +
              app.Graduate.year +
              '/' +
              app.Graduate.gid +
              '.jpg'
            wx.setStorageSync('Graduate', app.Graduate)
            wx.clearStorageSync('Headportrait')
            wx.showToast({
              title: '上传成功', // 弹出窗口
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  }
})
