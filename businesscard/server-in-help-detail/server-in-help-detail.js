// businesscard/server-in-help-detail/server-in-help-detail.js
import requestCenter from "../../http/request-center"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    ftpUrl: app.globalData.newFtpUrl,
    imgur: app.globalData.imgur,
    qcappnoshare: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id) {
      this.setData({
        coupId: options.id
      })
      this.preGetCoupon(options.id)
    }else if(options.scene){
      let query = decodeURIComponent(options.scene).split(",");
      if(query[4]=='ccId'){
        this.setData({
          coupId: query[5]
        })
        this.preGetCoupon(query[5])
      }
    }
     else {
      this.setData({
        [`coupList[0]`]: JSON.parse(decodeURIComponent(options.item))
      })
    }
  },

  //会员领取优惠券
  async preGetCoupon(id) {
    let params = {
      couponCId: id
    }
    let preGetCoupon = await requestCenter.preGetCoupon(params).then((res)=>{
      this.setData({
        [`coupList[0]`]: res
      })
    }).catch((res)=>{
      var timer = setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
        clearTimeout (timer)
      }, 1000);
      
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //生成分享二维码
  async shareCoup(e) {
    this.setData({
      isShowLoding: true
    })
    let getCreateCouponQRCode = await requestCenter.getCreateCouponQRCode({
      couponId: e.currentTarget.dataset.id
    })
    this.setData({
      qrCode: getCreateCouponQRCode,
      isShowLoding: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //立即领取
  async receive() {
    await app.obtaintoken()
    if (!app.globalData.token) {
      app.UserLoginToClick()
      return false
    }
    let params = {
      couponCId: this.data.coupId
    }
    let postCoupon = await requestCenter.postCoupon(params)
    app.showToastMessage('领取成功')
    let timer = setTimeout(() => {
      wx.redirectTo({
        url: '/businesscard/server-in-help/server-in-help?type='+'meCoup'
      })
      clearTimeout(timer)
    }, 1500);
    
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  //   return {
  //     title: '暖心服务抵用券',
  //     path: '/businesscard/server-in-help-detail/server-in-help-detail?id='+123
  //   }
  // }
})