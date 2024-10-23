// xpages/usercenterword/usercenterword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
list:[{
    name:"测试",
    time:'2020-07-05 17:09:12',
    isapproval:true,           //判断是否为审批
}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  look:function(){
    wx.navigateTo({
      url: '../../xpages/wordofmouth/wordofmouth',
    })
  }
})