var api = require('../../utils/api.js')
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
    var that = this
    wx.setNavigationBarTitle({
      title: options.title,
    })
    that.setData({
      pageWindowHeight: app.globalData.pageWindowHeight,
      title:options.title,
      newsclassid:options.newsclassid
    })
    console.log(options)
    var videoa = JSON.parse(options.videoa)
    console.log(videoa)
    //视频链接
    that.setData({
      xvideourl:videoa[0].path,
      imgur:app.globalData.imgur
    })
    var newsclassid = options.newsclassid
    let data1 = {
      newsclassId: newsclassid,
      limitNum:10,
      hot: 1
    }
    api.request('/rest/tWebArticalControllerApi/list', data1, 'GET', function (res) {
      that.setData({
        list: res.data
      })
    })
  },
   /**
   * 
   * 重新渲染页面的数据
   * 
   */
  listshuju:function(e){
 var that = this;
let title = e.currentTarget.dataset.title
console.log(title)
let videopath = JSON.parse(e.currentTarget.dataset.videopath)
console.log(videopath)
  wx.setNavigationBarTitle({
    title: title,
  })
  that.setData({
    title:title
  })
let data1 = {
  newsclassId: that.data.newsclassid,
  limitNum:10,
  hot: 1
}
api.request('/rest/tWebArticalControllerApi/list', data1, 'GET', function (res) {
  that.setData({
    list: res.data,
    xvideourl:videopath[0].path
  })
})




  that.setData({
    topNum:0
  })
  },






})