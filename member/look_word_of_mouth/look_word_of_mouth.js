// member/look_word_of_mouth/look_word_of_mouth.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgur:app.globalData.imgur,
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = JSON.parse(decodeURIComponent(options.params))
    this.setData({list:params.list})
  },

  
})