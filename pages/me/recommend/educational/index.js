// main.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    startX: 0, // 开始坐标
    startY: 0,
    id: [],
    school: [],
    education: [],
    beginfrom: [],
    endto: [],
    isTouchMove: []
  },

  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      this.fetchdata()
    }
  },

  // 加载数据
  fetchdata: function() {
    const that = this

    wx.showLoading()
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Educational.ashx',
      data: {
        action: 'list',
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        const data = res.data
        if (data.r > 0) {
          that.setData({
            id: data.Educational.ID,
            beginfrom: data.Educational.BeginFrom,
            endto: data.Educational.EndTo,
            education: data.Educational.Education,
            school: data.Educational.School,
            isTouchMove: data.Educational.isTouchMove
          })
        }
        wx.hideLoading()
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        wx.hideLoading()
      }
    })
  },

  // 手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    const that = this
    // 开始触摸时 重置所有删除
    const isTouchMove = that.data.isTouchMove
    isTouchMove.forEach(function(v, i) {
      if (isTouchMove[i]) {
        // 只操作为true的
        isTouchMove[i] = false
      }
    })

    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      isTouchMove: isTouchMove
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

    const isTouchMove = that.data.isTouchMove

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
    that.setData({
      isTouchMove: isTouchMove
    })
  },

  angle: function(start, end) {
    const _X = end.X - start.X
    const _Y = end.Y - start.Y
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
  },

  addnew: function() {
    wx.redirectTo({
      url: 'add/index'
    })
  },

  modifyfun: function(e) {
    const idx = e.target.dataset.eduindex
    wx.redirectTo({
      url: 'modify/index?id=' + idx
    })
  },

  viewfun: function(e) {
    const idx = e.target.dataset.eduindex
    wx.redirectTo({
      url: 'modify/index?flag=1&id=' + idx
    })
  },

  deletefun: function(e) {
    const that = this
    const index = e.target.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      confirmColor: 'red',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url:
              app.api.baseUrl +
              app.Graduate.code +
              '/Graduate/Mine/Educational.ashx',
            data: {
              action: 'deleted',
              code: app.Graduate.code,
              gid: app.Graduate.gid,
              id: e.target.id
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              const tmpid = that.data.id
              const tmpbeginfrom = that.data.beginfrom
              const tmpendto = that.data.endto
              const tmpeducation = that.data.education
              const tmpschool = that.data.school
              const tmpisTouchMove = that.data.isTouchMove

              tmpid.splice(index, 1)
              tmpbeginfrom.splice(index, 1)
              tmpeducation.splice(index, 1)
              tmpendto.splice(index, 1)
              tmpschool.splice(index, 1)
              tmpisTouchMove.splice(index, 1)
              that.setData({
                id: tmpid,
                beginfrom: tmpbeginfrom,
                endto: tmpendto,
                education: tmpeducation,
                school: tmpschool,
                isTouchMove: tmpisTouchMove
              })
              wx.showToast({
                title: '删除成功', // 弹出窗口
                icon: 'none',
                duration: 2000
              })
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }
      }
    })
  },

  handleJumpBack() {
    wx.navigateBack()
  }
})
