// member/claim_coupons/claim_coupons.js
const app = getApp()
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    newFtpUrl:app.globalData.newFtpUrl,
    imageUrl: app.globalData.imgur,
    isShare: false,
    haosongId: "",
    fromId: "",
    haosongDetail: null,
    status: "活动加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let scene = options.scene
    let haosongId = ""
    let fromId = ""
    if(scene) {
      scene = decodeURIComponent(scene)
      this.setData({
        isShare: true
      })
      let query = app.getQueryValue(scene)
      console.log("onLoad", query)
      haosongId = query.hid
      fromId = query.mId
    } else {
      this.setData({
        isShare: false
      })
      haosongId = options.haosongId
      fromId = ""
    }
    let haosongDetail = await requestCenter.getHaosongDetail({
      haosongId: haosongId
    })
    if(!haosongDetail) {
      this.setData({
        status: "活动不存在"
      })
    }
    this.setData({
      haosongId: haosongId,
      fromId: fromId,
      haosongDetail: haosongDetail
    })
  },

  confirmReceiveHaoSong: async function(event) {
    let haosongId = this.data.haosongId
    let fromId = this.data.fromId
    console.log("confirmReceiveHaoSong", app.globalData.memberid)
    await requestCenter.confirmReceiveHaoSong({
      haosongId: haosongId,
      issuerMemberId: fromId
    })
    wx.showToast({
      title: '领取成功',
      icon:'none'
    })
    let timer = setTimeout(() => {
      wx.navigateTo({
        url: '/businesscard/server-in-help/server-in-help?currentTab=1&type=meCoup',
      })
      clearTimeout(timer)
    }, 2000)
  }
})