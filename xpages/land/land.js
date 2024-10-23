var api = require("../../utils/api.js")
var WxParse = require("../../wxParse/wxParse.js")
var app = getApp()
import pageRote from "../../utils/page-route"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshowhtml: true,
    iosDialog2: false,
    imgur: app.globalData.imgur,
    tabIndexHeight: app.globalData.tabIndexHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.log('页面加载参数', options)
    // wx.setNavigationBarTitle({
    //   title: options.casetitle,
    // })
    this.setData({
      newsClassId: options.newsClassId, //  模型id
      objectId: options.objectId //案例的id
    })
    let data1 = {
      newsClassId: options.newsClassId,
      objectId: options.objectId
    }

    let data2 = {
      newsClassId: options.newsClassId
    }
    //得到模型数据
    api.request('/rest/newsClass/getModel', data1, 'GET', this.getModel)
    //根据newsClassId得到服务保证项
    api.request('/rest/tWebWxBannerControllerApi/getServiceIconByNewsClassId', data2, 'GET', this.getServiceIconByNewsClassId)

    // 根据successfulCaseId浏览数增加
    let data4 = {
      // successfulCaseId: options.objectId
    }
    api.request('/rest/tWebSuccessfulCaseControllerApi/successfulCaseBrowseNumUp?successfulCaseId=' + options.objectId, data4, 'PUT', function (e) {
      console.log(e)
    })

    //查询装修效果图详情页的广告图   ID固定
    let data3 = {
      rootId: 41,
      SearchRowNum: 1
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', data2, 'GET', this.getWxBannerByRootIdKey)
  },

  //回调函数
  getModel(e) {
    var that = this
    let article = e.data.articleText
    console.log(e)
    var setType
    if((e.data&&e.data.topImageImageVo&&e.data.topImageImageVo.imagePath)||imagePathImageVoList.length>0){
      setType = 'photo'
    }else if(e.data&&e.data.videoVo&&e.e.data.videoVo.imagePath){
      setType='video'
    }else if(e.data&&e.data.vrUrlMain){
      setType='VR'
    }
    console.log(setType)
    that.setData({
      modelList: e.data,
      TopTitle: e.data.caseTitle,
      shareTitle:e.data.caseTitle,
      setType:setType,
      caseMessage: {
        isCollect: e.data.isCollect,
        collectionId: e.data.id,
        collectionType: 'successfulCase',
        newsClassId: that.data.newsClassId
      },
      wxBannerList:e.data.wxBannerList

    })
    if (article == null) {
      that.setData({
        isshowhtml: true
      })
    } else {
      that.setData({
        isshowhtml: false
      })
      WxParse.wxParse('article', 'html', article, that, 5);
    }

    //根据successfulCaseId得到同组作品
    let data = {
      successfulCaseId: e.data.id
    }
    api.request('/rest/tWebSuccessfulCaseControllerApi/getGroupSuccessCaseByCaseId', data, 'GET', function (e) {
      that.setData({
        greenworkslist: e.data
      })
      e.data.splice(0, 1)
      that.setData({
        greenworkslists: e.data
      })

    })
  },
  //根据newsClassId得到服务保证项的回调函数
  getServiceIconByNewsClassId(e) {
    if (e) {
      wx.hideLoading({
        success: (res) => {},
      })
    }
    this.setData({
      hasboxedvalue: e.data
    })

  },

  hasboxedvalue: function () {

  },
  //查询装修效果图详情页的广告图的回调函数
  getWxBannerByRootIdKey(e) {
    this.setData({
      adimage:e.data&&e.data[0]&&e.data.imageVo?e.data[0].imageVo.imagePath:''
    })
  },

  // 同款作品点击事件
  scrollitem(e) {
    console.log(e)
    let data1 = {
      newsClassId: this.data.newsClassId,
      objectId: e.currentTarget.dataset.id
    }
    //得到模型数据
    api.request('/rest/newsClass/getModel', data1, 'GET', this.getModel)
  },

  // 装修效果图的收藏事件
  getcollection(e) {
    let that = this;
    let data = {
      // collectionId:that.data.greenworkslist[0].id,
      collectionId: that.data.objectId,
      collectionType: 'successfulCase'
    }
    let modelList = e.currentTarget.dataset.modelList
    app.log('页面model模型', modelList)
    let isCollect = modelList.isCollect
    //存在收藏id  需要取消收藏
    if (isCollect) {
      api.newget('/rest/memberCenter/deleteCollectionById?collectionId=' + isCollect, {}, 'POST', function (e) {
        if (e.code == 200) {
          wx.showToast({
            title: '取消收藏成功',
            icon: 'none'
          })
          that.setData({
            ['modelList.isCollect']: false
          })
        }
      })
    } else {
      // 添加收藏
      api.newget('/rest/memberCenter/addCollection', data, 'POST', function (e) {
        wx.showToast({
          title: e.message,
          icon: 'none',
          duration: 1500
        })
        let data1 = {
          newsClassId: that.data.newsClassId,
          objectId: modelList.id
        }
        api.request('/rest/newsClass/getModel', data1, 'GET', function (res) {
          that.setData({
            ['modelList.isCollect']: res.data.isCollect
          })
        })


      })
    }

  },
  //组件绑定的收藏事件
  Collection(e) {
    app.log('组件绑定的收藏事件xpages/land/land', e)
    this.setData({
      ['caseMessage.isCollect']: e.detail.isCollect
    })
  },

  onPopupTap: function (e) {
    let that = this
    let remark = e.currentTarget.dataset.remark
    that.setData({
      iosDialog22: true,
      remark: remark
    })
  },

  //生成海报
  share: function () {
    wx.navigateTo({
      url: '../../xpages/poster/poster',
    })
  },

  switchTap(e){
    let type = e.target.dataset.type
    if(type){
      this.setData({
        setType:type
      })
    }
  },
  //跳转到webview
  vrPage: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/xpages/h5page/h5page?url=' +encodeURIComponent(e.currentTarget.dataset.vrurl),
    })
  },

   //设计师详情
   DesignerDetails:function(e){
    wx.navigateTo({
      url: '/xpages/allhouse_detail/allhouse_detail?id=' + e.currentTarget.dataset.id + "&newsClassId=121"+'&Popupornot='+e.currentTarget.dataset.popupornot,
    })
  },
  //拎包案例的品牌广告图点击事件
  wxBannerTap(event){
    let newPageRote = new pageRote()
    let index =event.currentTarget.dataset.index
    let wxBannerList = this.data.wxBannerList
    let params={
      eventType: 'brandBanner',
      position: index?index:0,
      source: wxBannerList
    }
    newPageRote.onAction(params)
  }
})