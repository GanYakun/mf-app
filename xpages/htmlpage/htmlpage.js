var api = require("../../utils/api.js")
var WxParse = require("../../wxParse/wxParse.js")
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
    let that  = this
console.log(options)
let data1 = JSON.parse (options.data1)
api.request('rest/tWebArticalControllerApi/list', data1, 'GET', function(e){
 
  wx.setNavigationBarTitle({
    // title: e.data[options.index].title,
    title: e.data[0].title,
  })
  that.setData({
    // pagelist:e.data[options.index]
    pagelist:e.data[0]
  })
  if(e.data[0].contentwap==''){
    // let article=e.data[options.index].content
    let article=e.data[0].content
 
    WxParse.wxParse('article', 'html', article, that, 5);
  }else{

      let article=e.data[0].contentWap
      WxParse.wxParse('article', 'html', article, that, 5);
  } 
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