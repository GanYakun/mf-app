// businesscard/order_detail/order_detail.js
import {
  calculationfun
} from '../../utils/Heightset' //es6
var app = getApp()
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    let clickMessage = JSON.parse(options.clickMessage)
    console.log('转换后的参数',clickMessage)
    that.setData({
      pageMessage:clickMessage,
      imgur:app.globalData.imgur
    })
    console.log("订单详情",clickMessage.orderNum)
       let data = {
        memberId:clickMessage.memberId,
        orderNum: clickMessage.orderNum,
      orderType:4
    }
    api.newget('/rest/memberCenter/getOrderList?start=' + 1 + '&pageSize=' + 12, data, 'POST', function (e) {
      if(e){
that.setData({
  orderList:e.data.list
})
      }else{
        wx.showToast({
          title: e.message,
          icon:'none',
          duration:1000
        })
      }
    })

  },

 
})