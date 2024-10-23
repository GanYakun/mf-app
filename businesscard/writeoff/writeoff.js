var api = require('../../utils/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    nums:0,
    isall: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log("核销页面的onload的参数", options)
    if (options.id) {
      that.setData({
        apidata: {
          orderNum: options.id
        }
      })
    } else {

      wx.navigateBack({
        delta: 1, // 返回上一级页面。
        success: function () {
          console.log('成功！')
        }
      })
      wx.showToast({
        title: '未知错误',
        icon: 'none',
        duration: 1000
      })
    }
var timer = setTimeout(()=>{
  that.getwrite()
  clearTimeout(timer)
},100)
  },


  /**
   * 
   * 获取核销订单
   * 
   */
  getwrite: function () {
    let that = this
    let data = that.data.apidata
    console.log('获取核销订单', data)
    api.newget('/rest/memberCenter/getOrderListWriteOff', data, 'POST', function (e) {
      if (e) {
        that.setData({
          orderMessage: e.data,
          imgurl: app.globalData.imgur
        })
      }
    })

  },


  /**
   * 
   * 单条订单核销
   * 
   */
  btnhexiao: function (e) {
    var that = this
    console.log(e)
    let data = {
      id: e.currentTarget.dataset.id
    }
    console.log('上传的订单号', data)
    api.newget('/rest/memberCenter/orderDetailWriteOff', data, 'POST', function (e) {
      if (e) {
        console.log(e)
        that.setData({
          isall: false
        })
        that.getwrite()

      }
    })
  },

  /**
   * 
   * 批量核销
   * 
   */
  batch: async function () {
    console.log('进来')
    var that = this
    var arr = await that.batchson()
   that.setData({
     hxshoparr:arr
   })
    if(arr[0].length == 0 || arr[1].length == 0){
      wx.showToast({
        title: '未选择核销产品',
        icon:'none'
      })
        return false
            }
    that.setData({
      androidDialog1:true
    })
    
    
  },

/**
 * 
 * 批量核销子方法
 * 
 */
batchson:function(){
  var that = this
  return new Promise((resove,reject)=>{
    var arr = []
    var nums = []
    var WriteoffMessage = []
    that.data.orderMessage.orderDetailsList.forEach((v, k) => {
      if(v.writeOff != 1){
        if(v.isclick){
          arr.push(v.id)
          nums.push(v.nums?v.nums:v.productCounts-(v.writeOffQuantity?v.writeOffQuantity:0))
          WriteoffMessage.push(
            {
              name:v.productName,
              nums:(v.nums?v.nums:v.productCounts-(v.writeOffQuantity?v.writeOffQuantity:0))
            }
            )
        }
      }
      if(k+1==that.data.orderMessage.orderDetailsList.length){
        resove ([arr,nums])
        that.setData({
          WriteoffMessage:WriteoffMessage
        })
      }
  })
})
},

  /**
   * 
   * 单条选择
   * 
   */
  Multiplechoice: function (e) {
    let index = e.currentTarget.dataset.index
    let isclick = e.currentTarget.dataset.isclick
    let list = 'orderMessage.orderDetailsList[' + index + '].isclick'
    if (isclick) {
      this.setData({
        [list]: false,
      })
    } else {
      this.setData({
        [list]: true,
      })
    }

  },




  /**
   * 全选全选全选
   * 全选全选全选
   * 全选全选全选
   */
  allclick: async function (e) {
    let isall = e.currentTarget.dataset.isall
    var that = this
    if (isall) {
      var  clickisall = await that.allson(0)
    } else {
      var clickisall = await that.allson(1)
    }
    that.setData({
      isall:clickisall
    })
    
  },

  //全选子方法
  allson:function(e){
    console.log(e==1)
    let that = this
    return new Promise((resove,reject)=>{
      that.data.orderMessage.orderDetailsList.forEach((v, k) => {
          let setvalue = 'orderMessage.orderDetailsList[' + k + '].isclick'
          that.setData({
            [setvalue]:e==1
          })
        if(k+1==that.data.orderMessage.orderDetailsList.length){
          resove (e==1?true:false)
        }
      })
    })
  },

// 减
reduce:function(e){
  
  let that = this
  let index = e.currentTarget.dataset.index
  let nums = e.currentTarget.dataset.nums
  let writeOffQuantity = e.currentTarget.dataset.writequantity
  let productCounts = e.currentTarget.dataset.productcounts
  let setvalue = 'orderMessage.orderDetailsList['+index+'].nums'
  if(nums && nums!=''){
    console.log(nums)
var number = nums
  }else{

var number = productCounts-(writeOffQuantity?writeOffQuantity:0)
  }
  

  console.log(number)
  number = number-1
if(number ==0 || number<0){
  wx.showToast({
    title: '不能在减少了',
    icon:'none'
  })
  return false
}else{
  that.setData({
    [setvalue]:number
  })
}
},
add:function(e){
  let that = this
  let index = e.currentTarget.dataset.index
  let nums = e.currentTarget.dataset.nums
  let writeOffQuantity = e.currentTarget.dataset.writequantity
  let productCounts = e.currentTarget.dataset.productcounts
  let setvalue = 'orderMessage.orderDetailsList['+index+'].nums'
  if(nums){
var number = nums
  }else{
var number = productCounts-(writeOffQuantity?writeOffQuantity:0)
  }
  number = number+1
  console.log(number)
  console.log(writeOffQuantity)
  console.log(productCounts)
var Limitquantity = writeOffQuantity?productCounts-writeOffQuantity:productCounts
if(number > Limitquantity){
  wx.showToast({
    title: '超出限制',
    icon:'none'
  })
  return false
}else{
  that.setData({
    [setvalue]:number
  })
}
  
},

close:function(){
  let that = this
  that.setData({
    androidDialog1:false
  })
},

// 确定事件
confirm:function(){
  let that = this
  var arr = that.data.hxshoparr
  let data = {
    orderId:that.data.orderMessage.id,
    ids:arr[0].join(','),
    nums:arr[1].join(','),
  }
    api.newget('/rest/memberCenter/doBatchWriteOff', data, 'GET', function (e) {
      if (e.code==200) {
        wx.showToast({
          title: '核销成功',
          icon:'none'
        })
        console.log(e)
        that.setData({
          isall: false,
          num:0
        })
        that.getwrite()

      }else{
        wx.showToast({
          title: e.Message,
          icon:'none'
        })
      }
      that.setData({
        androidDialog1:false
      })
    })
  
}



})