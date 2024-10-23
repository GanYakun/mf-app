// businesscard/agent_detail/agent-detail.js
var app = getApp()
var api = require("../../utils/api.js")
import {
  calculationfun
} from '../../utils/Heightset' //es6
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: 0,
    startDate: '',
    endDate: '',
    list: [],
    showStepFormView: false,
    page: 1,
    rows: 12,
    createDate: '',
    choose: 0,
    dataDictionaryData: '',
    newCount: '',
    type: '',
    typename: '',
    name: '',
    tel: '',
    nick: '',
    phone: '',
    cjcount: '',
    applybrokerdate: '',
    indexs: 0,
    xindex:0,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var nick = options.nick
    var phone = options.phone
    var cjcount = options.cjcount == 'null' ? '0' : options.cjcount
    var applybrokerdate = options.applybrokerdate
    var id = options.id
    var navHeight = calculationfun.constructors()
    this.setData({
      navHeight: navHeight.navHeight,
      nick: nick,
      phone: phone,
      cjcount: cjcount,
      applybrokerdate: applybrokerdate,
      id:id
    })
    // this.dataDiction()
    this.first()
  },
  // 数据字典
  // dataDiction: function () {
  //   var that = this
  //   let token = app.globalData.token
  //   let data = {
  //     typegroupCode: 'crm_mqzt'
  //   }
  //   let header = {
  //     'content-type': 'application/json',
  //     'X-AUTH-TOKEN': token
  //   }
  //   api.xget('/rest/dataDictionaryApi/dataDictionary', data, 'GET', header, function (e) {
  //     console.log(e, 'eeeee')
  //     var code = e.code
  //     if (code == '200') {
  //       let data = {
  //         typename: '请选择',
  //         typecode: ''
  //       }
  //       let dataDictionaryData = e.data
  //       dataDictionaryData.unshift(data)
  //       that.setData({
  //         dataDictionaryData: dataDictionaryData,
  //         typename: dataDictionaryData[0].typename
  //       })
  //     }
  //   })
  
  // },
