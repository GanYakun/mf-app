// pages/decoration_process/decoration_process.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },

      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
      {
        title:'开工保护',
        time:"2020-8-19"
      },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  process_details:function(){
    wx.navigateTo({
      url: '../../xpages/process_details/process_details'
    })
  }
})