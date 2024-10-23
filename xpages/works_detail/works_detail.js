var api = require("../../utils/api.js")
var WxParse = require("../../wxParse/wxParse.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
isshowhtml:true,
iosDialog22:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.getSystemInfo({
      success: res => {
      // 获取可使用窗口宽度、高度、比例
      let windowHeight = res.windowHeight;
      let windowWidth = res.windowWidth;
      let ratio = 750 / windowWidth;
      let pageWindowHeight = Math.ceil(windowHeight * ratio);
      console.log(pageWindowHeight)
      this.setData({
        pageWindowHeight:pageWindowHeight,
        newsClassId:options.newsClassId,
        objectId:options.id
      })
}
})
    let data1={
      newsClassId:options.newsClassId,
      objectId:options.id
    }
    
    let data2={
      newsClassId:options.newsClassId
    }
    //得到模型数据
    api.request('/rest/newsClass/getModel', data1, 'GET',this.getModel)
    //根据newsClassId得到服务保证项
    api.request('/rest/tWebWxBannerControllerApi/getServiceIconByNewsClassId', data2, 'GET',this.getServiceIconByNewsClassId)

    // 根据successfulCaseId浏览数增加
    //查询装修效果图详情页的广告图   ID固定
    let data3 ={
      rootId:2,
      SearchRowNum:1
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', data3, 'GET',this.getWxBannerByRootIdKey)
  },

  //回调函数
  getModel(e){
    if(e){
wx.hideLoading({
  success: (res) => {},
})
    }
    var that =this
    let article = e.data.articleText
 
console.log(e)
    that.setData({
  modelList:e.data,
  imgur:app.globalData.imgur,
  TopTitle:e.data.caseTitle
})
if(article==null){
  that.setData({
    isshowhtml:true
  })
}
else{
  that.setData({
    isshowhtml:false
  })
  WxParse.wxParse('article', 'html', article, that, 5);
}

  },
  //根据newsClassId得到服务保证项的回调函数
  getServiceIconByNewsClassId(e){
    if(e){
      wx.hideLoading({
        success: (res) => {},
      })
    }
    this.setData({
      hasboxedvalue:e.data
    })
   
  },

  hasboxedvalue:function(){

  },
    //查询装修效果图详情页的广告图的回调函数
  getWxBannerByRootIdKey(e){
this.setData({
  adimage:e.data[0].imageVo.imagePath
})
  },

  // 装修效果图的收藏事件
  getcollection(e){
    console.log(e)
    let that = this;
    if(app.globalData.token==undefined){
      let userinfoss = wx.getStorageSync('xuserixnfo')
      if(userinfoss==""){
        that.setData({
          iosDialog1:true
        })
      }else{
        that.setData({
          iosDialog2:true
        })
      }
      
     }else{
       console.log(app.globalData.token)
      let data={
        // collectionId:that.data.greenworkslist[0].id,
        collectionId:e.currentTarget.dataset.id,
       collectionType:'successfulCase'
     }
     let tokens = app.globalData.token
     let header={
       'content-type': 'application/json',
       'X-AUTH-TOKEN':tokens
     }
     // 添加收藏
         api.xpost('/rest/memberCenter/addCollection',data,'POST', header,function (e) {
          wx.showToast({
            title: e.message,
            icon: 'none',
            duration: 1500
          })
       })
     }
  
  
    
  },
  onPopupTap:function(e){
    let that = this
    let remark = e.currentTarget.dataset.remark
    if(remark){
      that.setData({
        iosDialog22:true,
        remark:remark
      })
    }
  
  },
  // 关闭弹窗
  closes:function(){
    let that = this
    that.setData({
      iosDialog22:false
    })

  },
  onShow: function () {
    

  },
  
  kefu:function(){
    wx.navigateTo({
      url: '/xpages/contact/contact',
    })
  }
})
