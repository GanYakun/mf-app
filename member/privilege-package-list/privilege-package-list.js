// member/privilege-package-list/privilege-package-list.js
const app = getApp()
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ftpurl:app.globalData.ftpurl,
    imageUrl: app.globalData.imgur,
    recordId: "",
    myReceiveRecordProList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let recordId = options && options.recordId ? options.recordId:"182"
    this.setData({
      recordId: recordId
    })
    let myReceiveRecordProList = await requestCenter.getMyReceiveRecordProList({recordId: recordId})
    this.setData({
      myReceiveRecordProList: myReceiveRecordProList
    })
  },

  toPrivilegeProDetail: function(event) {
    let clickItem = event.currentTarget.dataset.item
    console.log("toPrivilegeProDetail", clickItem)
    let objectId = clickItem.itemId
    let typeId = 0
    let itemName = ""
    let productName = clickItem.title
    let cid = ""
    let typeofpurchase = 'dangqi'
    let NeworderType = "1"
    let promotionsId = clickItem.promotionsId //促销id

    wx.navigateTo({
      url: '../../xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase + '&NeworderType=' + NeworderType + '&promotionsId=' + promotionsId,
    })
  }
})