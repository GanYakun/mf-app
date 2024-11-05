let utils = require("../../utils/utils.js")
let { GetPeriod } = require("../../utils/getTime.js")
var api = require("../../utils/api.js")
var mfApi = require("../../utils/mfApi.js")
const { getDataDictionary } = require("../../http/config.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: true,
    qcappnoshare: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myDate = new Date()
    myDate.setDate(myDate.getDate() - 1)
    let myyear = myDate.getFullYear() + 1;
    let mymonth = myDate.getMonth() + 1;
    let myweekday = myDate.getDate();
    let type = "";
    myDate = [myyear, mymonth, myweekday].map(this.formatNumber).join('-');
    console.log(myDate)
    var that = this
    console.log("页面加载", options)
    console.log('扫描二维码进入传第的参数', decodeURIComponent(options.q))
    console.log("index 生命周期 onload" + JSON.stringify(options))
    //在此函数中获取扫描普通链接二维码参数
    if (options.q) {
      let q = decodeURIComponent(options.q);
      let memberId = utils.getQueryString(q, 'memberId');
      let name = utils.getQueryString(q, 'name')
      type = utils.getQueryString(q, 'type')
      console.log("成为经纪人id", memberId)
      console.log("推荐人的名字", name)
      console.log("推荐人的类型", type)
      this.setData({
        memberId: memberId,
        name: name,
        myDate: myDate
      })
    } else if (options.PageType == 'poster') {
      this.setData({
        memberId: options.memberId,
        name: options.name
      })
    } else {
      wx.showToast({
        title: '未知错误',
        icon: 'none',
        duration: 1000
      })
    }
    var dataziding = {
      newsClassId: 230,
      objectId: 193
    }
    // api.request('/rest/newsClass/getModel', dataziding, 'GET', function (e) {
    //   that.setData({
    //     introduce: e.data.contentWap
    //   })
    // })

    if (type === "0") {
      mfApi.request('/program/agent/protocol/getPersonal', null, 'GET', function (e) {
        that.setData({
          introduce: e.data.content
        })
      })
    } else {
      mfApi.request('/program/agent/protocol/getOrg', null, 'GET', function (e) {
        that.setData({
          introduce: e.data.content
        })
      })
    }



    //查询是否已经是经纪人
    // let data={}
    // let memberIds = that.data.memberId
    // api.newget('/rest/memberCenter/applyBroker?memberId='+memberIds, data, 'POST', function (e) {
    //   console.log('成为经济人接口返回的数据',e)
    //   if(e.code==500){
    //    wx.showToast({
    //      title: e.message,
    //      icon:'none',
    //      duration:1000
    //    })
    //   }
    //   else if(e.code == 200){
    //     wx.showToast({
    //       title: e.message,
    //       icon:'none',
    //       duration:1000
    //     })
    //   }
    //   else if(e.code == 201){
    //     console.log("进入code==201的方法")
    //     let usertime = e.data.applyBrokerDate.split("-")
    //     console.log(usertime)
    //     let usermessageTime = usertime[0]+"年"+usertime[1]+"月"+usertime[2].substring(0,2)+"日"
    //     that.setData({
    //       usermessage:e.data,
    //       usermessageTime:usermessageTime,
    //       isshow:false
    //     })
    //   }
    //   else if(e.code == 406){

    //   }
    //   else{
    //     wx.showToast({
    //       title: 未知错误,
    //       icon:'none',
    //       duration:1000
    //     })
    //   }

    //   })


  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  //下一步
  nextStep() {
    if (app.globalData.isBroker == 1) {
      app.showToastMessage('您已是经纪人')
      return
    }
    this.setData({
      hideConBox: true
    })
  },

  submit() {
    console.log('提交按钮')
  },

  //页面展示
  onshow: function (options) {
    console.log("监听页面展示", options)
    var timer = setTimeout(() => {
      wx.hideShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
      })
      clearTimeout(timer)
    }, 3000)

  },
  onReady() {
    //     //设置当前页面不可转发
    // wx.hideShareMenu({
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
  },

  // else if(!fromValue.accountName){
  //   app.showToastMessage('请输入开户名称')
  //   return
  // }else if(!fromValue.bankName){
  //   app.showToastMessage('请输入开户银行')
  //   return
  // }else if(!fromValue.bankAccount){
  //   app.showToastMessage('请输入银行账号')
  //   return
  // }
  uploadBuisenessLiceense: function () {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        let data = {
          
        }
        api.xput('/rest/memberCenter/saveBusinessCard', data, 'PUT', header, function (e) {
          console.log(e, 'eeeee')
          if (e.code == 200) {
            wx.showToast({
              title: e.message,
            })
            wx.navigateBack({
              delta: 1,
            })
          }
  
        })
        // wx.uploadFile({
        //   url: app.globalData.upurl + '/rest/memberCenter/imageUpload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success(res) {
        //     const data = res.data
        //     //do something
        //   }
        // })
      }
    })
  },

  //成为经纪人
  become_agent: async function (e) {
    await app.obtaintoken()
    if (!app.globalData.token) {
      app.UserLoginToClick()
      return false
    }
    console.log(e)
    var that = this
    let fromValue = e.detail.value
    let data = fromValue
    if (!fromValue.name) {
      app.showToastMessage('请输入姓名')
      return
    } else if (!fromValue.telephone) {
      app.showToastMessage('请输入电话')
      return
    } else if (fromValue.telephone) {
      let myreg = /^((1[3-9]{1}[0-9]{1})+\d{8})$/
      if (!myreg.test(fromValue.telephone)) {
        app.showToastMessage('电话号码格式不对')
        return
      }
    }
    let memberIds = that.data.memberId || ''
    // let memberIds = 186
    api.newget('/rest/memberCenter/applyBroker?memberId=' + memberIds, data, 'POST', function (e) {
      console.log('成为经济人接口返回的数据', e)
      if (e.code == 500) {
        wx.showToast({
          title: e.message,
          icon: 'none',
          duration: 1000
        })
      } else if (e.code == 200) {
        wx.showToast({
          title: e.message,
          icon: 'none',
          duration: 1000
        })
        this.setData({
          isshow: false,
          isSuccess: true
        })
      } else if (e.code == 201) {
        console.log("进入code==201的方法")
        let usertime = e.data.applyBrokerDate.split("-")
        console.log(usertime)
        let usermessageTime = usertime[0] + "年" + usertime[1] + "月" + usertime[2].substring(0, 2) + "日"
        that.setData({
          usermessage: e.data,
          usermessageTime: usermessageTime,
          isshow: false
        })
      } else if (e.code == 406) {

      } else {
        wx.showToast({
          title: 未知错误,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },


  //   onShareAppMessage(e){
  // console.log(e)
  // wx.showToast({
  //   title: 'hhhhhhh',
  // })
  // return false;
  //   }


})