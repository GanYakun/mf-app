// businesscard/server-in-help/server-in-help.js
import requestCenter from "../../http/request-center" 
import config from "../../http/config"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    ftpUrl:app.globalData.newFtpUrl,
    newFtpUrl: config.ftpUrl,
    hostUrl: app.globalData.hostUrl,
    tabs: ["木菲优惠券", "首进壕送", "签到特权"],
    currentTab: 0,
    start: 1,
    totalPage: 1,
    imageUrl: app.globalData.imgur,
    showWriteOffCode: false,
    writeOffCodeUrl: "",
    writeOffCodeName: "",
    receiveRecordList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // setTimeout(async() => {
      let type = options.type
      let currentTab = options && options.currentTab ? options.currentTab:this.data.currentTab
      this.setData({
        currentTab: currentTab
      })
      if(type=='meCoup'){
        if(currentTab == 0) {
          //木菲优惠券
          var getNxSererCouponList = await requestCenter.getMyCoupon({status:2})
        } else if(currentTab == 1) {
          //壕送领取记录
          var getNxSererCouponListResult = await requestCenter.getHaosongReceiveRecordList({
            start: 1
          })
          var getNxSererCouponList = getNxSererCouponListResult.results
          this.setData({
            start: getNxSererCouponListResult && getNxSererCouponListResult.page ? getNxSererCouponListResult.page:1,
            totalPage: getNxSererCouponListResult && getNxSererCouponListResult.pages ? getNxSererCouponListResult.pages:1
          })
        } else {
          //活动特权包领取记录
          var receiveRecord = await requestCenter.getMyReceiveRecordList({start: 1})
          var receiveRecordList = receiveRecord && receiveRecord.results ? receiveRecord.results:[] 
          this.setData({
            start: receiveRecord && receiveRecord.page ? receiveRecord.page:1,
            totalPage: receiveRecord && receiveRecord.pages ? receiveRecord.pages:1
          })
        }
      }else{
        //爱帮你家居服务
        var getNxSererCouponList = await requestCenter.getNxSererCouponList()
      }
      console.log(getNxSererCouponList)
      this.setData({
        coupList:getNxSererCouponList,
        receiveRecordList: receiveRecordList,
        type:type
      })
    // }, 2000);
  },
  shareCoup(e){
    let index = e.currentTarget.dataset.index
    let coupList = this.data.coupList
    wx.navigateTo({
      url: '/businesscard/server-in-help-detail/server-in-help-detail?item='+encodeURIComponent(JSON.stringify(coupList[index])),
    })
  },
  goUse(){
    //展示壕送领取记录核销二维码
    wx.navigateTo({
      url: '/xpages/server-shop/server-shop?categoryId=897',
    })
  },
  onTabClick: async function(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      currentTab: index
    })
    if(index == 0) {
      //木菲优惠券
      var getNxSererCouponList = await requestCenter.getMyCoupon({status:2})
      this.setData({
        coupList:getNxSererCouponList
      })
    } else if(index == 1){
      //壕送领取记录
      var getNxSererCouponListResult = await requestCenter.getHaosongReceiveRecordList({
        start: 1
      })
      var getNxSererCouponList = getNxSererCouponListResult && getNxSererCouponListResult.results ? getNxSererCouponListResult.results:[] 
      this.setData({
        start: getNxSererCouponListResult && getNxSererCouponListResult.page ? getNxSererCouponListResult.page:1,
        totalPage: getNxSererCouponListResult && getNxSererCouponListResult.pages ? getNxSererCouponListResult.pages:1,
        coupList:getNxSererCouponList,
      })
    } else {
      //活动特权包领取记录
      var receiveRecord = await requestCenter.getMyReceiveRecordList({start: 1})
      this.setData({
        start: receiveRecord && receiveRecord.page ? receiveRecord.page:1,
        receiveRecordList: receiveRecord && receiveRecord.results? receiveRecord.results: [],
        totalPage: receiveRecord && receiveRecord.pages ? receiveRecord.pages:1 
      })
      // console.log("---", receiveRecordList);
    }
  },

  loadMoreData: async function() {
    let index = this.data.currentTab
    if(index == 0) {

    } else if(index == 1) {
      let start = this.data.start
      if(start >= this.data.totalPage) {
        return
      }
      start += 1
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      var getNxSererCouponListResult = await requestCenter.getHaosongReceiveRecordList({
        start: start
      })
      var getNxSererCouponList = getNxSererCouponListResult && getNxSererCouponListResult.results ? getNxSererCouponListResult.results:[] 
      this.setData({
        start: start,
        totalPage: getNxSererCouponListResult && getNxSererCouponListResult.pages ? getNxSererCouponListResult.pages:1,
        coupList:this.data.coupList.concat(getNxSererCouponList),
      })
    } else {
      let start = this.data.start
      if(start >= this.data.totalPage) {
        return
      }
      start += 1
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      var receiveRecord = await requestCenter.getMyReceiveRecordList({start: start})
      let receiveRecordList = receiveRecord && receiveRecord.results? receiveRecord.results: []
      this.setData({
        start: receiveRecord && receiveRecord.page ? receiveRecord.page:1,
        receiveRecordList: this.data.receiveRecordList.concat(receiveRecordList),
        totalPage: receiveRecord && receiveRecord.pages ? receiveRecord.pages:1 
      })
    }
  },

  //点击去使用
  toUse(event){
    // let promotionsId = event.currentTarget.dataset.id
    // let promotionsStatus = event.currentTarget.dataset.status
    // if(promotionsStatus == "1"){  //1是有效
    //   wx.navigateTo({
    //     url: '../../businesscard/current-period/current-period?promotionsId=' + promotionsId
    //   })
    // }

    let promotionsId = event.currentTarget.dataset.id
    let promotionsStatus = event.currentTarget.dataset.status
    let recordId = event.currentTarget.dataset.recordId
    if(promotionsStatus == "1"){  //1是有效
      wx.navigateTo({
        url: '/member/privilege-package-list/privilege-package-list?recordId=' + recordId,
      })
    }
  },

  changeShowWriteOffCode(event) {
    let index = event.currentTarget.dataset.index
    let coupList = this.data.coupList
    let writeOffCodeUrl = this.data.imageUrl + "/" + coupList[index].writeOffCode
    let writeOffCodeName = coupList[index].name
    this.setData({
      showWriteOffCode: true,
      writeOffCodeUrl: writeOffCodeUrl,
      writeOffCodeName: writeOffCodeName
    })
  },

  //核销弹窗关闭
  onWriteOffCodeClose: async function() {
    //活动特权包领取记录
    var receiveRecord = await requestCenter.getMyReceiveRecordList({start: 1})
    var receiveRecordList = receiveRecord && receiveRecord.results ? receiveRecord.results:[] 
    this.setData({
      start: receiveRecord && receiveRecord.page ? receiveRecord.page:1,
      totalPage: receiveRecord && receiveRecord.pages ? receiveRecord.pages:1,
      receiveRecordList: receiveRecordList,
      showWriteOffCode: false,
    })
  },

  toHaosongRecordDetail: function(event) {
    let index = event.currentTarget.dataset.index
    let coupList = this.data.coupList
    wx.navigateTo({
      url: '/member/write_off/write_off?hid=' + coupList[index].id + '&rid=' + coupList[index].recordId,
    })
  }
})