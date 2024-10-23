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
    console.log('页面数据',options)
    var that = this
    wx.setNavigationBarTitle({
      title: options.toptext,
    })
    that.setData({
      newsClassId:options.id?options.id:options.newsClassId
    })

    let data1 = {
      start:1,
      pageSize:12,
      newsClassId:options.id?options.id:options.newsClassId
    }
    api.request('/rest/newsClass/getPageModel', data1, 'GET',that.getPageModel)
// console.log(options)
// let data2 = {
//   isNav: 1,
//   parentId: options.id
// }
// api.request('/rest/newsClass/getNewsClassList', data2, 'GET', function(e){
//   console.log(e)
//   var arr = e.data
//     console.log(arr)
//     var list = that.data.list
//     for(var i = 0;i<arr.length;i++){
//       console.log(i)
//       let data1 = {
//         newsclassId: arr[i].id,
//         limitNum:3
//       }
//       api.request('/rest/tWebArticalControllerApi/list', data1, 'GET', function(res){
//         console.log(res)
//   that.data.list.concat(res.data)
//   console.log(that.data.list)
//         that.setData({
//           list:list
//         })
//       })
//     }
// })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

    //回调函数
    getPageModel(e){
      if(e){
        wx.hideLoading({
        })
      }
      this.setData({
        content:e.data,
        totalPageCount:e.data.totalPageCount,
        start:e.data.start,
        imgur:app.globalData.imgur
      })
    },

      //跳转到头条的详情页面
     
      testlife(e){
        wx.navigateTo({
          url: '../../xpages/childactivity/childactivity?id='+e.currentTarget.dataset.id+'&newsClassId='+this.data.newsClassId,
        })
      },

      slideusage() {
        var that = this;
        if (that.data.content.maxStart > that.data.content.start) {
    
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          let starts = that.data.content.start + 1
          let data1 = {
            start: starts,
            pageSize: 12,
            newsClassId: that.data.newsClassId,
          }
          api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
            if (e) {
              wx.hideLoading()
            }
            let shuaxinstart = 'content.start'
            let shujulist = 'content.list'
            let arr = that.data.content
            that.setData({
              [shujulist]: arr.list.concat(e.data.list),
              [shuaxinstart]:starts
            })
    
          })
        } else {
    wx.showToast({
      title: '已经到底了',
      icon:'none',
      duration:1500
    })
        }
    
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