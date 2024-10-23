// pages/video-swiper/video-swiper.js
var api = require("../../utils/api.js")
var app = getApp()
import {
  parse,
  diff,
  format
} from '../../utils/community-dateformat-utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoStyle: 'background-color: transparent;',
    commentList: [],
    content: "",
    start: 1,
    pageSize: 10,
    totalPage: 1,
    tabindexHeight: app.globalData.tabIndexHeight,
    funtionList: [{
        id: 1,
        title: '收藏',
        url: './images/icon_collect_unselect.png',
        selectUrl: './images/icon_collect_select.png'
      },
      {
        id: 2,
        title: '转发',
        url: './images/icon_share.png'
      },
      {
        id: 3,
        title: '点赞',
        url: './images/icon_favour_unselect.png',
        selectUrl: './images/icon_favour_select.png'
      },
      {
        id: 4,
        title: '评论',
        url: './images/icon_commit.png'
      }
    ],
    isPull: false,
    circular: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let videoMessage = JSON.parse(decodeURIComponent(options.params))
    console.log('videoMessage', videoMessage)
    this.setData({
      videoMessage: videoMessage,
      videoList: videoMessage.videoList,
      currentIndex: videoMessage.current
    })
  },

  //滑动加载
  loadMoreVideo: function (event) {
    var nextPage = true
    var start = this.data.start
    if (!nextPage) {
      app.showToastMessage('暂无数据')
      return
    }
    start += 1
    this.setData({
      start: start
    })
    //视频列表
    var data = {}
    console.log('nextMore')
    data = {
      start: start,
      pageSize: 10,
      newsClassId: 244,
      // extendData: this.data.newextendData ? this.data.newextendData : ''

    }
    api.newget('/rest/newsClass/getPageModel', data, 'GET', this.moreVideoList, true, () => {
      this.setData({
        circular: true
      })
    })
  },

  moreVideoList: function (res) {
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
    console.log("nextPage", newVideoList)
    this.setData({
      videoList: newVideoList,
      nextPage: nextPage,
      circular: true
    })
  },

  onPlayChange: function (event) {
    console.log("onPlayChange", event)
    console.log('videoList', this.data.videoList)
    let current = event.detail.current
    this.setData({
      current: current,
      isPull: false
    })
  },

  onPlay(e) {
    console.log('play', e)
    let query = wx.createSelectorQuery()
    let query1 = wx.createSelectorQuery()
    query.select('.title-view').boundingClientRect(rect => {
      let titleWidth = rect.width
      console.log('titleWidth', titleWidth)
      query1.select('.title-text').boundingClientRect(rect => {
        let textWidth = rect.width
        console.log('textWidth', textWidth)
        if (textWidth > titleWidth) {
          this.setData({
            hidden: false
          })
        } else {
          this.setData({
            hidden: true
          })
        }
      }).exec()
    }).exec()
  },

  pullTap() {
    var commentIndex = this.data.current
    console.log('commentIndex', commentIndex)
    if (commentIndex == -1) {
      return
    }
    this.setData({
      _show: true,
      isTitle: true,
      commentIndex: commentIndex
    })
    this.getFirstCommentList()
    // if (this.data.isPull) {
    //   this.setData({
    //     isPull: false
    //   })
    // } else {
    //   this.setData({
    //     isPull: true
    //   })
    // }
  },

  functionTap(e) {
    let index = e.currentTarget.dataset.index
    let current = this.data.current
    if (index == 0) {
      var that = this
      var videoData = that.data.videoList[current]
      var isCollect = videoData.isCollect
      var postData = {}
      if (isCollect) {
        postData = {
          collectionId: videoData.collectId
        }
        api.newget("/rest/memberCenter/deleteCollectionById?collectionId=" + videoData.collectId, postData, "POST", (res) => {
          // videoData.isCollect = 0
          // var collectMemberLogList = videoData.collectMemberLogList
          // if (!collectMemberLogList) {
          //   collectMemberLogList = []
          // }
          // var preDeleteHeaderPath = getApp().globalData.imgur + getApp().globalData.userimg
          // var preDeleteIndex = -1
          // for (var i = 0; i < collectMemberLogList.length; i++) {
          //   if (collectMemberLogList[i].headPath && collectMemberLogList[i].headPath == preDeleteHeaderPath) {
          //     preDeleteIndex = i
          //     break
          //   }
          // }
          // collectMemberLogList.splice(preDeleteIndex, 1)
          // var collectCount = videoData.collectCount
          // collectCount -= 1
          // videoData.collectCount = collectCount
          // console.log('videoData1', this.data.videoList)
          // that.setData({
          //   videoList: this.data.videoList
          // })

          let videoData = res && res.data && res.data.vedio ? res.data.vedio:undefined
          if(videoData) {
            let videoList = that.data.videoList
            videoList[current] = videoData
            that.setData({
              videoList: videoList
            })
          }
        })
      } else {
        postData = {
          collectionType: "vedio",
          collectionId: videoData.id
        }
        api.newget("/rest/memberCenter/addCollection", postData, "POST", (res) => {
          // videoData.isCollect = 1

          // var collectMemberLogList = videoData.collectMemberLogList
          // if (!collectMemberLogList) {
          //   collectMemberLogList = []
          // }
          // var preAddHeaderPath = getApp().globalData.imgur + getApp().globalData.userimg
          // collectMemberLogList.unshift({
          //   headPath: preAddHeaderPath
          // })
          // videoData.collectMemberLogList = collectMemberLogList
          // var collectCount = videoData.collectCount
          // collectCount += 1
          // videoData.collectCount = collectCount
          // console.log('videoData2', this.data.videoList)
          // that.setData({
          //   videoList: this.data.videoList
          // })
          let videoData = res && res.data && res.data.vedio ? res.data.vedio:undefined
          if(videoData) {
            let videoList = that.data.videoList
            videoList[current] = videoData
            that.setData({
              videoList: videoList
            })
          }
        })
      }
    } else if (index == 2) {
      var that = this
      var videoData = that.data.videoList[current]
      var hasPraise = videoData.hasPraise
      var postData = {
        vedioId: videoData.id
      }
      api.newget("/rest/shareApi/updateVedio?vedioId=" + videoData.id, postData, "POST", (res) => {
        var code = res.code
        if (code == 200) {
          var praise = res.data
          videoData.praise = praise
          videoData.hasPraise = true

          that.setData({
            videoList: this.data.videoList
          })
        }
      })
    } else if (index == 3) {
      var commentIndex = current
      console.log('commentIndex', commentIndex)
      if (commentIndex == -1) {
        return
      }
      this.setData({
        _show: true,
        isTitle: false,
        commentIndex: commentIndex
      })
      this.getFirstCommentList()
    }
  },

  hide: function (event) {
    this.setData({
      _show: false
    })
  },
  sendComment: function (event) {
    var that = this
    var commentList = that.data.commentList
    var content = event.detail.value
    let commentIndex = that.data.current
    var commentId = that.data.videoList[commentIndex].id
    var postData = {
      vedioId: commentId,
      content: content
    }
    api.newget("/rest/memberCenter/commentVedio", postData, "POST", (res) => {
      var code = res.code
      if (code == "200") {
        var data = res.data
        data.memberLogoPath = getApp().globalData.imgur + getApp().globalData.userimg
        data.memberName = getApp().globalData.username

        var diffTime = diff(data.createDate, new Date().getTime())
        var timeago = format(diffTime, {})
        data.timeago = timeago

        commentList.unshift(data)

        let commentIndex = that.data.current
        var commentCount = that.data.videoList[commentIndex].commentCount
        if (!commentCount) {
          commentCount = 0
        }
        commentCount += 1
        that.setData({
          commentList: commentList,
          content: "",
          commentCount: commentCount
        })
      }
    })
  },
  scrollToLower: function (event) {
    this.loadMoreCommentList()
  },
  getFirstCommentList: function (res) {
    let commentIndex = this.data.current
    var commentId = this.data.videoList[commentIndex].id
    var start = this.data.start
    var pageSize = this.data.pageSize
    var postData = {
      page: start,
      rows: pageSize,
      vedioId: commentId
    }
    api.newget("/rest/shareApi/vedioComment?page=" + start + "&rows=" + pageSize + "&vedioId=" + commentId, postData, "POST", this.getCommentList.bind(this))
  },
  getCommentList: function (res) {
    console.log("res", res)
    var code = res.code
    if (code == "200") {
      var commentList = res.data.results
      var total = res.data.total
      var pageSize = this.data.pageSize

      var totalPage = 1
      if (total > 0) {
        if (total % pageSize > 1) {
          totalPage = Math.ceil(total / pageSize) + 1
        } else {
          totalPage = Math.ceil(total / pageSize)
        }
      }
      console.log("totalPage", totalPage)

      if (!commentList) {
        commentList = []
      }

      for (var i = 0; i < commentList.length; i++) {
        commentList[i].memberLogoPath = getApp().globalData.imgur + commentList[i].memberLogoPath
        var diffTime = diff(commentList[i].createDate, new Date().getTime())
        var timeago = format(diffTime, {})
        commentList[i].timeago = timeago
      }
      this.setData({
        commentList: commentList,
        totalPage: totalPage
      })
    }
  },
  loadMoreCommentList: function () {
    let commentIndex = this.data.current
    var commentId = this.data.videoList[commentIndex].id
    var start = this.data.start
    var pageSize = this.data.pageSize
    var totalPage = this.data.totalPage

    start += 1

    if (start >= totalPage) {
      return
    }

    this.setData({
      start: start
    })
    var postData = {
      page: start,
      rows: pageSize,
      vedioId: commentId
    }
    api.newget("/rest/shareApi/vedioComment?page=" + start + "&rows=" + pageSize + "&vedioId=" + commentId, postData, "POST", this.moreCommentList.bind(this))
  },
  moreCommentList: function (res) {
    var code = res.code
    if (code == "200") {
      var newCommentList = res.data.results
      var total = res.data.total
      var pageSize = this.data.pageSize

      var totalPage = 1
      if (total > 0) {
        if (total % pageSize > 1) {
          totalPage = Math.ceil(total / pageSize) + 1
        } else {
          totalPage = Math.ceil(total / pageSize)
        }
      }

      if (!newCommentList) {
        newCommentList = []
      }

      for (var i = 0; i < newCommentList.length; i++) {
        newCommentList[i].memberLogoPath = getApp().globalData.imgur + newCommentList[i].memberLogoPath
        var diffTime = diff(newCommentList[i].createDate, new Date().getTime())
        var timeago = format(diffTime, {})
        newCommentList[i].timeago = timeago
      }
      var commentList = this.data.commentList
      var allCommentList = commentList.concat(newCommentList)
      this.setData({
        commentList: allCommentList,
        totalPage: totalPage
      })
    }
  }
})