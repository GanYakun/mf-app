// pages/shangpin_home/shangpin_home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperimg:[
      '/images/img/topbanner.jpg',
      '/images/img/design.png',
      '/images/img/1.jpg',
    ],
    news_swiper:[
      {
        imgurl:"/images/img/1.jpg",
        title:"尚品宅配“5180㎡耀势绽放试营开业”现金大奖、买橱柜送电器，全城惠动重磅来袭"
      },
      {
        imgurl:"/images/img/design.png",
        title:"尚品宅配“5180㎡耀势绽放试营开业”现金大奖、买橱柜送电器，全城惠动重磅来袭"
      },{
        imgurl:"/images/img/1.jpg",
        title:"尚品宅配“5180㎡耀势绽放试营开业”现金大奖、买橱柜送电器，全城惠动重磅来袭"
      },
    ],
    menulist:[
      {
        imgurl:"/images/icon/flcn2.png",
        title:"全屋"
      },
      {
        imgurl:"/images/icon/flcn5.png",
        title:"卧房"
      },
      {
        imgurl:"/images/icon/flcn6.png",
        title:"儿童房"
      },
      {
        imgurl:"/images/icon/flcn7.png",
        title:"书房"
      },
      {
        imgurl:"/images/icon/flcn8.png",
        title:"客餐厅"
      },
      {
        imgurl:"/images/icon/flcn9.png",
        title:"多功能房"
      },
      {
        imgurl:"/images/icon/flcn3.png",
        title:"昆明展厅"
      },
      {
        imgurl:"/images/icon/flcn10.png",
        title:"最新活动"
      },
      {
        imgurl:"/images/icon/flcn9.png",
        title:"多功能房"
      },
      {
        imgurl:"/images/icon/flcn3.png",
        title:"昆明展厅"
      },
      {
        imgurl:"/images/icon/flcn10.png",
        title:"最新活动"
      },
    ],
    box1_lists:[
      {
        imgurl:"/images/icon/icn1.png",
        title:"免费在线预约"
      },
      {
        imgurl:"/images/icon/icn2.png",
        title:"免费上门量尺"
      },
      {
        imgurl:"/images/icon/icn3.png",
        title:"免费设计装修效果"
      },
    ],
    tabbar:[
      {
        name:'热点',
        imgurl:"/images/img/1.jpg",
        title:"ftyghuio",
        imgs:[
          "/images/img/1.jpg",
          "/images/img/1.jpg",
          "/images/img/1.jpg",
        ]
      },
      {
        name:'热点',
        imgurl:"/images/img/1.jpg",
        title:"ftyghuio",
        imgs:[
          "/images/img/1.jpg",
          "/images/img/1.jpg",
          "/images/img/1.jpg",
        ]
      },
      {
        name:'热点',
        imgurl:"/images/img/1.jpg",
        title:"ftyghuio",
        imgs:[
          "/images/img/1.jpg",
          "/images/img/1.jpg",
          "/images/img/1.jpg",
        ]
      },
      {
        name:'定制书柜',
        imgurl:"/images/img/1.jpg",
        title:"ftyghuio",
        imgs:[
          "/images/img/1.jpg",
          "/images/img/1.jpg",
          "/images/img/1.jpg",
        ]
      },
      {
        name:'定制书柜',
        imgurl:"/images/img/1.jpg",
        title:"ftyghuio",
        imgs:[
          "/images/img/1.jpg",
          "/images/img/1.jpg",
          "/images/img/1.jpg",
        ]
      },
      {
        name:'定制书柜',
        imgurl:"/images/img/1.jpg",
        title:"ftyghuio",
        imgs:[
          "/images/img/1.jpg",
          "/images/img/1.jpg",
          "/images/img/1.jpg",
        ]
      },



      // '定制榻榻米',
      // '定制衣帽间',
      // '定制电视柜',
      // '定制书柜',
      // '定制书柜',
      // '定制书柜',
      // '定制书柜',
    ],
    tabbar1:[
      '热点',
      '咨讯',
      '问答',
      '热点',
      '咨讯',
      '问答',
    ],
    author_list:[
      {
        userimg:"/images/img/1.jpg",
        name:"ctf",
        store:"万达店",
        popularity:"324"
      },
      {
        userimg:"/images/img/1.jpg",
        name:"ctf",
        store:"万达店",
        popularity:"324"
      },
      {
        userimg:"/images/img/1.jpg",
        name:"ctf",
        store:"万达店",
        popularity:"324"
      },
      {
        userimg:"/images/img/1.jpg",
        name:"ctf",
        store:"万达店",
        popularity:"324"
      },
      {
        userimg:"/images/img/1.jpg",
        name:"ctf",
        store:"万达店",
        popularity:"324"
      },

    ],
    headlines_lists:[
     {
       htitle:"昆明尚品宅配环保吗？有甲醛超标？",
       imgurl:"/images/img/1.jpg",
       title:"【尚品宅配】“味”爱下厨，烹制有爱私房菜",
       date:"2020-08-19"
     }
    ],
    comment_list:[
      {
        userimg:"/images/img/4.jpg",
        title:"【给家里增添一些家具，气质瞬间飙升】",
        decr:"【恒大玖龙湾】给家里增添一些家具，有儿童",
        imgs:[
          '/images/img/1.jpg',
          '/images/img/1.jpg',
          '/images/img/1.jpg',
        ],
        date:"2020-08-19",
        praise:"2",
      }
    ],
    indicatorDots: false,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色 
    afterColor: "coral",//当前选中的指示点颜色 
    previousmargin:'30px',//前边距
    nextmargin:'30px',//后边距
    functionsCurrent:0,
    swiperCurrent:0,
    currentindex:0,
    currentindex1:0,
    currentTab:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  slide:function(e){
    var page = this;
    page.setData({
      currentindex1: e.detail.current
        //获取当前轮播图片的下标
       })
  },

  click:function(e){
    var page = this;
    var cur = e.currentTarget.dataset.current;
    if (page.data.currentindex == cur) {
      return false;
      } else {
        page.setData({
        currentindex: cur
      })
      }
  },
  click1:function(e){
    var page = this;
    var cur1 = e.currentTarget.dataset.current1;
    if (page.data.currentindex1 == cur1) {
      return false;
      } else {
        page.setData({
        currentindex1: cur1
      })
      }
  },


   //轮播图的切换事件 
 swiperChange: function (e) {
  var page = this;
  page.setData({
    currentindex: e.detail.current
     })

 },
//  swiperfunctions: function (e) {
//   var page = this;
//   page.setData({
//     functionsCurrent: e.detail.current
//      })

//  },
 swiperChange1: function (e) {
  var page = this;
  page.setData({
 swiperCurrent: e.detail.current
  //获取当前轮播图片的下标
 })
 },
//  chuangfunctions: function (e) { 
//   console.log(e)
//   page.setData({
//     functionsCurrent: e.currentTarget.id
// })
// },
 //滑动图片切换 
 chuangEvent1: function (e) { 
  console.log(e)
  page.setData({
swiperCurrent: e.currentTarget.id
})
},
 //滑动图片切换 
 chuangEvent: function (e) { 
  var page = this;
   console.log(e)
   page.setData({
  currentindex: e.currentTarget.id
 })
 },
 clickTab: function (e) {
  var page = this;
  console.log(e)
  if (page.data.currentindex === e.currentTarget.dataset.index) {
    return false;
  } else {
    page.setData({
      currentindex: e.currentTarget.dataset.index
    })
  }
},
changeencyclopedia: function (e) {
  var page = this;
  page.setData({
    currentindex: e.detail.current
     })

 },
})