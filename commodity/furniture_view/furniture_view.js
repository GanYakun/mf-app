// pages/furniture_view/furniture_view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:[
      {
        img:"/images/img/1.jpg",
        title:"rdftgyhujkl"
      },
      {
        img:"/images/img/1.jpg",
        title:"rdftgyhujkl"
      },
      {
        img:"/images/img/1.jpg",
        title:"rdftgyhujkl"
      },
    ],
   
    indicatorDots: false,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色 
    afterColor: "coral",//当前选中的指示点颜色 
    previousmargin:'30px',//前边距
    nextmargin:'30px',//后边距
    swiperCurrent:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //轮播图的切换事件 
 swiperChange: function (e) {
   console.log(e)
  console.log(e.detail.current);
  this.setData({
  swiperCurrent: e.detail.current //获取当前轮播图片的下标
  })
  },
  //滑动图片切换 
  chuangEvent: function (e) { 
    console.log(e)
  this.setData({
  swiperCurrent: e.currentTarget.id
  })
  },
  //免费设计预约
  appointment_design:function(){
    wx.navigateTo({
      url: '../appointment_design/appointment_design'
    })
  }

  
})