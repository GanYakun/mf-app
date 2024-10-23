// member/activity_sign/activity_sign.js
const app = getApp()
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    imgurl:app.globalData.imgur,
    activitySignList: [],
    isShow: false,
    qrCodeUrl: "",
    times: "",
    start: 1,
    totalPage: 1
  },

   /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let getActivitySignList = await requestCenter.getActivitySignList({start: this.data.start})
    this.setData({
      activitySignList: getActivitySignList && getActivitySignList.results ? getActivitySignList.results:[],
      totalPage: getActivitySignList && getActivitySignList.pages ? getActivitySignList.pages:1
    })
  },

  //点击生成二维码
  async clickSign(event){
    let index = event.currentTarget.dataset.index
    let item = this.data.activitySignList[index]
    //生成签到二维码
    let getEmployeeCode = await requestCenter.getEmployeeCode({huodongId: item.id})
    this.setData({
      qrCodeUrl: getEmployeeCode && getEmployeeCode.employeeCode ? getEmployeeCode.employeeCode:"",
      isShow: true,
      times: item.receiveStartTime + " ~ " + item.receiveEndTime
    })
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
    let getActivitySignListResult = await requestCenter.getActivitySignList({start: start})
    let activitySignList = getActivitySignListResult && getActivitySignListResult.results ? getActivitySignListResult.results:[]
    this.setData({
      activitySignList: this.data.activitySignList.concat(activitySignList),
      totalPage: getActivitySignListResult && getActivitySignListResult.pages ? getActivitySignListResult.pages:1,
      start: start
    })
  }
})