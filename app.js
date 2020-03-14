// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from './miniprogram_npm/regenerator-runtime/index'
import Toast from './miniprogram_npm/@vant/weapp/toast/toast'

App({
  onLaunch() {
    // 调用API从本地缓存中获取数据
    const storage1 = wx.getStorageSync('Graduate')
    if (storage1 != '' && storage1 != null) {
      this.Graduate = storage1
    }

    wx.getSystemInfo({
      success: (res) => {
        wx.setStorageSync('screenWidth', res.screenWidth)
      }
    })
  },
  Graduate: {
    openid: null,
    code: null,
    gid: null,
    year: null,
    education: null,
    discipline: null,
    disciplineName: null,
    college: null,
    name: null,
    photo: null,
    jobinfo: null,
    market: null,
    opened: null,
    automatic: null
  },

  api: {
    rootUrl: 'https://yun.ahbys.com/',
    baseUrl: 'https://yun.ahbys.com/MiniAPI/', // ..'http://localhost/MiniAPI/',//
    loginUrl: 'https://yun.ahbys.com/Login/', // 'http://localhost/Login/',//
    appId: 'wxa843f9f8a134336f'
  },
  launchurl: '',

  loading() {
    wx.showToast({
      title: '',
      icon: 'loading'
    })
  },

  applyfail() {
    wx.showToast({
      title: '网络繁忙，请稍后重试', // 弹出窗口
      icon: 'none',
      duration: 2000
    })
  },

  ClosedPage() {
    wx.showToast({
      icon: 'none',
      title: '即将开放，敬请关注',
      duration: 3000
    })
  },

  toastLoading(message = '加载中', selector = '#van-toast') {
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message,
      selector
    })
  },

  toastFailed(message, duration = 1000, selector = '#van-toast') {
    Toast.fail({
      duration,
      forbidClick: true,
      message,
      selector
    })
  },

  toastSuccess(message, duration = 1000, selector = '#van-toast') {
    Toast.success({
      duration,
      forbidClick: true,
      message,
      selector
    })
  },

  toastClear() {
    Toast.clear()
  },

  async wxlogin() {
    try {
      const code = await this.wxLoginPromise()
      const openid = await this.fetchopenidPromise(code)
      await this.fetctuserinfoPromise(openid)
    } catch (error) {
      console.log(error)
    }
  },

  wxLoginPromise() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res.code)
        },
        fail: (err) => {
          reject(err)
          this.toastFailed('获取数据失败')
        },
        complete: () => {
          this.toastClear()
        }
      })
    })
  },

  fetchopenidPromise(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.api.loginUrl + 'UserInfo10359.ashx?rand=' + Math.random(),
        data: {
          action: 'openid',
          appid: this.api.appId,
          js_code: code,
          grant_typ: 'authorization_code'
        },
        header: {
          'content-type': 'json'
        },
        success(res) {
          resolve(res.data.openid)
        },
        fail(err) {
          reject(err)
          wx.showToast({
            title: '网络错误，请稍后重试2',
            icon: 'none',
            duration: 3000
          })
        },
        complete() {}
      })
    })
  },

  fetctuserinfoPromise(openid) {
    const { Graduate } = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.api.loginUrl + 'UserInfo10359.ashx?rand=' + Math.random(),
        data: {
          action: 'checkuser',
          openid: openid,
          userkind: 1
        },
        method: 'get',
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          if (res.data.count == 1) {
            // 用户已绑定
            Graduate.openid = openid
            Graduate.year = res.data.year
            Graduate.code = res.data.code
            Graduate.college = res.data.college
            Graduate.gid = res.data.gid
            Graduate.education = res.data.education
            Graduate.discipline = res.data.discipline
            Graduate.disciplineName = res.data.disciplineName
            Graduate.name = res.data.name
            Graduate.photo = res.data.photo

            Graduate.jobinfo = res.data.jobinfo
            Graduate.market = res.data.market
            Graduate.opened = res.data.opened
            Graduate.automatic = res.data.automatic

            console.log(Graduate)
            // 重新设置缓存
            wx.setStorageSync('Graduate', Graduate)
          } else if (res.data.count == 2) {
            //  多个用户，学号重复
            wx.showModal({
              title: '提示',
              content: '系统内学号重复，请联系管理员老师'
            })
          } else if (res.data.count == 0) {
            // 不存在
            // 当前用户没有注册，跳转到绑定页面
            wx.redirectTo({
              url:
                '/pages/binduser/index?openid=' +
                openid +
                '&rand=' +
                Math.random()
            })
          }
          resolve()
        },
        fail(err) {
          reject(err)
          wx.showToast({
            title: '网络错误，请稍后重试3',
            icon: 'none',
            duration: 3000
          })
        },
        complete() {}
      })
    })
  },

  // 数据字典
  objectEducationArray: [
    {
      id: 0,
      name: ''
    },
    {
      id: 101,
      name: '博士研究生'
    },
    {
      id: 111,
      name: '硕士研究生'
    },
    {
      id: 231,
      name: '本科'
    },
    {
      id: 341,
      name: '专科'
    },
    {
      id: 361,
      name: '高职（专科）'
    }
  ],
  objectStyleArray: [
    {
      id: 1,
      name: '普通师范生'
    },
    {
      id: 2,
      name: '非师范生'
    }
  ],
  objectSexArray: [
    {
      id: 1,
      name: '男'
    },
    {
      id: 2,
      name: '女'
    }
  ],

  objectisYXSArray: [
    {
      id: 1,
      name: '男'
    },
    {
      id: 2,
      name: '女'
    }
  ],
  objectTrainwayArray: [
    {
      id: 1,
      name: '非定向'
    },
    {
      id: 2,
      name: '定向'
    },
    {
      id: 3,
      name: '在职'
    },
    {
      id: 4,
      name: '委培'
    },
    {
      id: 5,
      name: '自筹'
    }
  ],
  objectNationArray: [
    {
      id: 1,
      name: '汉族'
    },
    {
      id: 2,
      name: '蒙古族'
    },
    {
      id: 3,
      name: '回族'
    },
    {
      id: 4,
      name: '藏族'
    },
    {
      id: 5,
      name: '维吾尔族'
    },
    {
      id: 6,
      name: '苗族'
    },
    {
      id: 7,
      name: '彝族'
    },
    {
      id: 8,
      name: '壮族'
    },
    {
      id: 9,
      name: '布依族'
    },
    {
      id: 10,
      name: '朝鲜族'
    },
    {
      id: 11,
      name: '满族'
    },
    {
      id: 12,
      name: '侗族'
    },
    {
      id: 13,
      name: '瑶族'
    },
    {
      id: 14,
      name: '白族'
    },
    {
      id: 15,
      name: '土家族'
    },
    {
      id: 16,
      name: '哈尼族'
    },
    {
      id: 17,
      name: '哈萨克族'
    },
    {
      id: 18,
      name: '傣族'
    },
    {
      id: 19,
      name: '黎族'
    },
    {
      id: 20,
      name: '傈傈族'
    },
    {
      id: 21,
      name: '佤族'
    },
    {
      id: 22,
      name: '畲族'
    },
    {
      id: 23,
      name: '高山族'
    },
    {
      id: 24,
      name: '拉祜族'
    },
    {
      id: 25,
      name: '水族'
    },
    {
      id: 26,
      name: '东乡族'
    },
    {
      id: 27,
      name: '纳西族'
    },
    {
      id: 28,
      name: '景颇族'
    },
    {
      id: 29,
      name: '柯尔克孜族'
    },
    {
      id: 30,
      name: '土族'
    },
    {
      id: 31,
      name: '达斡尔族'
    },
    {
      id: 32,
      name: '仫佬族'
    },
    {
      id: 33,
      name: '羌族'
    },
    {
      id: 34,
      name: '布朗族'
    },
    {
      id: 35,
      name: '撒拉族'
    },
    {
      id: 36,
      name: '毛难族'
    },
    {
      id: 37,
      name: '仡佬族'
    },
    {
      id: 38,
      name: '锡伯族'
    },
    {
      id: 39,
      name: '阿昌族'
    },
    {
      id: 40,
      name: '普米族'
    },
    {
      id: 41,
      name: '塔吉克族'
    },
    {
      id: 42,
      name: '怒族'
    },
    {
      id: 43,
      name: '乌孜别克族'
    },
    {
      id: 44,
      name: '俄罗斯族'
    },
    {
      id: 45,
      name: '鄂温克族'
    },
    {
      id: 46,
      name: '崩龙族'
    },
    {
      id: 47,
      name: '保安族'
    },
    {
      id: 48,
      name: '裕固族'
    },
    {
      id: 49,
      name: '京族'
    },
    {
      id: 50,
      name: '塔塔尔族'
    },
    {
      id: 51,
      name: '独龙族'
    },
    {
      id: 52,
      name: '鄂伦春族'
    },
    {
      id: 53,
      name: '赫哲族'
    },
    {
      id: 54,
      name: '门巴族'
    },
    {
      id: 55,
      name: '珞巴族'
    },
    {
      id: 56,
      name: '基诺族'
    },
    {
      id: 97,
      name: '其他'
    },
    {
      id: 98,
      name: '外国血统中国籍人士'
    }
  ],
  objectPoliticalArray: [
    {
      id: 1,
      name: '中共党员'
    },
    {
      id: 2,
      name: '中共预备党员'
    },
    {
      id: 3,
      name: '共青团员'
    },
    {
      id: 4,
      name: '民革会员'
    },
    {
      id: 5,
      name: '民盟盟员'
    },
    {
      id: 6,
      name: '民建会员'
    },
    {
      id: 7,
      name: '民进会员'
    },
    {
      id: 8,
      name: '农工党党员'
    },
    {
      id: 9,
      name: '致公党党员'
    },
    {
      id: 10,
      name: '九三学社社员'
    },
    {
      id: 11,
      name: '台盟盟员'
    },
    {
      id: 12,
      name: '无党派民主人士'
    },
    {
      id: 13,
      name: '群众'
    }
  ],
  objectComefromArray: [
    {
      id: 1,
      name: '(空)'
    },
    {
      id: 2,
      name: '城镇'
    },
    {
      id: 3,
      name: '农村'
    }
  ],

  objectisYXSArray: [
    {
      id: 1,
      name: '是'
    },
    {
      id: 2,
      name: '否'
    }
  ],

  objectChangIntoArray: [
    {
      id: 1,
      name: '已转入'
    },
    {
      id: 2,
      name: '未转入'
    }
  ],

  objectSkillkindArray: [
    {
      id: 1,
      name: '语言类'
    },
    {
      id: 2,
      name: '软件类'
    },
    {
      id: 3,
      name: '技能类'
    },
    {
      id: 4,
      name: '活动类'
    }
  ],

  objectDisadvantagedArray: [
    {
      id: 0,
      name: '非困难生'
    },
    {
      id: 1,
      name: '就业困难'
    },
    {
      id: 2,
      name: '家庭困难'
    },
    {
      id: 3,
      name: '就业困难和家庭困难'
    },
    {
      id: 4,
      name: '残疾'
    },
    {
      id: 5,
      name: '就业困难和残疾'
    },
    {
      id: 6,
      name: '家庭困难和残疾'
    },
    {
      id: 7,
      name: '就业困难、家庭困难和残疾'
    }
  ],

  objectDirectionArray: [
    {
      id: 10,
      name: '签就业协议形式就业'
    },
    {
      id: 11,
      name: '签劳动合同形式就业'
    },
    {
      id: 12,
      name: '其他录用形式就业'
    },
    {
      id: 27,
      name: '科研助理'
    },
    {
      id: 46,
      name: '应征义务兵'
    },
    {
      id: 50,
      name: '国家基层项目'
    },
    {
      id: 51,
      name: '地方基层项目'
    },
    {
      id: 70,
      name: '待就业'
    },
    {
      id: 71,
      name: '不就业拟升学'
    },
    {
      id: 72,
      name: '其他暂不就业'
    },
    {
      id: 75,
      name: '自主创业'
    },
    {
      id: 76,
      name: '自由职业'
    },
    {
      id: 80,
      name: '升学'
    },
    {
      id: 81,
      name: '升学(非全日制)'
    },
    {
      id: 82,
      name: '升学(规陪)'
    },
    {
      id: 85,
      name: '出国、出境'
    }
  ],

  objectUnitPropertyArray: [
    {
      id: 10,
      name: '机关'
    },
    {
      id: 20,
      name: '科研设计单位'
    },
    {
      id: 21,
      name: '高等教育单位'
    },
    {
      id: 22,
      name: '中初教育单位'
    },
    {
      id: 23,
      name: '医疗卫生单位'
    },
    {
      id: 29,
      name: '其他事业单位'
    },
    {
      id: 31,
      name: '国有企业'
    },
    {
      id: 32,
      name: '三资企业'
    },
    {
      id: 39,
      name: '其他企业'
    },
    {
      id: 40,
      name: '部队'
    },
    {
      id: 55,
      name: '农村建制村'
    },
    {
      id: 56,
      name: '城镇社区'
    }
  ],

  objectIndustryArray: [
    {
      id: 11,
      name: '农、林、牧、渔业'
    },
    {
      id: 21,
      name: '采矿业'
    },
    {
      id: 22,
      name: '制造业'
    },
    {
      id: 23,
      name: '电力、热力、燃气及水生产和供应业'
    },
    {
      id: 24,
      name: '建筑业'
    },
    {
      id: 31,
      name: '批发和零售业'
    },
    {
      id: 32,
      name: '交通运输、仓储和邮政业'
    },
    {
      id: 33,
      name: '住宿和餐饮业'
    },
    {
      id: 34,
      name: '信息传输、软件和信息技术服务业'
    },
    {
      id: 35,
      name: '金融业'
    },
    {
      id: 36,
      name: '房地产业'
    },
    {
      id: 37,
      name: '租赁和商务服务业'
    },
    {
      id: 38,
      name: '科学研究和技术服务业'
    },
    {
      id: 39,
      name: '水利、环境和公共设施管理业'
    },
    {
      id: 41,
      name: '居民服务、修理和其他服务业'
    },
    {
      id: 42,
      name: '教育'
    },
    {
      id: 43,
      name: '卫生和社会工作'
    },
    {
      id: 44,
      name: '文化、体育和娱乐业'
    },
    {
      id: 45,
      name: '公共管理、社会保障和社会组织'
    },
    {
      id: 46,
      name: '国际组织'
    },
    {
      id: 80,
      name: '军队'
    }
  ],

  objectPostArray: [
    {
      id: 10,
      name: '公务员'
    },
    {
      id: 11,
      name: '科学研究人员'
    },
    {
      id: 13,
      name: '工程技术人员'
    },
    {
      id: 17,
      name: '农林牧渔业技术人员'
    },
    {
      id: 19,
      name: '卫生专业技术人员'
    },
    {
      id: 21,
      name: '经济业务人员'
    },
    {
      id: 22,
      name: '金融业务人员'
    },
    {
      id: 23,
      name: '法律专业人员'
    },
    {
      id: 24,
      name: '教学人员'
    },
    {
      id: 25,
      name: '文学艺术工作人员'
    },
    {
      id: 26,
      name: '体育工作人员'
    },
    {
      id: 27,
      name: '新闻出版和文化工作人员'
    },
    {
      id: 29,
      name: '其他专业技术人员'
    },
    {
      id: 30,
      name: '办事人员和有关人员'
    },
    {
      id: 40,
      name: '商业和服务业人员'
    },
    {
      id: 60,
      name: '生产和运输设备操作人员'
    },
    {
      id: 80,
      name: '军人'
    },
    {
      id: 90,
      name: '其他人员'
    }
  ],

  objectSalaryArray: [
    {
      id: 1,
      name: '面议'
    },
    {
      id: 2,
      name: '3000-5000'
    },
    {
      id: 3,
      name: '5000-7000'
    },
    {
      id: 4,
      name: '7000-10000'
    },
    {
      id: 5,
      name: '10000-15000'
    },
    {
      id: 6,
      name: '15000-20000'
    },
    {
      id: 7,
      name: '20000以上'
    }
  ],

  objectLimitDateArray: [
    {
      id: 1,
      name: '随时报到'
    },
    {
      id: 2,
      name: '一周内'
    },
    {
      id: 3,
      name: '二周内'
    },
    {
      id: 4,
      name: '三周内'
    },
    {
      id: 5,
      name: '一月内'
    },
    {
      id: 6,
      name: '暂时无法确定'
    },
    {
      id: 7,
      name: '俩月内'
    },
    {
      id: 8,
      name: '半年内'
    },
    {
      id: 9,
      name: '更长时间'
    }
  ],

  objectFromKindArray: [
    {
      id: 1,
      name: '学院安排'
    },
    {
      id: 2,
      name: '个人途径'
    }
  ],

  objectLiveInArray: [
    {
      id: 1,
      name: '校外住宿'
    },
    {
      id: 2,
      name: '校内住宿'
    }
  ],

  objectCollegeArray: [
    {
      id: 10000,
      name: '请选择院校'
    },
    {
      id: 10358,
      name: '中国科学技术大学'
    },
    {
      id: 10357,
      name: '安徽大学'
    },
    {
      id: 10366,
      name: '安徽医科大学'
    },
    {
      id: 13613,
      name: '安徽信息工程学院'
    },
    {
      id: 10361,
      name: '安徽理工大学'
    },
    {
      id: 10378,
      name: '安徽财经大学'
    },
    {
      id: 13611,
      name: '安徽财经大学商学院'
    },
    {
      id: 13845,
      name: '安徽财贸职业学院'
    },
    {
      id: 14341,
      name: '安徽长江职业学院'
    },
    {
      id: 13338,
      name: '安徽城市管理职业学院'
    },
    {
      id: 13612,
      name: '安徽大学江淮学院'
    },
    {
      id: 13336,
      name: '安徽电气工程职业技术学院'
    },
    {
      id: 12814,
      name: '安徽电子信息职业技术学院'
    },
    {
      id: 10363,
      name: '安徽工程大学'
    },
    {
      id: 12811,
      name: '安徽工贸职业技术学院'
    },
    {
      id: 13340,
      name: '安徽工商职业学院'
    },
    {
      id: 10360,
      name: '安徽工业大学'
    },
    {
      id: 13614,
      name: '马鞍山学院'
    },
    {
      id: 12334,
      name: '安徽工业经济职业技术学院'
    },
    {
      id: 13852,
      name: '安徽工业职业技术学院'
    },
    {
      id: 13847,
      name: '安徽公安职业学院'
    },
    {
      id: 13062,
      name: '安徽广播影视职业技术学院'
    },
    {
      id: 13344,
      name: '安徽国防科技职业学院'
    },
    {
      id: 13846,
      name: '安徽国际商务职业学院'
    },
    {
      id: 14378,
      name: '安徽黄梅戏艺术职业学院'
    },
    {
      id: 13339,
      name: '安徽机电职业技术学院'
    },
    {
      id: 10878,
      name: '安徽建筑大学'
    },
    {
      id: 13615,
      name: '安徽建筑大学城市建设学院'
    },
    {
      id: 12816,
      name: '安徽交通职业技术学院'
    },
    {
      id: 50581,
      name: '安徽经济管理干部学院'
    },
    {
      id: 12219,
      name: '安徽警官职业学院'
    },
    {
      id: 10879,
      name: '安徽科技学院'
    },
    {
      id: 14229,
      name: '安徽矿业职业技术学院'
    },
    {
      id: 14418,
      name: '安徽粮食工程职业学院'
    },
    {
      id: 13848,
      name: '安徽林业职业技术学院'
    },
    {
      id: 14165,
      name: '安徽旅游职业学院'
    },
    {
      id: 14133,
      name: '安徽绿海商务职业学院'
    },
    {
      id: 10364,
      name: '安徽农业大学'
    },
    {
      id: 13616,
      name: '安徽农业大学经济技术学院'
    },
    {
      id: 14298,
      name: '安徽汽车职业技术学院'
    },
    {
      id: 10959,
      name: '安徽三联学院'
    },
    {
      id: 12072,
      name: '安徽商贸职业技术学院'
    },
    {
      id: 14132,
      name: '安徽涉外经济职业学院'
    },
    {
      id: 13849,
      name: '安徽审计职业学院'
    },
    {
      id: 10370,
      name: '安徽师范大学'
    },
    {
      id: 13617,
      name: '安徽师范大学皖江学院'
    },
    {
      id: 12073,
      name: '安徽水利水电职业技术学院'
    },
    {
      id: 12817,
      name: '安徽体育运动职业技术学院'
    },
    {
      id: 13065,
      name: '安徽外国语学院'
    },
    {
      id: 14419,
      name: '安徽卫生健康职业学院'
    },
    {
      id: 12810,
      name: '安徽文达信息工程学院'
    },
    {
      id: 14210,
      name: '安徽现代信息工程职业学院'
    },
    {
      id: 12216,
      name: '安徽新华学院'
    },
    {
      id: 13850,
      name: '安徽新闻出版职业技术学院'
    },
    {
      id: 14342,
      name: '安徽扬子职业技术学院'
    },
    {
      id: 13337,
      name: '安徽冶金科技职业学院'
    },
    {
      id: 13618,
      name: '安徽医科大学临床医学院'
    },
    {
      id: 12925,
      name: '安徽医学高等专科学校'
    },
    {
      id: 13346,
      name: '安徽艺术职业学院'
    },
    {
      id: 13851,
      name: '安徽邮电职业技术学院'
    },
    {
      id: 10869,
      name: '安徽职业技术学院'
    },
    {
      id: 13341,
      name: '安徽中澳科技职业学院'
    },
    {
      id: 10369,
      name: '安徽中医药大学'
    },
    {
      id: 12924,
      name: '安徽中医药高等专科学校'
    },
    {
      id: 10372,
      name: '安庆师范大学'
    },
    {
      id: 14096,
      name: '安庆医药高等专科学校'
    },
    {
      id: 13345,
      name: '安庆职业技术学院'
    },
    {
      id: 14137,
      name: '蚌埠经济技术职业学院'
    },
    {
      id: 11305,
      name: '蚌埠学院'
    },
    {
      id: 10367,
      name: '蚌埠医学院'
    },
    {
      id: 12926,
      name: '亳州学院'
    },
    {
      id: 13343,
      name: '亳州职业技术学院'
    },
    {
      id: 10380,
      name: '巢湖学院'
    },
    {
      id: 11306,
      name: '池州学院'
    },
    {
      id: 13060,
      name: '池州职业技术学院'
    },
    {
      id: 14297,
      name: '滁州城市职业学院'
    },
    {
      id: 10377,
      name: '滁州学院'
    },
    {
      id: 13059,
      name: '滁州职业技术学院'
    },
    {
      id: 13342,
      name: '阜阳科技职业学院'
    },
    {
      id: 10371,
      name: '阜阳师范大学'
    },
    {
      id: 13619,
      name: '阜阳师范大学信息工程学院'
    },
    {
      id: 14536,
      name: '阜阳幼儿师范高等专科学校'
    },
    {
      id: 12074,
      name: '阜阳职业技术学院'
    },
    {
      id: 13064,
      name: '合肥滨湖职业技术学院'
    },
    {
      id: 14058,
      name: '合肥财经职业学院'
    },
    {
      id: 10359,
      name: '合肥工业大学'
    },
    {
      id: 14135,
      name: '合肥共达职业技术学院'
    },
    {
      id: 12815,
      name: '合肥经济技术职业学院'
    },
    {
      id: 14420,
      name: '合肥科技职业学院'
    },
    {
      id: 14098,
      name: '合肥师范学院'
    },
    {
      id: 12410,
      name: '合肥通用职业技术学院'
    },
    {
      id: 14230,
      name: '合肥信息技术职业学院'
    },
    {
      id: 11059,
      name: '合肥学院'
    },
    {
      id: 14330,
      name: '合肥幼儿师范高等专科学校'
    },
    {
      id: 13058,
      name: '合肥职业技术学院'
    },
    {
      id: 14203,
      name: '皖江工学院'
    },
    {
      id: 10373,
      name: '淮北师范大学'
    },
    {
      id: 13620,
      name: '淮北师范大学信息学院'
    },
    {
      id: 10963,
      name: '淮北职业技术学院'
    },
    {
      id: 11308,
      name: '淮南联合大学'
    },
    {
      id: 10381,
      name: '淮南师范学院'
    },
    {
      id: 12220,
      name: '淮南职业技术学院'
    },
    {
      id: 10375,
      name: '黄山学院'
    },
    {
      id: 14296,
      name: '黄山职业技术学院'
    },
    {
      id: 14191,
      name: '徽商职业学院'
    },
    {
      id: 12813,
      name: '六安职业技术学院'
    },
    {
      id: 82604,
      name: '马鞍山矿山研究院'
    },
    {
      id: 13760,
      name: '马鞍山师范高等专科学校'
    },
    {
      id: 14192,
      name: '马鞍山职业技术学院'
    },
    {
      id: 10379,
      name: '宿州学院'
    },
    {
      id: 12812,
      name: '宿州职业技术学院'
    },
    {
      id: 14273,
      name: '桐城师范高等专科学校'
    },
    {
      id: 10383,
      name: '铜陵学院'
    },
    {
      id: 12217,
      name: '铜陵职业技术学院'
    },
    {
      id: 14502,
      name: '皖北卫生职业学院'
    },
    {
      id: 10368,
      name: '皖南医学院'
    },
    {
      id: 14299,
      name: '皖西卫生职业学院'
    },
    {
      id: 10376,
      name: '皖西学院'
    },
    {
      id: 12218,
      name: '万博科技职业学院'
    },
    {
      id: 11061,
      name: '芜湖职业技术学院'
    },
    {
      id: 13061,
      name: '宣城职业技术学院'
    },
    {
      id: 80168,
      name: '中国科学院合肥物质科学研究院'
    }
  ],

  objectProvinceArray: [
    {
      id: 110000,
      name: '北京市'
    },
    {
      id: 120000,
      name: '天津市'
    },
    {
      id: 130000,
      name: '河北省'
    },
    {
      id: 140000,
      name: '山西省'
    },
    {
      id: 150000,
      name: '内蒙古'
    },
    {
      id: 210000,
      name: '辽宁省'
    },
    {
      id: 220000,
      name: '吉林省'
    },
    {
      id: 230000,
      name: '黑龙江省'
    },
    {
      id: 310000,
      name: '上海市'
    },
    {
      id: 320000,
      name: '江苏省'
    },
    {
      id: 330000,
      name: '浙江省'
    },
    {
      id: 340000,
      name: '安徽省'
    },
    {
      id: 350000,
      name: '福建省'
    },
    {
      id: 360000,
      name: '江西省'
    },
    {
      id: 370000,
      name: '山东省'
    },
    {
      id: 410000,
      name: '河南省'
    },
    {
      id: 420000,
      name: '湖北省'
    },
    {
      id: 430000,
      name: '湖南省'
    },
    {
      id: 440000,
      name: '广东省'
    },
    {
      id: 450000,
      name: '广西'
    },
    {
      id: 460000,
      name: '海南省'
    },
    {
      id: 500000,
      name: '重庆市'
    },
    {
      id: 510000,
      name: '四川省'
    },
    {
      id: 520000,
      name: '贵州省'
    },
    {
      id: 530000,
      name: '云南省'
    },
    {
      id: 540000,
      name: '西藏'
    },
    {
      id: 610000,
      name: '陕西省'
    },
    {
      id: 620000,
      name: '甘肃省'
    },
    {
      id: 630000,
      name: '青海省'
    },
    {
      id: 640000,
      name: '宁夏'
    },
    {
      id: 650000,
      name: '新疆'
    },
    {
      id: 710000,
      name: '台湾省'
    },
    {
      id: 810000,
      name: '香港'
    },
    {
      id: 820000,
      name: '澳门'
    }
  ]
})
