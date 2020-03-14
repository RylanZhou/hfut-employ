let app = getApp()
Page({
    data: {
      acount: 0,
      pageindex: 1,
      pagecount: 1,
      key: '',
      isHideLoadMore: true,
      isHideLoading: true,
      closed: false,
      LoadMore: '正在加载更多',
      CompanyInfo: {
        companyname: [],
        companyid: []
      }
    },

    keyInput: function (e) {
      this.setData({
        key: e.detail.value
      })
    },

    search: function () {
      this.setData({
        pageindex: 1,
        closed: false
      })
      this.getJobData();
    },


    onLoad: function (option) {
      if (app.Graduate.gid == null) {
        app.launchurl = '/pages/activity';
        app.wxlogin();
      } else {
                this.getJobData();
      }
    },

    getJobData: function () {
     
      console.log(1);
    var that = this;
    console.log(app.api.baseUrl + app.Graduate.code + "/Graduate/Activity/JobList.ashx?rand=" + Math.random());
    app.loading();
    wx.request({
      url: app.api.baseUrl + app.Graduate.code + "/Graduate/Activity/JobList.ashx?rand=" + Math.random(),
      data: {
        action: 'allcompanylist',
        code: app.Graduate.code,
        pageindex: that.data.pageindex,
        key: that.data.key
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        wx.stopPullDownRefresh();
        wx.hideLoading();
        var data = res.data.result.data;
        var pagecount = res.data.result.pagecount;
        var len = data.length;
        if (len == 0) {
          that.setData({
            acount: 0,
            isHideLoadMore: true,
            isHideLoading: true
          });
          wx.showToast({
            title: "暂无职位信息", //弹出窗口
            icon: "none",
            duration: 2000
          })
        } else {
          if (that.data.pageindex > pagecount) {
            that.setData({
              closed: true,
              isHideLoadMore: false,
              isHideLoading: true,
              LoadMore: '全部加载完毕'
            })
            return;
          }
        }

        var CompanyInfoobj = {
          companyid: [],
          companyname: [],
        }
        if (that.data.pageindex > 1)
          var CompanyInfoobj = that.data.CompanyInfo;

        for (var i = 0; i < len; i++) {
          CompanyInfoobj.companyid.push(data[i].companyid);
          CompanyInfoobj.companyname.push(data[i].companyname);
        }
        that.setData({
          acount: len,
          CompanyInfo: CompanyInfoobj,
          isHideLoadMore: true
        })
      },
      fail: function (err) {
        app.applyfail();
      }
    })
    },


    onPullDownRefresh: function (e) {
      this.setData({
        pageindex: 1,
        closed: false
      });
      this.getJobData();
    },

    onReachBottom: function (e) {
      if (!this.data.closed) {
        var pindex = this.data.pageindex;
        this.setData({
          isHideLoadMore: false,
          isHideLoading: false,
          LoadMore: '正在加载更多',
          pageindex: pindex + 1
        });
        this.getJobData();
      }
    },

    //页面跳转
    navToPage(event) {
      let route = event.currentTarget.dataset.route
      wx.navigateTo({
        url: route
      })
    },


  }

)