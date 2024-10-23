import {
  calculationfun
} from '../../utils/Heightset' //es6
// const httpService = require("../../utils/Heightset.js") //commonjs导入 es5
var app = getApp()
var api = require("../../utils/api.js")
import config from "../../http/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toptitle: '我的客户',
    createDate: '',
    list: [],
    newCount: 0,
    page: 1,
    rows: 12,
    memberId: '',
    xindex: 0,
    endDate:'',
    currentdate:'',
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navHeight = calculationfun.constructors()
    var date = new Date()
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var currentdate = date.getFullYear() +'-' + month+'-'+strDate
    this.setData({
      navHeight: navHeight.navHeight,
      currentdate:currentdate
    })
    this.first();
    this.dataDiction()
    
  },


  // 查询报名客户的回调函数
  first: function () {
    var that = this
    var page = that.data.page
    var rows = that.data.rows
    let token = app.globalData.token
    var memberId = app.globalData.ordinarymemberid
    console.log(memberId, 'memberId')
that.setData({
  PageMemberId:memberId
})
    let data = {
      memberId: memberId
    }
    api.newget('/rest/memberCenter/getMyCustomerList?page=' + page + '&rows=' + rows, data, 'POST', function (e) {
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
          newCount: newCount,
          page: page
        })
      }

    })
  },


  //报名客户和领券客户的按钮切换
  onTap: function (e) {
    var that = this
    this.setData({
      xindex: e.currentTarget.dataset.index,
      istimescreen:false
    })
    if (e.currentTarget.dataset.index == 1) {
      let data = {
        recommenderId: app.globalData.ordinarymemberid
      }
      api.newget('/rest/memberCenter/getCustomerList?start=' + 1 + '&pageSize=' + 12, data, 'POST', function (e) {
        if (e) {
          that.setData({
            Collectcoupons:e.data.list,
            receivewebNextPage:e.data.webNextPage,
            receivestart:e.data.start
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

  // 分页
  lower: function () {
    var that = this;
    var result = that.data.list
    var page = that.data.page + 1;
    if(that.data.istimescreen){
      var data = {
        memberId: app.globalData.ordinarymemberid
      }
    }else{
      let startTime = that.data.currentdate
    let endTime = that.data.endDate
    console.log('开始时间',startTime,'结束时间',endTime)
    var data = {
      memberId: app.globalData.ordinarymemberid,
      createDateStart:startTime,
      createDateEnd:endTime
    }
    }
    
    
    api.newget('/rest/memberCenter/getMyCustomerList?page=' + page + '&rows=12', data, 'POST', header, function (e) {
      if (e.code == '200') {
        var mydata = e.data.list;
        if (mydata.length > 0) {
          // wx.showLoading({
          //   title: '加载中',
          //   icon: 'loading',
          // });
          var timer = setTimeout(() => {
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



  clickOrder:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '../order_detail/order_detail?clickMessage='+JSON.stringify(e.currentTarget.dataset.clickmessage),
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
  startbindDateChange:function(e){
    this.setData({
      currentdate: e.detail.value
    })
  },
  // 结束时间选择
 bindDateChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    endDate: e.detail.value
  })
},
  //搜索
  search:function(){
    let that = this
    let startTime = that.data.currentdate
    let endTime = that.data.endDate
    console.log('开始时间',startTime,'结束时间',endTime)
    if(!endTime){
      wx.showToast({
        title: '请选择结束时间',
        icon:'none',
      })
      return false
    }
    if(endTime<startTime){
      app.showToastMessage('开始时间大于结束时间，请重新选择')
      return false
    }
    let data = {
      memberId: app.globalData.ordinarymemberid,
      createDateStart:startTime,
      createDateEnd:endTime
    }
    api.newget('/rest/memberCenter/getMyCustomerList?page='+1+'&rows='+ 12, data, 'POST', function (e) {
      console.log(e, 'eeeee')
      var code = e.code
      if (code == '200') {
        var getMyCustomerListData = e.data.list
        // if (getMyCustomerListData.length > 0) {
        //   for (var i = 0; i < getMyCustomerListData.length; i++) {
        //     var time = getMyCustomerListData[i].createDate
        //     var createDateArr = time.split(' ')
        //     var createDate = createDateArr[0]
        //     console.log(createDate, 'createDate')
        //     that.setData({
        //       createDate: createDate,
        //     })
        //   }
        // }
        that.setData({
          list: getMyCustomerListData,
          istimescreen:true
        })
      }
    })
  },
  //关闭筛选
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
    var id = that.data.PageMemberId
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



  // 数据字典
  dataDiction: function () {
    var that = this
    let token = app.globalData.token
    let data = {
      typegroupCode: 'crm_mqzt'
    }
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': token
    }
    api.xget('/rest/dataDictionaryApi/dataDictionary', data, 'GET', header, function (e) {
      console.log(e, 'eeeee')
      var code = e.code
      if (code == '200') {
        let data = {
          typename: '请选择',
          typecode: ''
        }
        let dataDictionaryData = e.data
        dataDictionaryData.unshift(data)
        that.setData({
          dataDictionaryData: dataDictionaryData,
          typename: dataDictionaryData[0].typename
        })
      }
    })
  },


   // 筛选
   finish: function (e) {
     console.log('筛选弹窗的关闭')
    var mask = e.currentTarget.dataset.mask
    var that = this
    var id = that.data.PageMemberId
    that.setData({
      mask: mask
    })
    var page = 1
    var rows = 12
    var startDate = that.data.startDate
    var endDate = that.data.endDate
    let data = {
      memberId:id,
      name: that.data.name,
      tel: that.data.tel,
      createDateStart: startDate,
      createDateEnd: endDate
    }
    console.log(data)
    api.newget('/rest/memberCenter/getMyCustomerList?page='+page+'&rows='+ rows, data, 'POST', function (e) {
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
  
  copy:function(e){
    var code = e.currentTarget.dataset.copy;
    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      },
      fail:function(res){
        wx.showToast({
          title: '复制失败',
        });
      }
    })
  },

   // 打电话
   callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },

  //跳转到报名页面
  shareUrl(){
    return
    wx.navigateTo({
      url: '/xpages/budgetquotation/budgetquotation',
    })
  },

  onShareAppMessage: function(options) {
    let memberId = app.globalData.ordinarymemberid
    return {
      title: "免费预约设计",
      path: "xpages/budgetquotation/budgetquotation?status=1&mumberId=" + memberId + "&sharePageData=",
      imageUrl: config.host + "/images/xcx/bm.png"
    }
  }
})