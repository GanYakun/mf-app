// member/collection/collection.js
var app = getApp()
var api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // list: [{
    //     "iconPath": "images/tab_index_normal.png",
    //     "selectedIconPath": "images/tab_index_checked.png",
    //     "pagePath": "pages/index/index",
    //     "text": "首页"
    //   },
    //   {
    //     "iconPath": "images/tab_new_house.png",
    //     "selectedIconPath": "images/tab_new_house_checked.png",
    //     "pagePath": "pages/tab-classification/tab-classification",
    //     "text": "家居商城"
    //   },
    //   {
    //     "iconPath": "images/tab_old_house.png",
    //     "selectedIconPath": "images/tab_old_house_checked.png",
    //     "pagePath": "pages/tab-cart/tab-cart",
    //     "text": "购物车"
    //   },
    //   {
    //     "iconPath": "images/tab_renting_house.png",
    //     "selectedIconPath": "images/tab_renting_house_checked.png",
    //     "pagePath": "pages/tab-member/tab-member",
    //     "text": "我的"
    //   }
    // ],
    start: 1,
    pageSize: 12,
    rows: 12,
    videoList: [],
    playIndex: -1,
    page: 1,
    nextPage: false,
    searchId: "",
    videoSearchItem: [],
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    console.log(scrollHeight)
    that.setData({
      collectiontype: options.collectiontype,
      newsClassId: options.id,
      scrollHeight: scrollHeight
    })
    if (options.collectiontype == 'vedio') {
      const query = wx.createSelectorQuery()
      query.select(".vertical-scroll").boundingClientRect()
      query.exec((res) => {
        if (res[0]) {
          var contentHeight = res[0].height
          that.setData({
            contentHeight: contentHeight
          })
        } else {
          that.setData({
            contentHeight: 0
          })
        }
      })
      query.select('#casesearch').boundingClientRect()
      query.exec((res) => {
        console.log(res, '######')
        var searchHeight = res[1].height
        that.setData({
          searchHeight: searchHeight
        })
      })
      var searchId = that.data.searchId
      that.requestVideoList(searchId)
      // var data = {
      //   searchCode: 'video'
      // }
      // api.newget('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode?searchCode=video', data, 'GET', this.getVideoSearchItem)
    } else {
      that.first()
    }
  },
  // 取消收藏
  onDeleteTap: function (e) {
    console.log(e.currentTarget.dataset.id)
    let that = this

    //  let data ={
    //   collectionId:e.currentTarget.dataset.id
    //  }
    let data = {}
    api.newget('/rest/memberCenter/deleteCollectionById?collectionId=' + e.currentTarget.dataset.id, data, 'POST', function (e) {
      console.log(e)
      if (e.code == 200) {
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }

    })
    that.first()


  },
  first: function () {
    let that = this
    let tokens = app.globalData.token
    let data = {
      start: that.data.start,
      pageSize: that.data.pageSize,
      newsClassId: that.data.newsClassId,

      extendData: {
        searchTitle: "",
        collectionType: that.data.collectiontype
      }
    }
   
    api.newget('/rest/memberCenter/myCollectionList', data, 'GET', function (e) {
      if (e.code == 200) {
        that.setData({
          myCollectionList: e.data.list,
          imgurl: app.globalData.imgur
        })
      } else {
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
      }

    })

  },

  keyWord: function (e) {
    console.log(e.detail.value)
    let that = this
    that.setData({
      keyWord: e.detail.value
    })
  },
  // 搜索
  onSearchTap: function () {
    let that = this
    let keyWord = that.data.keyWord
    let tokens = app.globalData.token
    let page = that.data.page
    let rows = that.data.rows
    let collectiontype = that.data.collectiontype
    if (collectiontype == 'vedio') {
     let data = {
        page: page,
        rows: rows,
        collectType: collectiontype,
        title:keyWord
      }
    api.newget('rest/memberCenter/getCollectVedioList', data, 'GET', this.getVideoList)
    } else {
      let data = {
        start: that.data.start,
        pageSize: that.data.pageSize,
        newsClassId: that.data.newsClassId,
        extendData: {
          searchTitle:encodeURIComponent(keyWord),
          collectionType: that.data.collectiontype
        }
      }
    
      
      api.newget('/rest/memberCenter/myCollectionList', data, 'GET', function (e) {
        console.log(e)
        if (e.code == 200) {
          that.setData({
            myCollectionList: e.data.list,
            imgurl: app.globalData.imgur
          })
        } else {
          //  wx.showToast({
          //    title: e.message,
          //  })
        }
      })
    }

  },

  // 视频

  requestVideoList: function (searchId) {
    var start = 1
    var page = 1
    var pageSize = this.data.pageSize
    var rows = this.data.rows
    //视频列表
    var data = {}
    
    data = {
      page: page,
      rows: rows,
      collectType: this.data.collectiontype,
    }
  
    api.newget('rest/memberCenter/getCollectVedioList', data, 'GET', this.getVideoList)
  },

  getVideoList: function (res) {
    console.log(res, '视频列表')
    var that = this
    var videoList = []
    var nextPage = false
    var code = res.code
    if (code == 200) {
      var data = res.data
      nextPage = res.data.webNextPage
      if (data) {
        if (!data.list) {
          videoList = []
        }
        for (var i = 0; i < data.list.length; i++) {
          var videoPath = data.list[i].vedioPath
          if (videoPath) {
            data.list[i].brandLog = getApp().globalData.imgur + data.list[i].brandLog
            data.list[i].vedioPathParse = JSON.parse(data.list[i].vedioPath)[0]
            data.list[i].videoUrl = getApp().globalData.imgur + data.list[i].vedioPathParse.path
            data.list[i].vedioPathParse.path = getApp().globalData.imgur + data.list[i].vedioPathParse.path

            if (data.list[i].wapThumbnailPath) {
              data.list[i].wapThumbnailPathParse = JSON.parse(data.list[i].wapThumbnailPath)[0]
              data.list[i].wapThumbnailPathParse.path = getApp().globalData.imgur + data.list[i].wapThumbnailPathParse.path
            }

            var collectMemberLogList = data.list[i].collectMemberLogList
            if (!collectMemberLogList) {
              collectMemberLogList = []
            }
            for (var j = 0; j < collectMemberLogList.length; j++) {
              collectMemberLogList[j].headPath = getApp().globalData.imgur + collectMemberLogList[j].headPath
            }
            data.list[i].collectMemberLogList = collectMemberLogList
            videoList.push(data.list[i])
          }
        }
      }
    }
    this.setData({
      videoList: videoList,
      nextPage: nextPage
    })
  },

  onScroll: function (event) {
    var contentHeight = this.data.contentHeight

    var scrollHeight = event.detail.scrollHeight
    var scrollTop = event.detail.scrollTop

    var scrollPosition = scrollTop + contentHeight / 2
    var index = this.getCurrentPlayIndex(scrollPosition, scrollHeight)
    var playIndex = this.data.playIndex
    if (index != playIndex) {
      this.setData({
        playIndex: index
      })
    }
  },
  onVideoListInit: function (res) {
    var items = res.detail.items
    var listHeight = res.detail.listHeight
    var that = this
    that.setData({
      videoItems: items,
      listHeight: listHeight
    })
  },
  getCurrentPlayIndex: function (scrollPosition, scrollHeight) {
    var contentHeight = this.data.contentHeight
    var listHeight = this.data.listHeight ? this.data.listHeight : 0
    var top = scrollHeight - listHeight

    var current = -1
    var videoItems = this.data.videoItems
    if (!videoItems || videoItems.length <= 0) {
      return -1
    }
    var offset = top - videoItems[0].top
    for (var i = 0; i < videoItems.length; i++) {
      if (scrollPosition >= (videoItems[i].top + offset) && scrollPosition <= (videoItems[i].bottom + offset)) {
        current = i
        break
      }
    }

    return current
  },

  loadMoreVideo: function (event) {
    var that = this
    var nextPage = that.data.nextPage
    var start = this.data.start
    var page = this.data.page
    var pageSize = this.data.pageSize
    var rows = this.data.rows
    var searchId = this.data.searchId
    if (!nextPage) {
      return
    }
    page += 1
    this.setData({
      page: page,
      playIndex: -1
    })
    //视频列表
    var data = {}
    
    data = {
      page: page,
      rows: rows,
      collectType: this.data.collectiontype,
    }
    api.newget('rest/memberCenter/getCollectVedioList', data, 'GET', this.moreVideoList)
  },

  moreVideoList: function (res) {
    var that = this
    var videoList = []
    var nextPage = false
    var code = res.code
    if (code == 200) {
      var data = res.data
      nextPage = res.data.webNextPage
      if (data) {
        var length = data.list.length
        if (!data.list) {
          videoList = []
          length = 0
        }
        for (var i = 0; i < length; i++) {
          console.log("data.list", i)
          var videoPath = data.list[i].vedioPath
          if (videoPath) {
            data.list[i].brandLog = getApp().globalData.imgur + data.list[i].brandLog
            data.list[i].vedioPathParse = JSON.parse(data.list[i].vedioPath)[0]
            data.list[i].videoUrl = getApp().globalData.imgur + data.list[i].vedioPathParse.path
            data.list[i].vedioPathParse.path = getApp().globalData.imgur + data.list[i].vedioPathParse.path

            if (data.list[i].wapThumbnailPath) {
              data.list[i].wapThumbnailPathParse = JSON.parse(data.list[i].wapThumbnailPath)[0]
              data.list[i].wapThumbnailPathParse.path = getApp().globalData.imgur + data.list[i].wapThumbnailPathParse.path
            }

            var collectMemberLogList = data.list[i].collectMemberLogList
            if (!collectMemberLogList) {
              collectMemberLogList = []
            }
            for (var j = 0; j < collectMemberLogList.length; j++) {
              collectMemberLogList[j].headPath = getApp().globalData.imgur + collectMemberLogList[j].headPath
            }
            data.list[i].collectMemberLogList = collectMemberLogList
            videoList.push(data.list[i])
          }
        }
      }
    }
    var oldVideoList = this.data.videoList
    var newVideoList = oldVideoList.concat(videoList)
    console.log("nextPage", nextPage)
    this.setData({
      videoList: newVideoList,
      nextPage: nextPage
    })
  },

  shop:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/xpages/shop/shop' + '?newsClassId=' + 155 + '&NeworderType=' + 0 + '&objectId=' + e.currentTarget.dataset.id + '&categoryId=' + 155
      //categoryId只限产品部分，筛选时候用得倒，可能是cid
    })
  },

  successfulCase:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    // console.log(newsClassId)
  wx.navigateTo({
    url: '/xpages/land/land?objectId=' + id + "&newsClassId=147" ,
  })
  },

  //毛坯房精装房跳转
  perfectHomeCase(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let objectId = e.currentTarget.dataset.homeid
    let myCollectionList = this.data.myCollectionList
    let newsClassId = myCollectionList[index].homeEntity.newsClassId 
    if(newsClassId == 8){
      newsClassId = 127
    }else if(newsClassId==10){
      newsClassId = 129
      wx.navigateTo({
        url: '/xpages/selectedchecklist/selectedchecklist?newsClassId='+newsClassId+'&objectId='+objectId,
      })
      return false
    }else{
      newsClassId = 128
    }
  
    let searchTitle = myCollectionList[index].searchTitle
    wx.navigateTo({
      url: '/xpages/checklist/checklist'+'?newsClassId='+newsClassId+'&objectId='+objectId+'&pagetitle='+searchTitle+'&type='+0,
    })
  },

    //定制家具的跳转
  customFurn(e){
    let objectId = e.currentTarget.dataset.caseId
    console.log(objectId)
    wx.navigateTo({
      url: '/pages/customized_home/customized_home'+'?newsClassId='+226+'&objectId='+objectId,
    })
  }

})