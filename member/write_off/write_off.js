// member/write_off/write_off.js
const app = getApp()
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgur,
    isShare: false,
    status: "加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let scene = options.scene
    let haosongId = ""
    let recordId = ""
    let isShare = false

    if(scene) {
      scene = decodeURIComponent(scene)
      let query = app.getQueryValue(scene)
      console.log("onLoad", query)
      haosongId = query.hid
      recordId = query.rid
      isShare = true
    } else {
      haosongId = options.hid
      recordId = options.rid
      isShare = false
    }
    
    this.setData({
      haosongId: haosongId,
      recordId: recordId,
      isShare: isShare
    })

    let haosongReceiveRecordDetailResult = await requestCenter.getHaosongReceiveRecordDetail({
      recordId: recordId
    })

    if(!haosongReceiveRecordDetailResult) {
      this.setData({
        status: "暂无内容"
      })
    }

    this.setData({
      haosongReceiveRecordDetail: haosongReceiveRecordDetailResult
    })
  },

  confirmWriteOff: async function() {
    let recordId = this.data.recordId
    let haosongWriteOffResult = await requestCenter.confirmHaosongWriteOff({
      recordId: recordId
    })
    wx.showToast({
      title: '核销成功',
      icon:'none',
      interceptor:false,
    })
    let timer = setTimeout(() => {
      wx.reLaunch({
        url: '/pages/index/index',
      })
      clearTimeout(timer)
    }, 3000)
  }
})