const app = getApp()
Page({
  data: {
    opened: false,
    automatic: false,
    jobinfo: false
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      const that = this
      that.setData({
        opened: app.Graduate.opened,
        automatic: app.Graduate.automatic,
        jobinfo: app.Graduate.jobinfo
      })
    }
  },

  handleJumpBack() {
    wx.navigateBack()
  },

  switch1Change: function(e) {
    wx.request({
      url: app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Config.ashx',
      data: {
        action: 'modify',
        gid: app.Graduate.gid,
        code: app.Graduate.code,
        field: e.target.dataset.field,
        value: e.detail.value
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        const field = e.target.dataset.field
        if (field == 'Jobinfo') app.Graduate.jobinfo = e.detail.value
        else if (field == 'Automatic') app.Graduate.automatic = e.detail.value
        else if (field == 'Opened') app.Graduate.opened = e.detail.value
        // 重新设置缓存
        wx.setStorageSync('Graduate', app.Graduate)
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  ClearImgStorage() {
    wx.clearStorageSync('Headportrait')
    wx.getSavedFileList({
      // 获取文件列表
      success(res) {
        res.fileList.forEach((val, key) => {
          // 遍历文件列表里的数据
          // 删除存储的垃圾数据
          wx.removeSavedFile({
            filePath: val.filePath
          })
        })
      }
    })
    wx.showToast({
      title: '清理完成',
      icon: 'none',
      duration: 2000
    })
  },

  ClearStorage: function() {
    wx.clearStorageSync('Headportrait')
    wx.getSavedFileList({
      // 获取文件列表
      success(res) {
        res.fileList.forEach((val, key) => {
          // 遍历文件列表里的数据
          // 删除存储的垃圾数据
          wx.removeSavedFile({
            filePath: val.filePath
          })
        })
      }
    })

    wx.clearStorageSync('Graduate')
    app.Graduate.openid = null
    app.Graduate.year = null
    app.Graduate.code = null
    app.Graduate.college = null
    app.Graduate.gid = null
    app.Graduate.education = null
    app.Graduate.discipline = null
    app.Graduate.name = null
    app.Graduate.photo = null
    app.Graduate.jobinfo = null
    app.Graduate.market = null
    app.Graduate.automatic = null
    app.Graduate.opened = null
  },

  Unbind: function(e) {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要解除当前微信号与学号的绑定吗?',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.api.loginUrl + 'UserInfo.ashx?rand=' + Math.random(),
            data: {
              action: 'unbinduser',
              gid: app.Graduate.gid,
              code: app.Graduate.code
            },
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
            success: function(res) {
              console.log(res)
              that.ClearStorage()
              wx.reLaunch({
                url: '../../jobinfo/index'
              })
            }
          })
        }
      }
    })
  }
})
