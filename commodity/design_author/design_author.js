// pages/design_author/design_author.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  clickTab:function(e){
    var page = this
    if(page.data.currentTab == e.target.dataset.current){
      return false
    }else{
      page.setData({
        currentTab:e.target.dataset.current
      })
    }
  }
})