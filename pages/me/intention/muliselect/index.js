const app = getApp()
Page({
  data: {
    title: '',
    kind: '1',
    items: [],
    val: '',
    prevalues: [],
    items1: [
      { value: '10', name: '机关' },
      { value: '20', name: '科研设计单位' },
      { value: '21', name: '高等教育单位' },
      { value: '22', name: '中初教育单位' },
      { value: '23', name: '医疗卫生单位' },
      { value: '29', name: '其他事业单位' },
      { value: '31', name: '国有企业' },
      { value: '32', name: '三资企业' },
      { value: '39', name: '其他企业' },
      { value: '40', name: '部队' },
      { value: '55', name: '农村建制村' },
      { value: '56', name: '城镇社区' }
    ],
    items2: [
      { value: '11', name: '农、林、牧、渔业' },
      { value: '21', name: '采矿业' },
      { value: '22', name: '制造业' },
      { value: '23', name: '电力、热力、燃气及水生产和供应业' },
      { value: '24', name: '建筑业' },
      { value: '31', name: '批发和零售业' },
      { value: '32', name: '交通运输、仓储和邮政业' },
      { value: '33', name: '住宿和餐饮业' },
      { value: '34', name: '信息传输、软件和信息技术服务业' },
      { value: '35', name: '金融业' },
      { value: '36', name: '房地产业' },
      { value: '37', name: '租赁和商务服务业' },
      { value: '38', name: '科学研究和技术服务业' },
      { value: '39', name: '水利、环境和公共设施管理业' },
      { value: '41', name: '居民服务、修理和其他服务业' },
      { value: '42', name: '教育' },
      { value: '43', name: '卫生和社会工作' },
      { value: '44', name: '文化、体育和娱乐业' },
      { value: '45', name: '公共管理、社会保障和社会组织' }
    ],
    items3: [
      { value: '34', name: '安徽省' },
      { value: '11', name: '北京市' },
      { value: '31', name: '上海市' },
      { value: '32', name: '江苏省' },
      { value: '33', name: '浙江省' },
      { value: '44', name: '广东省' },
      { value: '12', name: '天津市' },
      { value: '13', name: '河北省' },
      { value: '14', name: '山西省' },
      { value: '15', name: '内蒙古自治区' },
      { value: '21', name: '辽宁省' },
      { value: '22', name: '吉林省' },
      { value: '23', name: '黑龙江省' },
      { value: '35', name: '福建省' },
      { value: '36', name: '江西省' },
      { value: '37', name: '山东省' },
      { value: '41', name: '河南省' },
      { value: '42', name: '湖北省' },
      { value: '43', name: '湖南省' },
      { value: '45', name: '广西壮族自治区' },
      { value: '46', name: '海南省' },
      { value: '50', name: '重庆市' },
      { value: '51', name: '四川省' },
      { value: '52', name: '贵州省' },
      { value: '53', name: '云南省' },
      { value: '54', name: '西藏' },
      { value: '61', name: '陕西省' },
      { value: '62', name: '甘肃省' },
      { value: '63', name: '青海省' },
      { value: '64', name: '宁夏回族自治区' },
      { value: '65', name: '新疆维吾尔族自治区' },
      { value: '70', name: '港澳台区' },
      { value: '99', name: '海外' }
    ]
  },

  onLoad: function(option) {
    if (app.Graduate.gid == null) {
      app.launchurl = '/pages/me'
      app.wxlogin()
    } else {
      // 发起一个网络请求
      const that = this
      const kind = option.kind
      const jid = option.gid
      const val = option.val
      this.setData({
        kind: kind
      })

      if (kind == '1') {
        this.setData({
          items: that.data.items1,
          title: '单位性质'
        })
        wx.setNavigationBarTitle({
          title: '单位性质'
        })
      } else if (kind == '2') {
        this.setData({
          items: that.data.items2,
          title: '单位行业'
        })
        wx.setNavigationBarTitle({
          title: '单位行业'
        })
      } else if (kind == '3') {
        this.setData({
          items: that.data.items3,
          title: '工作地点'
        })
        wx.setNavigationBarTitle({
          title: '工作地点'
        })
      }

      const items = this.data.items
      const values = val.split(',')
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false

        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (items[i].value === values[j]) {
            items[i].checked = true
            break
          }
        }
      }

      this.setData({
        items
      })
    }
  },

  checkboxChange: function(e) {
    const items = this.data.items
    const values = e.detail.value

    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (values.length > 5) values.shift(values[0])
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      prevalues: values,
      val: e.detail.value,
      items
    })
    // this.setData({

    // })
  },

  formSubmit: function(e) {
    const that = this
    console.log(that.data.val)
    wx.request({
      url:
        app.api.baseUrl +
        app.Graduate.code +
        '/Graduate/Mine/Intention.ashx?action=modify2&kind=' +
        this.data.kind +
        '&gid=' +
        app.Graduate.gid +
        '&code=' +
        app.Graduate.code +
        '&val=' +
        that.data.val +
        '&rand=' +
        Math.random(),
      method: 'get',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {},
      fail: function(err) {
        app.applyfail()
      }
    })
  },

  backToPage: function() {
    wx.navigateBack()
  }
})
