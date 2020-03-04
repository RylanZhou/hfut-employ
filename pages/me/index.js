import { getImageCache } from '../../utils/imageCache.js'
let app = getApp()
Page({
  data: {
    avatarUrl: '', //用户头像
    nickName: '同学，您好' //用户昵称
  },

  onLoad: function(options) {
    let that = this
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      wx.getUserInfo({
        success: function(res) {
          that.setData({
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          })
        }
      })
    }
  },

  onGotUserInfo: function(e) {
    let that = this
    that.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName
    })
  },
  //扫一扫
  scancode: function(event) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        if (res.errMsg == 'scanCode:ok') {
          let url = res.result
          let list = url.split('-')
          let len = list.length
          // 单位信息 AHBYS - Company - 10000 - 单位编码
          // 职位信息 AHBYS - Company - 10000 - 职位编码
          // 宣讲会   AHBYS - Booking - 学校代码 - 专场编码
          // 双选会   AHBYS - Recruitment - 学校代码 - 双选编码
          // 推荐表   AHBYS - Recommendation - 编号 - 随机码

          let title = ''
          if (list[0] != 'AHBYS') title = '不可识别的二维码2'

          let kind = list[1]
          if (
            kind != 'Job' &&
            kind != 'Company' &&
            kind != 'Recruitment' &&
            kind != 'Booking' &&
            kind != 'Recommendation'
          )
            title = '不可识别的二维码3'

          let code = list[2]
          console.log(code)
          if (title != '') {
            wx.showToast({
              icon: 'none',
              title: title
            })
          } else {
            let objid = list[3]

            if (kind == 'Job')
              //职位二维码
              wx.navigateTo({
                url: '/pages/jobinfo/detailed/index?job=' + objid + '&idx=0'
              })
            else if (kind == 'Company')
              //单位二维码
              wx.navigateTo({
                url: '/pages/jobinfo/company/index?cid=' + objid
              })
            else if (kind == 'Recruitment') {
              //双选会
              wx.request({
                url: app.api.baseUrl + code + '/Graduate/Activity/SignIn.ashx',
                data: {
                  action: 'recruitment',
                  code: code,
                  year: app.Graduate.year,
                  gid: app.Graduate.gid,
                  rid: objid
                },
                header: {
                  'Content-Type': 'application/json'
                },
                success: function(res) {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.m
                  })
                  wx.navigateTo({
                    url:
                      '/pages/activity/market/detailed/index?code=' +
                      code +
                      '&rid=' +
                      objid
                  })
                }
              })
            }
            //专场宣讲会
            else if (kind == 'Booking') {
              let cid = list[4]
              wx.request({
                url: app.api.baseUrl + code + '/Graduate/Activity/SignIn.ashx',
                data: {
                  action: 'booking',
                  code: code,
                  year: app.Graduate.year,
                  gid: app.Graduate.gid,
                  rid: objid
                },
                header: {
                  'Content-Type': 'application/json'
                },
                success: function(res) {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.m
                  })
                  wx.navigateTo({
                    url:
                      '/pages/activity/recruitment/detailed/index?codelist=' +
                      code +
                      '&bidlist=' +
                      objid +
                      '&cidlist=' +
                      cid +
                      '&idx=0'
                  })
                }
              })
            }
            //就业推荐表扫码登录
            else if (kind == 'Recommendation') {
              console.log(app.Graduate)
              console.log(objid)
              wx.request({
                url: 'https://yun.ahbys.com/jytjb/Aboutme.ashx',
                data: {
                  action: 'login',
                  code: app.Graduate.code,
                  year: app.Graduate.year,
                  gid: app.Graduate.gid,
                  edu: app.Graduate.education,
                  id: code
                },
                method: 'get',
                header: {
                  'Content-Type': 'application/json'
                },
                success: function(res) {
                  console.log(res)
                  wx.showToast({
                    icon: 'none',
                    title: '扫码完成',
                    duration: 2000
                  })
                }
              })
            }
          }
        }
      },
      fail: function() {},
      complete: function() {}
    })
  },

  navToPage(event) {
    let route = event.currentTarget.dataset.route
    wx.navigateTo({
      url: route
    })
  }
})
