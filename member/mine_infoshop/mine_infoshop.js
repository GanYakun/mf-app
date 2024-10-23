// member/mine_infoshop/mine_infoshop.js
const app = getApp()
import config, { getMyCustomerList } from "../../http/config"
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    newFtpUrl:app.globalData.newFtpUrl,
    ftpUrl: config.ftpUrl,
    monthCount:0,
    allCount:0,
    dataList:[],
    isLeader:false,
    startTime:"",
    endTime:"",
    inputName: "",
    start:1,
    totalPage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let issuerMemberId = options.issuerMemberId || ""
    let issuerUserName = options.issuerUserName || "我的签到"
    this.setData({
      issuerMemberId: issuerMemberId,
      issuerUserName: issuerUserName
    })

    let myCustomerTotal = await requestCenter.getMyCustomerTotal({
      memberId: this.data.issuerMemberId
    })
    let myCustomerList = await requestCenter.getMyCustomerList({
      memberId: this.data.issuerMemberId
    })

    this.setData({
      totalPage: myCustomerList && myCustomerList.pages ? myCustomerList.pages:1,
      monthCount:myCustomerTotal.monthlyAddition,
      allCount:myCustomerList.total,
      dataList:myCustomerList.results,
      isLeader:myCustomerTotal.leader
})
console.log(this.data.dataList)


  },

  startTime(e){
    this.setData({
      startTime:e.detail.value
    })
    console.log(e.detail)
  }
  ,
  endTime(e){
    this.setData({
      endTime:e.detail.value
    })

  },

  bindInput(e){
   this.data.inputName = e.detail.value
  },

  async serch(){
    let myCustomerList = await requestCenter.getMyCustomerList({
      'name':this.data.inputName,
      'beginTime':this.data.startTime,
      'endTime':this.data.endTime,
      memberId: this.data.issuerMemberId
    })
    console.log(myCustomerList)
    this.data.start = 0;
    this.setData({
      totalPage: getMyCustomerList && getMyCustomerList.pages ? getMyCustomerList.pages:1,
      dataList:myCustomerList.results,
      allCount:myCustomerList.total
    })


  },


  async reset(){
    this.setData({
    startTime:"",
    endTime:"",
    inputName:""
    })
    this.serch()
  },

  loadMoreData: async function(event) {
    console.log("触发了")
    let start = this.data.start
    console.log("长度是",this.data.start,this.data.totalPage)
    if(start >= this.data.totalPage) {
      return
    }
    start += 1
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let getMyCustomerList = await requestCenter.getMyCustomerList({
      start: start,
      memberId: this.data.issuerMemberId
    })
    let dataList = getMyCustomerList && getMyCustomerList.results ? getMyCustomerList.results:[]
    this.setData({
      dataList: this.data.dataList.concat(dataList),
      totalPage: getMyCustomerList && getMyCustomerList.pages ? getMyCustomerList.pages:1,
      start: start
    })
  },
  
  toAdmin: function(event) {
    wx.navigateTo({
      url: '/member/mine_customer_admin/mine_customer_admin',
    })
  }
  
})