var app = getApp()
Page({
  data: {
    sid: 0,
    LiveInindex: 0,
    FromKindindex: 0,
    District: 0,
    DistrictName: '',
    UnitName: '',
    Linker: '',
    Mobile: '',
    Post: '',
    Comment: '',
    hidden: 'hidden',
    multiArray: [app.objectProvinceArray, [], []],
    multiIndex: [0, 0, 0],
    objectLiveInArray: app.objectLiveInArray,
    objectFromKindArray: app.objectFromKindArray
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/activity'
      app.wxlogin()
    } else {
      var sid = option.sid
      var opter = option.opter
      var that = this
      app.loading()
      wx.request({
        url:
          app.api.baseUrl +
          app.Graduate.code +
          '/Graduate/Activity/SignIn.ashx?rand=' +
          Math.random(),
        data: {
          action: 'info',
          year: app.Graduate.year,
          code: app.Graduate.code,
          gid: app.Graduate.gid,
          sid: sid,
          opter: opter
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          wx.hideLoading()
          that.setData({
            sid: res.data.sid,
            District: res.data.District,
            DistrictName: res.data.DistrictName,
            UnitName: res.data.UnitName,
            Linker: res.data.Linker,
            Mobile: res.data.Mobile,
            Post: res.data.Post,
            Comment: res.data.Comment,
            hidden: res.data.hidden,
            LiveInindex: res.data.LiveInindex,
            FromKindindex: res.data.FromKindindex
          })
        }
      })
    }
  },

  LiveInPickerChange: function(e) {
    this.setData({
      LiveInindex: e.detail.value
    })
  },
  FromKindPickerChange: function(e) {
    this.setData({
      FromKindindex: e.detail.value
    })
  },

  bindMultiPickerColumnChange: function(e) {
    var that = this
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        var province = app.objectProvinceArray[e.detail.value].id
        wx.request({
          url:
            app.api.baseUrl +
            app.Graduate.code +
            '/Graduate/Dispatch/BaseInfo.ashx?rand=' +
            Math.random(),
          data: {
            action: 'province',
            year: app.Graduate.year,
            province: province,
            code: app.Graduate.code,
            proname: app.objectProvinceArray[e.detail.value].name
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            data.multiArray[1] = res.data.city
            data.multiArray[2] = res.data.district
            data.multiIndex[0] = e.detail.value
            data.multiIndex[1] = 0
            data.multiIndex[2] = 0
            that.setData(data)
            var district = that.data.multiArray[2][0].id
            var graduate = that.data.Graduate
            var province = that.data.multiArray[0][e.detail.value].name
            var city = that.data.multiArray[1][0].name

            var orgin = province
            if (orgin != city) orgin += city
            that.setData({
              District: district,
              DistrictName: orgin
            })
          },
          fail: function(err) {
            app.applyfail()
          }
        })
        break
      case 1:
        var proname = this.data.multiArray[0][this.data.multiIndex[0]].name
        var city = this.data.multiArray[1][e.detail.value].id
        var cityname = this.data.multiArray[1][e.detail.value].name

        wx.request({
          url:
            app.api.baseUrl +
            app.Graduate.code +
            '/Graduate/Dispatch/BaseInfo.ashx?rand=' +
            Math.random(),
          data: {
            action: 'city',
            year: app.Graduate.year,
            code: app.Graduate.code,
            city: city,
            proname: proname,
            cityname: cityname
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            data.multiArray[2] = res.data.district
            data.multiIndex[1] = e.detail.value
            data.multiIndex[2] = 0
            that.setData(data)

            var district = that.data.multiArray[2][0].id
            var graduate = that.data.Graduate
            var province = that.data.multiArray[0][that.data.multiIndex[0]].name
            var city = that.data.multiArray[1][e.detail.value].name
            var districtname = that.data.multiArray[2][0].name
            var orgin = province
            if (orgin != city) orgin += city
            that.setData({
              District: district,
              DistrictName: orgin
            })
          },
          fail: function(err) {
            app.applyfail()
          }
        })
        break
      case 2:
        var district = this.data.multiArray[2][e.detail.value].id
        var graduate = that.data.Graduate
        var province = this.data.multiArray[0][this.data.multiIndex[0]].name
        var city = this.data.multiArray[1][this.data.multiIndex[1]].name
        var districtname = this.data.multiArray[2][e.detail.value].name
        var orgin = province
        if (orgin != city) orgin += city
        if (city != districtname) orgin += districtname
        that.setData({
          District: district,
          DistrictName: orgin
        })

        break
    }
  },

  // 保存数据
  formSubmit: function(e) {
    var that = this
    var formData = e.detail.value
    if (that.data.DistrictName == '') {
      wx.showToast({
        title: '请选择单位所在地', //弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (formData.UnitName == '') {
      wx.showToast({
        title: '请填写单位名称', //弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (formData.Linker == '') {
      wx.showToast({
        title: '请填写联系人', //弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (formData.Mobile == '') {
      wx.showToast({
        title: '请填写联系人电话', //弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (formData.Post == '') {
      wx.showToast({
        title: '请填写岗位描述', //弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (formData.Post.length < 20) {
      wx.showToast({
        title: '岗位描述不能低于20个字', //弹出窗口
        icon: 'none',
        duration: 2000
      })
      return
    }

    var formData = e.detail.value
    formData.action = 'save'
    formData.code = app.Graduate.code
    formData.gid = app.Graduate.gid
    formData.year = app.Graduate.year

    formData.sid = that.data.sid
    formData.District = that.data.District
    formData.LiveIn = app.objectLiveInArray[formData.LiveIn].id
    formData.FromKind = app.objectFromKindArray[formData.FromKind].id
    wx.showLoading()
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Activity/SignIn.ashx?rand=' +
        Math.random(),
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        wx.showToast({
          title: '签到成功', //弹出窗口
          icon: 'success',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/activity/signin/index'
        })
      },
      fail: function(err) {
        app.applyfail()
      }
    })
  }
})
