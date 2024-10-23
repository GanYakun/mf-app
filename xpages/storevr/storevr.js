// pages/phystroes/phystroes.js
var api = require("../../utils/api.js")
var app = getApp()
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
    wx.getSystemInfo({
      success: res => {
      // 获取可使用窗口宽度、高度、比例
      let windowHeight = res.windowHeight;
      let windowWidth = res.windowWidth;
      let ratio = 750 / windowWidth;
      let pageWindowHeight = Math.ceil(windowHeight * ratio);
      console.log(pageWindowHeight)
      this.setData({
        pageWindowHeight:pageWindowHeight,
        newsClassId:options.id,
        imgur:app.globalData.imgur
      })
}
})
    console.log(options)
      // 获取实体门店数据
  let data={start:1,pageSize:12,newsClassId:145}
  api.request('/rest/newsClass/getPageModel', data, 'GET',this.getPageModel)
  },
  
  getPageModel:function(e){
    
    this.setData({
     list: e.data.list
    })
    console.log(e.data.list[0])
    let sss = (JSON.parse(e.data.list[0].thumbnailPath))
    console.log(sss)
    console.log(sss[0].path)
     },
  contentimg:function(e){
    let roam = e.currentTarget.dataset.roam
    wx.navigateTo({
      // url: ' ../../../../xpages/h5page/h5page?url=' +encodeURIComponent(roam)
    })
    wx.navigateTo({
      url: '/xpages/h5page/h5page?url='+roam,
    })
  }
})