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
    console.log(options)
this.setData({
  TopTitle:options.name
})
    let data1 = {
      start:1,
      pageSize:12,
      newsClassId: options.id,
    }
 
    api.request('rest/newsClass/getPageModel', data1, 'GET', this.getPageModel)
    //查询子栏目
    let data2={
      isNav:1,
      parentId:options.id
    }

  },

  //数据回调
  getPageModel(e) {
    this.setData({
      list: e.data.list,
      imgur:app.globalData.imgur
    })
  },



  /**
   * 
   * 列表里的数据点击事件
   * 
   */
  listshuju:function(e){
   let index = e.currentTarget.dataset.index
   let newclassid = e.currentTarget.dataset.newclassid
   let data1={
    newsclassId:newclassid
   }
   
wx.navigateTo({
  url: '../../xpages/htmlpage/htmlpage?index='+index+'&data1='+ JSON.stringify(data1),
})
  },




  
})