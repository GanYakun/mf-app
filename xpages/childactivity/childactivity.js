var api = require("../../utils/api.js")
var WxParse = require("../../wxParse/wxParse.js")
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
    console.log('页面参数', options)
    var that = this;
    var data1 = {
      newsClassId: '',
      objectId: ''
    }
    if (options.scene) {
      let arr = decodeURIComponent(options.scene).split('&')
      // let newArr = arr.map(item=>{
      //   return{
      //     [`${item.split('=')[0]}`]: item.split('=')[1],
      //   }
      // })
      // console.log(newArr)
      data1.objectId =  (arr[0].split('='))[1]
      data1.newsClassId = (arr[1].split('='))[1]
    } else {
      data1.newsClassId = options.newsClassId,
        data1.objectId = options.id ? options.id : options.objectId
    }
    console.log(data1)
    //得到模型数据
    api.request('/rest/newsClass/getModel', data1, 'GET', that.getModel)
  },

  getModel(e) {


    var that = this;
    this.setData({
      TopTitle: e.data.title,
      shareTitle: e.data.title
    })
    if (e.data.contentWap != null) {
      var article = e.data.contentWap
    } else {
      var article = e.data.content
    }
    WxParse.wxParse('article', 'html', article, that, 5);
    that.setData({
      pagelist: e.data
    })
  },
  onShow() {
    this.setData({
      isPageShow: false
    })
  }
})