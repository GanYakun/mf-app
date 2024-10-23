// member/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      account:options.account,
      imagepath:options.imagepath,
      nick:options.nick
    })
  },
  onUpdateBasicInfo:function(){
    wx.navigateTo({
      url: '../basic_information/basic_information',
    })
  },
  onUpdatePwd:function(){
    wx.navigateTo({
      url: '../update_pwd/update_pwd',
    })
  },
  onUpdatePhoto:function(){
    let that = this
    let imagepath = that.data.imagepath
    wx.navigateTo({
      url: '../update_photo/update_photo?imagepath=' + imagepath,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})