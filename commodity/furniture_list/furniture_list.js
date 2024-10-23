// pages/furniture_list/furniture_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  screenEd:function(e){
    var page = this
    console.log(e.currentTarget.dataset.mask)
    page.setData({
      mask:e.currentTarget.dataset.mask
    })
  },
  //列表详情
  furniture_view:function(){
    wx.navigateTo({
      url: '/commodity/furniture_view/furniture_view'
    })
  },
  design_author:function(){
    wx.navigateTo({
      url: '/commodity/design_author/design_author'
    })
  }
})