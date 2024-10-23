// member/intent_customer/intent_customer.js
import requestCenter from "../../http/request-center" 
import config from "../../http/config"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    newFtpUrl:app.globalData.newFtpUrl,
    ftpUrl: config.ftpUrl,
    monthSignNum: "",
    allSignNum: "",
    totalNum: "",
    isLeader:false,
    dataList:[],
    startTime:"",
    endTime:"",
    inputName:"",
    start:1,
    totalPage:1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log("onLoad", options)
    let issuerMemberId = options.issuerMemberId || ""
    let issuerUserName = options.issuerUserName || "意向客户"
    this.setData({
      issuerMemberId: issuerMemberId,
      issuerUserName: issuerUserName
    })
    this.getMyCustomerList()
    this.getMyCustomerTotal()
  },

  //员工我的进店(活动被签到)列表
  async getMyCustomerList(){
    let getMyCustomerList = await requestCenter.getMyCustomerListByHaoSong({
      memberId: this.data.issuerMemberId
    })
    let dataList = getMyCustomerList.results
    this.setData({
      totalPage: getMyCustomerList && getMyCustomerList.pages ? getMyCustomerList.pages:1,
      dataList:dataList,
      totalNum:getMyCustomerList.total
    })
  console.log(this.data.dataList)
  },

  //员工我的进店(活动被签到)顶部统计
  async getMyCustomerTotal(){
    let getMyCustomerTotal = await requestCenter.getMyCustomerTotalByHaoSong({
      memberId: this.data.issuerMemberId
    })

    this.setData({
    
      monthSignNum: getMyCustomerTotal.monthlyAddition,
      allSignNum: getMyCustomerTotal.cumulative,
      isLeader:getMyCustomerTotal.leader
    })
  },

  bindInput(e){
    this.data.inputName = e.detail.value
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
  onSearchKeyInput: function(event) {
    this.setData({
      inputName: event.detail.value
    })
  },
  async serch(){
    let myCustomerList = await requestCenter.getMyCustomerListByHaoSong({
      'name':this.data.inputName,
      'beginTime':this.data.startTime,
      'endTime':this.data.endTime,
      memberId: this.data.issuerMemberId
    })
    console.log(myCustomerList)
    this.setData({
      dataList:myCustomerList.results,
      totalNum:myCustomerList.total
    })},

    async reset(){
      this.setData({
      startTime:"",
      endTime:"",
      inputName:""
      })
      this.serch()
    },
    loadMoreData: async function(event) {
      let start = this.data.start
      if(start >= this.data.totalPage) {
        return
      }
      start += 1
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let getMyCustomerList = await requestCenter.getMyCustomerListByHaoSong({start: start})
      let dataList = getMyCustomerList && getMyCustomerList.results ? getMyCustomerList.results:[]
      this.setData({
        dataList: this.data.dataList.concat(dataList),
        totalPage: getMyCustomerList && getMyCustomerList.pages ? getMyCustomerList.pages:1,
        start: start
      })
    },

    toAdmin: function(event) {
      wx.navigateTo({
        url: '/member/intent_customer_admin/intent_customer_admin',
      })
    }
  



  

})