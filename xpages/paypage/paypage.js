// xpages/paypage/paypage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.doajishi()
    console.log(options)
    this.setData({
      status:options.status,
      timestamp:options.timestamp,
      price:options.price
    })
  },


  doajishi: function (e) {
    let that = this
    let time = that.data.time
    if (time == 0) {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      if(time>0){
        that.setData({
          time: time-1
        })
        console.log(time-1)
        setTimeout(that.doajishi, 1000);
      }else{ 
      }  
    }
   
  },
/**
 * 
 * 监听页面卸载
 * 
 * 
 */
  onUnload:function(){
this.setData({
  time:-1
})
  },

  blacka:function(){
    wx.navigateBack({
      delta: 2,
    })
  }
  
})