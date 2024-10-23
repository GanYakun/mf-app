// member/address_list/address_list.js
var app = getApp()
var api = require("../../utils/api.js")
// import Dialog from '/miniprogram_npm/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onClose(e) {
    var that = this;
    wx.showModal({
      title: '确定删除该地址吗',
      // content: '这是一个模态弹窗',
      success(res) {
        if (res.confirm) {
          var id = e.currentTarget.dataset.id
          let header = {
            'content-type': 'application/json',
            'X-AUTH-TOKEN': app.globalData.token
          }
          let data = {

          }
          api.xpost('/rest/memberCenter/deleteDeliveryAddress?addressId=' + id, data, 'DELETE', header, function (e) {
            console.log(e.code == '200')
            if (e) {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }
            that.addressList()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    console.log(e, '53627890')

  
  },

  onAddAddress: function (e) {
    console.log(e)
    let that = this;
    var consignee = e.currentTarget.dataset.consignee
    var consigneetelephone = e.currentTarget.dataset.consigneetelephone
    var provincecitycounty = e.currentTarget.dataset.provincecitycounty
    var detailaddress = e.currentTarget.dataset.detailaddress
    var addressalias = e.currentTarget.dataset.addressalias
    var zipcode = e.currentTarget.dataset.zipcode
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    var isdefault = e.currentTarget.dataset.isdefault
    let xpanduan = e.currentTarget.dataset.xpanduan
    console.log(consigneetelephone)
    wx.navigateTo({
      url: '../add_address/add_address?consignee=' + consignee + "&consigneeTelephone=" + consigneetelephone + "&provinceCityCounty=" + provincecitycounty + "&detailAddress=" + detailaddress + "&addressAlias=" + addressalias + "&zipCode=" + zipcode + "&id=" + id + "&type=" + type + "&isdefault=" + isdefault + '&xpanduan=' + xpanduan
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addressList:function(){
    let that = this;
    let tokens = app.globalData.token
    let data = {}
    console.log(tokens)
    api.newget('/rest/memberCenter/myShippingAdress', data, 'GET', function (e) {
      if (e.code == 200) {
        that.setData({
          addressList: e.data,
          consignee: e.data.consignee
        })
      } else {
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.addressList()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})