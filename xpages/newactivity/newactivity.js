var api = require("../../utils/api.js")
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      name:"最新活动",
      time:'2020-07-05 17:09:12',
      concent:'尚品宅配“入昆10年·周年大庆”周年现金红包、幸运抽奖多重壕礼燃爆全城！',
      isapproval:true,           //判断是否为审批
     
  }],
  LeftButtonnavHeight:app.globalData.LeftButtonnavHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载参数',options)
    let that = this
    this.setData({
      newsClassId:options.scrrenId?options.scrrenId:(options.id?options.id:options.newsClassId)
    })
   
   
    let data1 = {
      start:1,
      pageSize:12,
      newsClassId:options.scrrenId?options.scrrenId:(options.id?options.id:options.newsClassId)
    }
    
   
    api.newget('/rest/newsClass/getPageModel', data1, 'GET',this.getPageModel)
     //查询子栏目
     let data2 = {
      isNav: 1,
      parentId: options.id?options.id:options.newsClassId
    }
    api.request('/rest/newsClass/getNewsClassList', data2, 'GET', function(e){
      e.data.unshift({id:options.id?options.id:options.newsClassId,name:'全部'})
      that.setData({
        titlelist:e.data
      })
    })
  },

  clicklivingin:function(e){
let that = this
    let data1 = {
      start:1,
      pageSize:12,
      newsClassId:e.currentTarget.dataset.id
    }
    this.setData({
      itemId:'itemId'+e.currentTarget.dataset.id,
      newsClassId:e.currentTarget.dataset.id
    })
    api.request('/rest/newsClass/getPageModel', data1, 'GET',that.getPageModel)
  },
    //回调函数
    getPageModel(e){
      if(e.data.list.length==0){
        wx.showToast({
          title: '暂无数据',
          icon:'none'
        })
      }
      this.setData({
        content:e.data,
        totalPageCount:e.data.totalPageCount,
        start:e.data.start,
        imgur:app.globalData.imgur      })
    },

    //跳转到最新活动的详情页面
     
    testlife(e){
      wx.navigateTo({
        url: '../../xpages/childactivity/childactivity?id='+e.currentTarget.dataset.id+'&newsClassId='+this.data.newsClassId,
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
     * 
     * 滑动到底部加载新数据
     * 
     * 
     */
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



})