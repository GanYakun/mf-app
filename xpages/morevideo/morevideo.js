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
    var that = this;
    wx.setNavigationBarTitle({
      title: options.name,
    })
    let data1 = {
      start:1,
      pageSize:12,
      newsClassId: options.id,
    }
    //吧newsClassId设进data里面
    that.setData({
      newsClassId:options.id
    })
    api.request('/rest/newsClass/getPageModel', data1, 'GET', function(res){
let arrs = res.data
      that.setData({
        list:arrs,
        pageWindowHeight:app.globalData.pageWindowHeight,
        imgur:app.globalData.imgur
      })
    })
  },

  /**
   * 
   * 
   * 滑动加载数据
   * 
   * 
   */
  slideusage: function () {
    let that = this
    var arr = that.data.list
    if (arr.webNextPage) {
      wx.showLoading({
        title: '加载中',
      })
      var startnum = arr.start + 1
      let data = {
        start: startnum,
        pageSize: 12,
        newsClassId: that.data.newsClassId
      }
      api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if (e) {
          wx.hideLoading({

          })
        }
        arr.list = arr.list.concat(e.data.list)
        var xiugai = 'list.webNextPage'
        var xiugai1 = 'list.start'
        that.setData({
          list: arr,
          [xiugai]: e.data.webNextPage,
          [xiugai1]: startnum
        })
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1500
      })
    }
  },


  /**
   * 
   * 跳转到页面播放视频
   * 
   */
  listshuju:function(e){
    let videos = e.currentTarget.dataset.videopath
let title = e.currentTarget.dataset.title
  
wx.navigateTo({
  url: '../videodetails/videodetails?videoa='+videos+'&newsclassid='+this.data.newsClassId+'&title='+title
})
  }
})