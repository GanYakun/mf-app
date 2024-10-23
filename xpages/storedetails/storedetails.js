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
    console.log('页面加载数据', options)
    // console.log('imgur', options.imgarr)
    // wx.getSystemInfo({
    //   success: res => {
    //     let windowHeight = res.windowHeight;
    //     let windowWidth = res.windowWidth;
    //     let ratio = 750 / windowWidth;
    //     let pageWindowHeight = Math.ceil(windowHeight * ratio);
    //     this.setData({
    //       pageWindowHeight: pageWindowHeight
    //     })

    //     let title = options.title
    //     this.setData({
    //       TopTitle: title
    //     })
    //   }
    // })


    // let imgarr = JSON.parse(options.imgarr)
    // this.setData({
    //   imgarr: imgarr,
    //   imgur: app.globalData.imgur
    // })

    let data = {
      newsClassId: options.newsClassId,
      objectId: options.id
    }
    api.request('/rest/newsClass/getModel', data, 'GET', this.getPageModel)
  },

  //回调函数
  getPageModel: function (e) {
    console.log('详情数据', e.data)
    let imgarr = JSON.parse(e.data.thumbnailsPath)
    this.setData({
      imgarr: imgarr,
      TopTitle: e.data.abbName,
      imgur: app.globalData.imgur
    })
  },

  //查看图片
  previewimg: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgarr;
    var imgur = this.data.imgur
    console.log(currents)
    var arr = []
    imgArr.forEach((v, k) => {
      arr.push(imgur + v.path)
    });
    var currents = imgur + arr[index]
    wx.previewImage({
      current: arr[index],
      urls: arr
    })
    console.log(arr[index])
  }
})