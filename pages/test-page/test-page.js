// pages/test-page/test-page.js
import requestCenter from "../../http/request-center" 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundList: [],
    showSkuDialog: false 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setTimeout(async () => {

    //   let getCouponList = await requestCenter.getCouponList()
    //     console.log(getCouponList)
    //   ///测试二维码开始
    //   let createQRCode = await requestCenter.getCreateQRCode({itemId:1746})
    //   var base64 =(createQRCode.QRCodeMSG).replace(/[\r\n]/g,""); 
    //     this.setData({
    //       imageData: 'data:image/jpg;base64,'+base64,  // data 为接口返回的base64字符串  
    //     })
    //     ///测试二维码接口结束


        
    // }, 2000);

    // wx.request({
    //   url: 'http://wwwmybcom.aykj.co/api/newsClass/childNavList',
    //   data:{},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //     success (res) {
    //     console.log(res.data)
    //     }
    // })
  },

  openSkuDialog: function(event) {
    this.setData({
      showSkuDialog: true
    })
  }
})