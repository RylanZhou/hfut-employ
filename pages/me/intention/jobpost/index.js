//main.js
//获取应用实例
let app = getApp()
Page({
  data: {
    startX: 0, //开始坐标
    startY: 0,
    id: [],
    caption: [],
    isTouchMove: [],
    JobPost1index: -1,
    objectJobPost1Array: [
      {
        id: 10,
        name: '计算机/互联网/通信/电子'
      },
      {
        id: 11,
        name: '销售/客服/技术支持'
      },
      {
        id: 12,
        name: '会计/金融/银行/保险'
      },
      {
        id: 13,
        name: '生产/营运/采购/物流'
      },
      {
        id: 14,
        name: '生物/制药/医疗/护理'
      },
      {
        id: 15,
        name: '广告/市场/媒体/艺术'
      },
      {
        id: 16,
        name: '建筑/房地产'
      },
      {
        id: 17,
        name: '人事/行政/高级管理'
      },
      {
        id: 18,
        name: '咨询/法律/教育/科研'
      },
      {
        id: 19,
        name: '服务业/翻译'
      },
      {
        id: 20,
        name: '农/林/牧/渔/环保'
      }
    ],

    multiArray: [[], []],
    multiIndex: [0, 0],
    JobPost: 0,
    JobPostName: ''
  },

  onLoad: function() {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      this.fetchdata()
    }
  },

  //加载数据
  fetchdata: function() {
    wx.showLoading()
    let that = this
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Intention.ashx',
      data: {
        action: 'jobpost',
        code: app.Graduate.code,
        gid: app.Graduate.gid
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        let data = res.data
        if (data.r > 0) {
          that.setData({
            id: data.JobPost.ID,
            caption: data.JobPost.Caption,
            isTouchMove: data.JobPost.isTouchMove
          })
        }
        wx.hideLoading()
      },
      fail: function() {
        wx.hideLoading()
      },
      complete: function() {
        // complete
        wx.hideToast()
      }
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    let that = this
    //开始触摸时 重置所有删除
    let isTouchMove = that.data.isTouchMove
    isTouchMove.forEach(function(v, i) {
      if (isTouchMove[i])
        //只操作为true的
        isTouchMove[i] = false
    })

    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      isTouchMove: isTouchMove
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    let that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度

      angle = that.angle(
        {
          X: startX,
          Y: startY
        },
        {
          X: touchMoveX,
          Y: touchMoveY
        }
      )

    let isTouchMove = that.data.isTouchMove

    isTouchMove.forEach(function(v, i) {
      isTouchMove[i] = false

      //滑动超过30度角 return

      if (Math.abs(angle) > 30) return
      if (i == index) {
        if (touchMoveX > startX) isTouchMove[i] = false
        //右滑
        else isTouchMove[i] = true //左滑
      }
    })
    that.setData({
      isTouchMove: isTouchMove
    })
  },

  angle: function(start, end) {
    let _X = end.X - start.X,
      _Y = end.Y - start.Y
    return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
  },

  deletefun: function(e) {
    let that = this
    let index = e.target.dataset.index
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
              '/Graduate/Mine/Intention.ashx',
            data: {
              action: 'postdeleted',
              code: app.Graduate.code,
              gid: app.Graduate.gid,
              id: e.target.id
            },
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
            success: function(res) {
              let tmpid = that.data.id
              let tmpcaption = that.data.caption
              let tmpisTouchMove = that.data.isTouchMove

              tmpid.splice(index, 1)
              tmpcaption.splice(index, 1)
              tmpisTouchMove.splice(index, 1)
              that.setData({
                id: tmpid,
                caption: tmpcaption,
                isTouchMove: tmpisTouchMove
              })
              wx.showToast({
                title: '删除成功', //弹出窗口
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

  JobPost1PickerChange: function(e) {
    let that = this
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }

    let jobpost1 = this.data.objectJobPost1Array[e.detail.value].id

    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Mine/Intention.ashx?rand=' +
        Math.random(),
      data: {
        action: 'jobpost1',
        year: app.Graduate.year,
        jobpostid: jobpost1,
        code: app.Graduate.code
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        data.multiArray[0] = res.data.city
        data.multiArray[1] = res.data.district
        data.multiIndex[0] = e.detail.value
        data.multiIndex[1] = 0

        that.setData(data)

        that.setData({
          JobPost1index: e.detail.value,
          JobPost: that.data.multiArray[1][0].id,
          JobPostName: that.data.multiArray[1][0].name
        })
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  },

  bindMultiPickerColumnChange: function(e) {
    let that = this
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        let jobpost2 = that.data.multiArray[0][e.detail.value].id
        wx.request({
          url:
            app.api.baseUrl +
            app.Graduate.code +
            '/Graduate/Mine/Intention.ashx?rand=' +
            Math.random(),
          data: {
            action: 'jobpost2',
            year: app.Graduate.year,
            jobpostid: jobpost2,
            code: app.Graduate.code
          },
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            data.multiArray[1] = res.data.district
            data.multiIndex[1] = 0

            that.setData(data)

            that.setData({
              JobPost: that.data.multiArray[1][0].id,
              JobPostName: that.data.multiArray[1][0].name
            })
          },
          fail: function(err) {
            app.applyfail()
          }
        })
        break
      case 1:
        that.setData({
          JobPost: that.data.multiArray[1][e.detail.value].id,
          JobPostName: that.data.multiArray[1][e.detail.value].name
        })

        break
    }
  },

  addnew: function(e) {
    let that = this
    console.log(that)
    if (that.data.JobPost == '0') return
    wx.request({
      url:
        app.api.baseUrl + app.Graduate.code + '/Graduate/Mine/Intention.ashx',
      data: {
        action: 'postadd',
        code: app.Graduate.code,
        gid: app.Graduate.gid,
        id: that.data.JobPost
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(1)
        console.log(res)
        console.log(2)
        console.log(res.data.r)
        if (res.data.r == '1') return
        let tmpid = that.data.id
        let tmpcaption = that.data.caption
        let tmpisTouchMove = that.data.isTouchMove

        tmpid.push(that.data.JobPost)
        tmpcaption.push(that.data.JobPostName)
        tmpisTouchMove.push(false)
        that.setData({
          id: tmpid,
          caption: tmpcaption,
          isTouchMove: tmpisTouchMove
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

  backToPage: function(e) {
    wx.navigateBack()
  }
})
