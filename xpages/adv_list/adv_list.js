// xpages/adv_list/adv_list.js
var app = getApp()
import allAction from "../../utils/page-route"
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
    app.log('页面加载参数',JSON.parse(decodeURIComponent(options.source)))
    var source = JSON.parse(decodeURIComponent(options.source))
    this.setData({
      item:source
    })
  },
  action:function(e){
    console.log(e)
  },
   //所有楼层公告事件接收器
   onAction: function(event) {
    var action = new allAction()
    var eventType = event.detail.eventType
    var position = event.detail.position ? event.detail.position:0
    var item = this.data.item
    var detail = {
      eventType: eventType,
      position: position,
      source: item
    }
    action.onAction(detail)
  },
})