//  首先加载
  first: function () {
    var that = this
    var page = that.data.page
    var rows = that.data.rows
    let token = app.globalData.token
    var id = that.data.id
    let data = {
      memberId:id
    }
    api.newget('/rest/memberCenter/getMyCustomerList?page='+page+'&rows='+ rows ,data, 'POST', function (e) {
      console.log(e, 'eeeee')
      var code = e.code
      if (code == '200') {
        var newCount = e.data.newCount
        var getMyCustomerListData = e.data.list
        if (getMyCustomerListData.length > 0) {
          for (var i = 0; i < getMyCustomerListData.length; i++) {
            var time = getMyCustomerListData[i].createDate
            var createDateArr = time.split(' ')
            var createDate = createDateArr[0]
            console.log(createDate, 'createDate')
            that.setData({
              createDate: createDate,
            })
          }
        }
        that.setData({
          list: getMyCustomerListData,
          newCount: newCount
        })
      }

    })
  },
  // 筛选弹框
  screen: function (e) {
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateX(300).step()
    that.setData({
      animationData: animation.export(),
    })
    var timer = setTimeout(function () {
      animation.translateX(0).step()
      that.setData({
        animationData: animation.export()
      })
      clearTimeout(timer)
    }.bind(that), 200)
    console.log(e.currentTarget.dataset.mask)
    var mask = e.currentTarget.dataset.mask
    that.setData({
      mask: mask
    })
  },
  // 开始时间选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  // 结束时间选择
  bindDateChanges: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
 
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  
  close: function (e) {
    var that = this
    var mask = e.currentTarget.dataset.mask
    that.setData({
      mask: mask
    })
  },

  isChoose: function (e) {
    var that = this
    var choose = that.data.choose
    that.setData({
      choose: !choose
    })
  },


  // 选择
  choose: function (e) {
    console.log(e)
    var that = this
    var id = that.data.id
    var choose = e.currentTarget.dataset.choose
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var typename = e.currentTarget.dataset.typename
    var page = that.data.page
    var rows = that.data.rows
    that.setData({
      type: type,
      typename: typename,
      indexs: index,
      choose: choose
    })
    let token = app.globalData.token
    let data = {
      customerStatus: type,
      memberId:id,
    }
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': token
    }
    api.xpost('/rest/memberCenter/getMyCustomerList?page='+page+'&rows='+ rows, data, 'POST', header, function (e) {
      console.log(e, 'eeeee')
      var code = e.code
      if (code == '200') {
        var getMyCustomerListData = e.data.list
        if (getMyCustomerListData.length > 0) {
          for (var i = 0; i < getMyCustomerListData.length; i++) {
            var time = getMyCustomerListData[i].createDate
            var createDateArr = time.split(' ')
            var createDate = createDateArr[0]
            console.log(createDate, 'createDate')
            that.setData({
              createDate: createDate,
            })
          }
        }
        that.setData({
          list: getMyCustomerListData,
        })
      }
    })
  },


  // 筛选
  finish: function (e) {
    var mask = e.currentTarget.dataset.mask
    var that = this
    var id = that.data.id
    that.setData({
      mask: mask
    })
    var page = that.data.page
    var rows = that.data.rows
    let token = app.globalData.token
    var name = that.data.name
    var tel = that.data.tel
    var startDate = that.data.startDate
    var endDate = that.data.endDate
    let data = {
      memberId:id,
      name: name,
      tel: tel,
      createDateStart: startDate,
      createDateEnd: endDate
    }
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': token
    }
    api.xpost('/rest/memberCenter/getMyCustomerList?page='+page+'&rows='+ rows, data, 'POST', header, function (e) {
      console.log(e, 'eeeee')
      var code = e.code
      if (code == '200') {
        var getMyCustomerListData = e.data.list
        if (getMyCustomerListData.length > 0) {
          for (var i = 0; i < getMyCustomerListData.length; i++) {
            var time = getMyCustomerListData[i].createDate
            var createDateArr = time.split(' ')
            var createDate = createDateArr[0]
            console.log(createDate, 'createDate')
            that.setData({
              createDate: createDate,
            })
          }
        }
        that.setData({
          list: getMyCustomerListData,
        })
      }
      // that.setData({
      //   name: '',
      //   tel: '',
      //   createDateStart: '',
      //   createDateEnd: ''
      // })
    })
  },

  //切换报名客户和领券客户
  onTap: function (e) {
    var that = this
    this.setData({
      xindex: e.currentTarget.dataset.index
    })

    if(e.currentTarget.dataset.index==1){
      let data = {
        recommenderId: that.data.id
      }
      api.newget('/rest/memberCenter/getCustomerList?start=' + 1 + '&pageSize=' + 12, data, 'POST', function (e) {
        if (e) {
          that.setData({
            Collectcoupons:e.data.list
          })
        } else {
          wx.showToast({
            title: e.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },

  
   //报名客户的分页
   lower: function () {
    var that = this;
    var result = that.data.list
    var page = that.data.page + 1;
    var rows = that.data.rows
    var id = that.data.id
    let data = {
      memberId:id
    }
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': app.globalData.token
    }
    api.xpost('/rest/memberCenter/getMyCustomerList?page='+page+'&rows='+ rows ,data, 'POST', header, function (e) {
      console.log(e.data)
      if (e.code == '200') {
        var mydata = e.data.list;
        if (mydata.length > 0) {
          // wx.showLoading({
          //   title: '加载中',
          //   icon: 'loading',
          // });
        var timer =   setTimeout(() => {
            that.setData({
              list: result.concat(mydata),
              page: page
            });
            wx.hideLoading();
            clearTimeout(timer)
          }, 1500)
          return false;
        } else {
          wx.showToast({
            title: '没有数据了',
            duration: 300,
            icon: 'none'
          });
        }
      }
    })

  },
  // 领券客户的分页
  receivelower:function(){
    var that = this
    let data = {
      recommenderId: app.globalData.ordinarymemberid
    }
    var nextPage = that.data.receivestart
    if(that.data.receivewebNextPage){
      nextPage+1 
    }
    else{
      wx.showToast({
        title: '最后一页了～',
        icon:'none',
        duration:1000
      })
      return false
    }
    api.newget('/rest/memberCenter/getCustomerList?start=' + nextPage + '&pageSize=' + 12, data, 'POST', function (e) {
      if (e) {
        that.setData({
          Collectcoupons:that.data.Collectcoupons.concat(e.data.list),
          receivewebNextPage:e.data.webNextPage,
          receivestart:nextPage
        })
      } else {
        wx.showToast({
          title: e.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  
  },


  //点击经纪人的查看经纪人的客户
  clickOrder:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '../order_detail/order_detail?clickMessage='+JSON.stringify(e.currentTarget.dataset.clickmessage),
    })

  },



  //重置数据
  reset:function(){
    var that = this
    that.setData({
      startDate:'',
      endDate:'',
      name:'',
      tel:''
    })
  },

  // 拨打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },
})