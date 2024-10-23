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
    wx.setNavigationBarTitle({
      title: options.toptext,
    })
    this.setData({
      TopTitle:options.toptext
    })
    let data1 = {
      newsclassId: options.id,
      flag: 1
    }
    api.request('rest/tWebArticalControllerApi/list', data1, 'GET', this.getPageModel)
    //查询子栏目
    let data2 = {
      isNav: 1,
      parentId: options.id
    }
    api.request('/rest/newsClass/getNewsClassList', data2, 'GET', this.column)
  },

  //数据回调
  getPageModel(e) {
    this.setData({
      list: e.data,
      imgur: app.globalData.imgur
    })
  },

  /**
   * 
   * 获取子栏目列表
   * 
   */
  column: function (e) {
    var that = this;
    that.setData({
      livingin: e.data
    })
  },



  /**
   * 
   * 列表里的数据点击事件
   * 
   */
  listshuju: function (e) {
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.newclassid
    let data2 = {
      newsclassId: id
    }
    console.log(data2)
    wx.navigateTo({
      url: '../../xpages/htmlpage/htmlpage?index=' + index + '&data1=' + JSON.stringify(data2),
    })
  },


  /**
   * 
   * 跳转到子栏目数据
   * 
   */
  clicklivingin: function (e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../fitforlifechild/fitforlifechild?id=' + id + '&name=' + name,
    })
  },



})