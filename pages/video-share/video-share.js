// pages/video-share/video-share.js
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
        url: '../video-swiper/images/icon_collect_unselect.png',
        selectUrl: '../video-swiper/images/icon_collect_select.png'
      },
      {
        id: 2,
        title: '转发',
        url: '../video-swiper/images/icon_share.png'
      },
      {
        id: 3,
        title: '点赞',
        url: '../video-swiper/images/icon_favour_unselect.png',
        selectUrl: '../video-swiper/images/icon_favour_select.png'
      },
      {
        id: 4,
        title: '评论',
        url: '../video-swiper/images/icon_commit.png'
      }
    ],
    isPull: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let videoList = JSON.parse(decodeURIComponent(options.videoList))
    console.log('videoList', videoList)
    // this.setData({
    //   videoList: videoList
    // })
    // this.setData({
    //   videocurrent : parseInt(options.videocurrent)
    // })
    let data1 = {
      newsClassId: 244,
      start: 1,
      pageSize: 50,
    }
    let that = this
    api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
      console.log(e)
      let list = e.data.list
      // list = JSON.parse(list)
      for (let i = 0; i < list.length; i++) {
        list[i].vedioPathParse = JSON.parse(list[i].vedioPath)[0]
        list[i].vedioPathParse.path = getApp().globalData.imgur + list[i].vedioPathParse.path
        list[i].videoUrl = list[i].vedioPathParse.path
        videoList.push(list[i])
        
      }
      console.log(list)
      that.setData({
        videoList:videoList
      })
      // console.log(this.data.videoList)
      // var myEventDetail = {
      //   extendData: extendData,
      //   concats: e.data.list,
      //   chuancon: e.data,
      // }
      // var myEventOption = {}
      // that.triggerEvent('dianji', myEventDetail, myEventOption)
    })
  },

  onPlayChange: function (event) {
    console.log("onPlayChange", event)
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
          videoData.isCollect = 0
          var collectMemberLogList = videoData.collectMemberLogList
          if (!collectMemberLogList) {
            collectMemberLogList = []
          }
          var preDeleteHeaderPath = getApp().globalData.imgur + getApp().globalData.userimg
          var preDeleteIndex = -1
          for (var i = 0; i < collectMemberLogList.length; i++) {
            if (collectMemberLogList[i].headPath && collectMemberLogList[i].headPath == preDeleteHeaderPath) {
              preDeleteIndex = i
              break
            }
          }
          collectMemberLogList.splice(preDeleteIndex, 1)
          var collectCount = videoData.collectCount
          collectCount -= 1
          videoData.collectCount = collectCount
          console.log('videoData1', this.data.videoList)
          that.setData({
            videoList: this.data.videoList
          })
        })
      } else {
        postData = {
          collectionType: "vedio",
          collectionId: videoData.id
        }
        api.newget("/rest/memberCenter/addCollection", postData, "POST", (res) => {
          videoData.isCollect = 1

          var collectMemberLogList = videoData.collectMemberLogList
          if (!collectMemberLogList) {
            collectMemberLogList = []
          }
          var preAddHeaderPath = getApp().globalData.imgur + getApp().globalData.userimg
          collectMemberLogList.unshift({
            headPath: preAddHeaderPath
          })
          videoData.collectMemberLogList = collectMemberLogList
          var collectCount = videoData.collectCount
          collectCount += 1
          videoData.collectCount = collectCount
          console.log('videoData2', this.data.videoList)
          that.setData({
            videoList: this.data.videoList
          })
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
    console.log(res)
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