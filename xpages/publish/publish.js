// xpages/publish/publish.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverIndex:0,
    majorIndex:0,
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      shejiid: id
    })
    let desPinLunListData = { designerId: id, start: 1, pageSize: 12 }
    api.request('/rest/tWebContributeControllerApi/desPinLunList', desPinLunListData, 'GET', this.desPinLunList)
  },


  /**
   * 
   * 查询评价列表的回调
   * 
   */
  desPinLunList: function (e) {
    wx.showLoading({
      title: '加载中',
    })

    console.log(e)
    this.setData({
      lists: e.data.list,
      imgurl: app.globalData.imgur,
      totalCount: e.data.totalCount,
      //分页需要用到的字段
      webnextpage: e.data.webNextPage,
      maxstart: e.data.maxStart,
      start: e.data.start
    })
    if (e) {
      wx.hideLoading({
        success: (res) => { },
      })
    }
  },

  inputs: function (e) {
    console.log(e)
    this.setData({
      pingjiaconcent: e.detail.value
    })
  },

  /**
   * 
   * 
   * 
   * 发表评价
   * 
   */
  publish: async function (e) {
    var that = this
    await app.obtaintoken()
    if (!app.globalData.token) {
      app.UserLoginToClick()
      return false
    }
      if(!that.data.pingjiaconcent){
      wx.showToast({
        title: '请输入评价内容',
        icon:'none',
      })
      return false
      }
     
      let data = {
        commentContent: that.data.pingjiaconcent,
        designerDecoratorId: parseInt(that.data.shejiid)
       
      }
      if(this.data.majorIndex){
        data.professionalLevel=this.data.majorIndex     //专业的评分
      }
      if(this.data.serverIndex){
        data.serviceAttitude=this.data.serverIndex     //专业的评分
      }
      console.log(data)
      api.newget('/rest/memberCenter/pinJiaDes', data, 'POST', function (e) {
        if (e.message == '未登录') {
          wx.showLoading({
            title: '加载中...',
            duration: 1500,
          });
          app.obtaintoken()
        } else {
          wx.showToast({
            title: '发表成功',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            pingjiaconcent:''
          })
          //查询评价的request请求
          let desPinLunListData = {
            designerId: that.data.shejiid, start: 1, pageSize: 12
          }
          api.request('/rest/tWebContributeControllerApi/desPinLunList', desPinLunListData, 'GET', that.desPinLunList)
        }
      })



  },

  /**
   * 
   * 监听页面隐藏
   * 
   */
  onHide: function () {
    wx.hideLoading({
      success: (res) => { },
    })
  },

  /** 
   * 
   * 滑动加载数据事件
   * 
   * 
   */
  slideusage: function () {
    let that = this;
    if (this.data.webnextpage) {
      wx.showLoading({
        title: '加载中',
      })
      let startnum = that.data.start + 1

      let desPinLunListData = {
        designerId: that.data.shejiid,
        start: startnum,
        pageSize: 12
      }

      api.request('/rest/tWebContributeControllerApi/desPinLunList', desPinLunListData, 'GET', function (e) {
        if (e) {
          wx.hideLoading({
          })
          that.setData({
            lists: that.data.lists.concat(e.data.list),
            start: startnum,
            webnextpage: e.data.webNextPage

          })
        }

      })
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }


  },

  //服务态度打分
  serviceScoringTap:function(event){
    let index = event.currentTarget.dataset.index
    this.setData({
      serverIndex:index+1
    })
  },

  //专业能力打分
  majorTap(event){
    let index = event.currentTarget.dataset.index
    this.setData({
      majorIndex:index+1
    })
  }
})