let app = getApp()
Page({
  data: {
    id: '',
    cid: '',
    jobid: '',
    jobname: '',
    endate: '',
    linker: '',
    telephone: '',
    disabled: true,
    applystate: '',
    graduate: {}
  },

  subDay: function(dayNumber, date) {
    date = date ? date : new Date()
    let ms = dayNumber * (1000 * 60 * 60 * 24)
    let date1 = new Date(date.getTime() + ms)
    let str =
      '' +
      date1.getFullYear() +
      '-' +
      (date1.getMonth() + 1) +
      '-' +
      date1.getDate() +
      ''
    return str //返回日期
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      let that = this
      let endate = this.subDay(14, new Date(option.date))
      let today = new Date()
      let btnabeld = true

      if (option.disabled == 'false') btnabeld = false

      that.setData({
        id: option.id,
        cid: option.cid,
        jobid: option.jobid,
        disabled: btnabeld,
        jobname: option.jobname,
        applystate: option.applystate,
        endate: endate,
        graduate: app.Graduate
      })
      wx.request({
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Mine/Notice.ashx?rand=' +
          Math.random(),
        data: {
          action: 'companyinfo',
          cid: that.data.cid,
          year: app.Graduate.year,
          code: app.Graduate.code,
          gid: app.Graduate.gid,
          jid: that.data.jobid
        },
        method: 'get',
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          that.setData({
            linker: res.data.linker,
            telephone: res.data.telephone
          })
        }
      })
    }
  },

  // 怨言谢绝
  refuse: function(e) {
    let that = this
    let id = that.data.id
    let jid = that.data.jobid
    let cid = that.data.cid
    let applystate = that.data.applystate
    wx.showModal({
      title: '提示',
      content: applystate == '2' ? '确定不去面试吗?' : '确定不签约吗？',
      success: function(res) {
        if (res.confirm) {
          let that = this
          wx.request({
            url:
              app.api.baseUrl +
              app.Graduate.code +
              '/Graduate/Mine/Notice.ashx?rand=' +
              Math.random(),
            data: {
              action: 'refuese',
              cid: cid,
              jid: jid,
              year: app.Graduate.year,
              code: app.Graduate.code,
              gid: app.Graduate.gid,
              applystate: applystate
            },
            method: 'get',
            header: {
              'Content-Type': 'application/json'
            },
            success: function(res) {
              wx.showToast({
                title: '已谢绝', //弹出窗口
                icon: 'none',
                duration: 2000
              })
              wx.navigateBack()
            }
          })
        }
      }
    })
  },

  //ji
  formSubmit: function(e) {
    let that = this
    let id = that.data.id
    let jid = that.data.jobid
    let cid = that.data.cid
    let formId = e.detail.formId
    let applystate = that.data.applystate
    if (formId == 'the formId is a mock one') return
    wx.showModal({
      title: '重要提示',
      content:
        applystate == '2'
          ? '确定去面试吗?'
          : '确定要签约吗，签约后就业派遣信息将不可更改(通过解约申请后方可重新编辑)',
      success: function(res) {
        console.log()
        if (res.confirm) {
          wx.request({
            url:
              app.api.baseUrl +
              app.Graduate.code +
              '/Graduate/Mine/Notice.ashx?rand=' +
              Math.random(),
            data: {
              action:
                that.data.applystate == '2' ? 'acceptinter' : 'acceptagree',
              id: id,
              cid: cid,
              jid: jid,
              year: app.Graduate.year,
              code: app.Graduate.code,
              gid: app.Graduate.gid,
              openid: app.Graduate.openid,
              formId: formId,
              applystate: that.data.applystate
            },
            method: 'get',
            header: {
              'Content-Type': 'application/json'
            },
            success: function(res) {
              wx.showToast({
                title: '已提交', //弹出窗口
                icon: 'none',
                duration: 2000
              })
              wx.navigateBack()
            }
          })
        }
      }
    })
  }
})
