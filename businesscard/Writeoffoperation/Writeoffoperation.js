var api = require('../../utils/api.js')
const getTime = require("../../utils/getTime.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    chioce: [
      '全部',
      '昨日',
      '本周',
      '上周',
      '本月',
    ],
    SelectIndex: 0,
    dateSt: '',
    dateEd: '',
    pageStart: 1,
    qcappnoshare:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getTimeFun = new getTime()
    wx.hideShareMenu()
  },
  //开始核销
  startHexiao: function () {
    wx.scanCode({
      success: (res) => {
        console.log('扫描二维码返回的数据', res)
        if (res.result) {
          wx.navigateTo({
            url: '../writeoff/writeoff?id=' + res.result,
          })
        }
      }
    })
  },

  //getWriteOffhistoryList接口的  回调函数
  getWriteOffhistoryList: function (res) {
    let that = this
    that.setData({
      PageData: res.data,
      pageStart: res.data.page,
    })
  },

  //根据时间筛选时间
  Select (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    var startTime, endTime
    if (index == 0) {
      startTime = '',
      endTime = ''
    } 
    //昨日
    else if (index == 1) {
      startTime = that.getTimeFun.getYesterday()
      console.log(startTime)
      endTime = that.getTimeFun.getNowDate()
    } 
    //本周
    else if(index == 2){
      startTime = that.getTimeFun.getWeekStartDate()
      endTime = that.getTimeFun.getWeekEndDate()
    }
    //上周
    else if(index == 3){
      startTime = that.getTimeFun.getLastWeekStartDate()
      endTime = that.getTimeFun.getLastWeekEndDate()
      console.log(endTime)
    }
    // 本月
    else if(index == 4){
      startTime = that.getTimeFun.getMonthStartDate()
      endTime = that.getTimeFun.getMonthEndDate()
      console.log(endTime)
    }
    else {
      startTime = '',
      endTime = ''
    }
    let data = {
      page: 1,
      rows: 10,
      dateSt: startTime,
      dateEd: endTime,
    }
    that.setData({
      dateSt:startTime,
      dateEd:endTime
    })
    api.newget('/rest/memberCenter/getWriteOffhistoryList', data, 'GET', that.getWriteOffhistoryList)
    that.setData({
      SelectIndex: index
    })
  },
  //滑动加载
  bindBootm: function () {
    let that = this
    let pageStart = that.data.pageStart + 1
    console.log(pageStart)
    let data = {
      dateSt:that.data.dateSt,
      dateEd:that.data.dateEd,
      page: pageStart,
      rows: 10,
    }
    api.newget('/rest/memberCenter/getWriteOffhistoryList', data, 'GET', function (res) {
      if (res.data.page > res.data.pages) {
        wx.showToast({
          title: '暂无数据',
          icon: 'none'
        })
        return false
      }
      let setvalue = 'PageData.results'
      let arr = that.data.PageData.results.concat(res.data.results)
      that.setData({
        [setvalue]: arr,
        pageStart: res.data.page
      })
    })
  },

  //筛选
  screen:function(){
wx.navigateTo({
  url: './Screen/Screen',
})
  },

  onShow(){
    let that = this
      let data = {
        page: 1,
        rows: 10,
        dateSt: that.data.dateSt,
        dateEd: that.data.dateEd,
      }
      api.newget('/rest/memberCenter/getWriteOffhistoryList', data, 'GET', that.getWriteOffhistoryList)
      // http://localhost/rest/memberCenter/getWriteOffhistoryList?page=1&rows=5&dateSt=2020-12-28&dateEd=2020-12-28
  }

})