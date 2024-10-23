// pages/video-list/video-list.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    playIndex: 0,
    start: 1,
    pageSize: 20,
    nextPage: false,
    searchId: "",
    videoSearchItem: [],
    curTab: 0,
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    HeadScrr:true //是否显示顶部的筛选功能
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    app.log('视频列表参数pages/video-list/video-list', options)
    var that = this
    if(options.isHead && options.isHead!='undefined'){
      that.setData({
        HeadScrr:false
      })
    }
    var searchId = options.newsClassId
    let extendData = JSON.stringify({
      belongStore: options.belongStore&&options.belongStore!='null' ? options.belongStore : '',
      type: options.type ? options.type : '',
      memberId: options.memberId ? options.memberId : ''
    })
    this.setData({
      newextendData: extendData,
      extendData:extendData
    })
    //转发后携带的参数
    var shareData = options.shareData
    if (shareData) {
      shareData = JSON.parse(decodeURIComponent(shareData))
      var videoId = shareData.videoData.id
      var videoData = await this.requestVideoById(videoId)
      shareData.videoData = videoData
      this.setData({
        shareData: shareData
      })
    }

    const query = wx.createSelectorQuery()
    query.select(".vertical-scroll").boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        var contentHeight = res[0].height
        this.setData({
          contentHeight: contentHeight
        })
      } else {
        this.setData({
          contentHeight: 0
        })
      }
    })
    this.setData({
      searchId: searchId
    })

    var videoTitle = options.videoTitle ? options.videoTitle:""
    if(videoTitle) {
      this.setData({
        topTitle: videoTitle,
        titleSet: true
      })
    }

    that.requestVideoList(searchId)

    var data = {
      searchCode: 'video'
    }
    api.newget('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode?searchCode=video', data, 'GET', this.getVideoSearchItem)
  },

  requestVideoList: function (searchId) {
    var start = 1
    var pageSize = this.data.pageSize
    //视频列表
    var data = {}
    let extendData = this.data.extendData
    if(extendData){
      var extendDataPase = JSON.parse(extendData)
      extendDataPase['searchOption'] = searchId
    }
    if (searchId &&searchId!=244 ) {
      console.log('来这里1')
      data = {
        start: start,
        pageSize: pageSize,
        newsClassId: 244,
        extendData: extendDataPase
      }
    } else {
      console.log('来这里2')
      console.log('extendData', this.data.newextendData)
      data = {
        start: start,
        pageSize: pageSize,
        newsClassId: 244,
        extendData: this.data.newextendData ? this.data.newextendData : ''
      }
    }
    api.newget('/rest/newsClass/getPageModel', data, 'GET', this.getVideoList)
  },

  requestVideoById: function (videoId) {
    var start = 1
    var pageSize = 20
    var data = {
      start: start,
      pageSize: pageSize,
      newsClassId: 244,
      extendData: JSON.stringify({
        vedioId: videoId
      })
    }

    return new Promise((resolve, reject) => {
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function (res) {
        var videoList = []
        var code = res.code
        if (code == 200) {
          var data = res.data
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
        if (videoList.length > 0) {
          resolve(videoList[0])
        } else {
          resolve(null)
        }
      })
    })
  },

  getVideoList: function (res) {
    var that = this
    var shareData = that.data.shareData
    var videoList = []
    var nextPage = false
    var code = res.code
    if (code == 200) {
      var data = res.data
      nextPage = res.data.webNextPage
      that.setData({
          noData:res.data.list.length>0?false:true
      })
      if (data) {
        if(!that.data.titleSet) {
          that.setData({
            topTitle: data.newsClass.name
          })
        }
        if (!data.list) {
          videoList = []
        }
        var shareIndex = -1
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

            if (shareData && shareData.videoData && shareData.videoData.id == data.list[i]) {
              shareIndex = i
            }

            videoList.push(data.list[i])
          }
        }
        console.log("shareIndex", shareIndex)
        if (shareIndex != -1) {
          videoList.splice(shareIndex, 1)
        }
      }
    }
    if (shareData && shareData.videoData) {
      videoList.unshift(shareData.videoData)
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

  //滑动加载
  loadMoreVideo: function (event) {
    var that = this
    var nextPage = that.data.nextPage
    var start = this.data.start
    var pageSize = this.data.pageSize
    var searchId = this.data.searchId
    if (!nextPage) {
      app.showToastMessage('暂无数据')
      return
    }
    start += 1
    this.setData({
      start: start,
      playIndex: -1
    })
    //视频列表
    var data = {}
    if (searchId) {
      data = {
        start: start,
        pageSize: pageSize,
        newsClassId: 244,
        // extendData:this.data.newextendData?this.data.newextendData:''
        extendData: JSON.stringify({
          searchOption: searchId
        })
      }
    } else {
      console.log('nextMore2')
      console.log('extendData', this.data.newextendData)
      data = {
        start: start,
        pageSize: pageSize,
        newsClassId: 244,
        extendData: this.data.newextendData ? this.data.newextendData : ''

      }
    }
    api.newget('/rest/newsClass/getPageModel', data, 'GET', this.moreVideoList)
  },

  moreVideoList: function (res) {
    var that = this
    var shareData = that.data.shareData
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
        var shareIndex = -1
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

            if (shareData && shareData.videoData && shareData.videoData.id == data.list[i]) {
              shareIndex = i
            }
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

  getVideoSearchItem: function (res) {
    var that = this
    var searchId = that.data.searchId
    var curTab = 0

    var code = res.code
    if (code == 200) {
      var data = res.data
      if (!data) {
        data = []
      }
      for (var i = 0; i < data.length; i++) {
        data[i].imageVo.imagePath = getApp().globalData.imgur + data[i].imageVo.imagePath
      }
      data.unshift({
        imageVo: {
          fileName: "全部"
        },
        searchName: "全部",
        newsClassId:''
      })
      for (var i = 0; i < data.length; i++) {
        if (searchId == data[i].id) {
          curTab = i
        }
      }
      that.setData({
        videoSearchItem: data,
        curTab: curTab
      })
    }
  },
  onTabTap: function (event) {
    this.setData({
      shareData:''
    })
    console.log("event", event)
    var id = event.currentTarget.dataset.id
    var index = event.currentTarget.dataset.index
    if (!id) {
      id = ""
    }
    this.setData({
      searchId: id,
      curTab: index,
      scrollTop:0
    })
    this.requestVideoList(this.data.searchId)
  }
})