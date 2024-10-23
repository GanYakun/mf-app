// businesscard/current-period/current-period.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    imgur: app.globalData.imgur

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let promotionsId = options.promotionsId
    this.querycommodity(promotionsId)

  },

  //商品信息查询
  querycommodity(promotionsId) {
    var that = this
    let dangqiactivity = {
      page: 1,
      rows: 7,
      promotionsId: promotionsId
    }
    api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
      that.setData({
        list: e.data,
        startpage: 1
      })
    })
  },

  //商品点击
  shopclick: function (e) {
    var that = this
    let objectId = e.currentTarget.dataset.pid
    let typeId = 0
    let itemName = e.currentTarget.dataset.itemname
    let productName = e.currentTarget.dataset.productname
    let cid = e.currentTarget.dataset.cid
    let typeofpurchase = 'dangqi'
    let NeworderType = that.data.NeworderType
    let promotionsId = that.data.ByItemId //促销id
    wx.navigateTo({
      url: '../../xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase + '&NeworderType=' + NeworderType + '&promotionsId=' + promotionsId,
    })
  },

})