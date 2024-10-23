var api = require('../../utils/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgur: app.globalData.imgur,
    sysScroll:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(decodeURIComponent(options.parameter))
    let parameter = JSON.parse(decodeURIComponent(options.parameter))
    try{
      let endtime = parameter.endTime.replace(/-/g, '/')
      let end_str = Date.parse(endtime);
      console.log('测试',end_str)

      var end_date =end_str -  Date.parse(new Date())
    }catch{
    console.log('！！！抛出异常')
    var end_date = 0
    }
    
    this.setData({
      UnPageParameter:parameter,
      time:end_date
    })
    //查询最近下定的记录
    let data = {
      // depositId:parameter.id,
      // depositType:parameter.type,
      page:1,
      rows:20
    }
    api.newget('/rest/tWebDepositOrderApi/getDepositOrderList',data,'GET',(res)=>{
    this.setData({
      msgList:res.data
    })
  })
  },

  //提交表单事件
  subMessage (e) {
console.log(e)
let detail = e.detail.value
if(!detail.name){
  wx.showToast({
    title: '请输入姓名',
    icon: 'none',
    duration: 1500
  });
  return false
}else{
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (detail.phone.length === 0) {
    wx.showToast({
      title: '输入的手机号为空',
      icon: 'none',
      duration: 1500
    });
    return false;
  } else if (detail.phone.length < 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'none',
      duration: 1500
    });
    return false;
  } else if (!myreg.test(detail.phone)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'none',
      duration: 1500
    });
    return false;
  }
}
let data = {
  orderRecommendId:app.globalData.newshareid,   //推荐人id
  orderDepositId:this.data.UnPageParameter.id,   //案例id
  orderDepositName:this.data.UnPageParameter.CaseName?this.data.UnPageParameter.CaseName:'',    //案例名字
  orderPrice:this.data.UnPageParameter.depositPrice,   //订单价格
  orderName:detail.name,       //订单人名字
  orderTel:detail.phone,   //订单人电话
  orderDepositType:this.data.UnPageParameter.type,    //案例类型
  orderRemark:detail.remark,        //订单备注
  orderAddress:detail.address
}

api.newget('/rest/memberCenter/addDepositOrder',data,'POST',(mes)=>{
  let that = this
  if(mes.code == 500){
    wx.showToast({
      title: mes.message,
      icon:'none'
    })
    return false
  }
wx.login({
success(res) {
  var codes = res.code
  //微信支付接口返回的数据
  api.newget('/rest/payApi/xcxPay?code=' + codes + '&orderNum=' + mes.data.orderNum, {}, 'POST', function (e) {
    wx.showLoading({
      title: '',
    })
    console.log(e)
    if (e.code == 500) {
      wx.showToast({
        title: e.message,
        icon: 'none'
      })
      return false
    }
   
    wx.requestPayment({
      'timeStamp': e.data.timeStamp,
      'nonceStr': e.data.nonceStr,
      'package': e.data.weixinPackage,
      'signType': 'MD5',
      'paySign': e.data.sign,
      "success": function (res) {
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.errMsg == "requestPayment:ok") {
          wx.navigateTo({
            url: '../../businesscard/index/orderList/orderList',
          })
          that.setData({
            form_info:''
           })
        }
      },
      "fail": function (res) {
        if (res.errMsg == 'requestPayment:fail cancel') {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
       
        wx.hideLoading({
          success: (res) => {},
        }) 
      }
    })
  })
}
})
})
  },

  // 用户评价
allhouse_detail: function (e) {
  
  let id = e.currentTarget.dataset.id
  this.setData({
    username: app.globalData.username, //用户昵称
    userimg: app.globalData.userimg, //用户头像
  })
  this.getEvaList()

  this.setData({
    isUserEvaluationShow:this.data.isUserEvaluationShow?false:true
  })
},

  // 输入完成，发表评价
  complete:function(e){
    console.log(e)
    let data = {
      perfectId:this.data.UnPageParameter.id,
      commentContent:e.detail.value
    }
    api.newget('/rest/memberCenter/perfectHomeComment',data,'POST',(res)=>{
      if(res.code == 200){
        this.getEvaList()
        this.setData({
          cleardata:'',
          ListPosition:0
        })
      }
      wx.showToast({
        title: res.message,
        icon:'none'
      })
    })
  },
  //获取评价列表
  getEvaList:function(){
    let data={
      page:1,
      rows:12,
      perfectId:this.data.UnPageParameter.id,
    }
    api.newget('/rest/memberCenter/perfectHomeCommentList',data,'GET',(res)=>{
      this.setData({
        CommentData:res.data,
        CurrentPage:1
      })
    })
  },
  // 评论列表滑动加载
  scrollLow(){
    let arrLength = this.data.CommentData.results.length
    if(arrLength == this.data.CommentData.total || arrLength > this.data.CommentData.total){
      wx.showToast({
        title: '暂无数据',
        icon:'none'
      })
      return false
    }
    let data={
      page:this.data.CurrentPage+1,
      rows:12,
      perfectId:this.data.UnPageParameter.id,
    }
    api.newget('/rest/memberCenter/perfectHomeCommentList',data,'GET',(res)=>{
      let setValue = 'CommentData.results'
      this.data.CommentData.results.concat(res.data.results)
      this.setData({
        [setValue]:this.data.CommentData.results.concat(res.data.results),
      })
    })
  },
  //关闭评论框
  closeComplete:function(){
    this.setData({
      isUserEvaluationShow:false
    })
  },


  //解决输入框文字错位问题
  onfocus: function() {
    this.setData({sysScroll: false})
  },
  onblur: function (e, param, inst) {
    this.setData({sysScroll: true})
  }


})