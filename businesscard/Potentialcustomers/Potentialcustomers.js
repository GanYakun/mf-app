var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from '../../http/request-center' 
import {
  calculationfun
} from '../../utils/Heightset' //es6
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentdate: '',
    date: '结束时间',
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: async function (options) {
   
    var that = this
    var date = new Date()
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var currentdate = date.getFullYear() + '-' + month + '-' + strDate
    var navHeight = calculationfun.constructors()
    that.setData({
      navHeight: navHeight.navHeight,
      currentdate: currentdate
    })
    // 内部员工和经纪人的潜在客户列表
    if(options.id){
      let params = {
        page: 1,
        rows: 12,
        memberId:options.id
      }
      let getMemberCustomerListByMemberId = await requestCenter.getMemberCustomerListByMemberId(params)
      that.setData({
        memberId:options.id,
        list: getMemberCustomerListByMemberId.list,
        start: 1,
        webNextPage: getMemberCustomerListByMemberId.webNextPage
      })
      return false
    }
    let data = {
      page: 1,
      rows: 12
    }
    api.newget('/rest/memberCenter/getMemberCustomerList', data, 'GET', function (e) {
      that.setData({
        list: e.data.list,
        start: 1,
        webNextPage: e.data.webNextPage
      })
    })
  },




  /**
   * 
   * 跳转到意向客户详情
   * 
   */
  Potendetails: function (e) {
    wx.navigateTo({
      url: '../Potendetails/Potendetails?item=' + encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item)),
    })
  },


  /**
   * 分页
   */
  lower: async function () {
    var that = this
    // 内部员工和经纪人的潜在客户列表
    if (!that.data.webNextPage) {
      wx.showToast({
        title: '没有数据了...',
        icon: 'none'
      })
      return false
    }
    var startlower = that.data.start + 1
    if(this.data.memberId){
      let params = {
        page: startlower,
        rows: 12,
        memberId:this.data.memberId
      }
      let getMemberCustomerListByMemberId =  await requestCenter.getMemberCustomerListByMemberId(params)
      that.setData({
        list: that.data.list.concat(getMemberCustomerListByMemberId.list),
        start: getMemberCustomerListByMemberId.start,
        webNextPage: getMemberCustomerListByMemberId.webNextPage
      })
      return false
    }

    let data = {
      page: startlower,
      rows: 12
    }
    api.newget('/rest/memberCenter/getMemberCustomerList', data, 'GET', function (e) {
      // that.data.list .concat(e.data.list)
      that.setData({
        start: e.data.start,
        list: that.data.list.concat(e.data.list),
        webNextPage: e.data.webNextPage
      })


    })
  },
  // 时间筛选
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
})