// components/video-list/index.js
var api = require("../../utils/api.js")
var app = getApp()
import {
  parse,
  diff,
  format
} from '../../utils/community-dateformat-utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        var that = this
        var videoList = newVal
        const query = that.createSelectorQuery()
        query.select(".video-list").boundingClientRect()
        query.exec((res) => {
          var itemWidth = res[0].width
          for (var i = 0; i < videoList.length; i++) {
            if (videoList[i].duration) {
              videoList[i].durationStr = that.formatDuration(Number(videoList[i].duration))
            }
            if (videoList[i].width && videoList[i].height) {
              videoList[i].videoHeight = that.getVideoHeight(videoList[i].width, videoList[i].height, itemWidth)
            }
            if (!videoList[i].searchOptionPath) {
              videoList[i].searchOptionPath = ""
            }
            videoList[i].searchOptionPath = getApp().globalData.imgur + videoList[i].searchOptionPath
            // videoList[i].videoUrl = videoList[i].vedioPathParse.path
          }
          // console.log('videoList', videoList)
          that.setData({
            _videoList: videoList
          })

          const query = that.createSelectorQuery()
          query.selectAll(".video-item").boundingClientRect()
          query.exec((res) => {
            var items = res[0]
            const query = that.createSelectorQuery()
            query.select(".video-list").boundingClientRect()
            query.exec((res) => {
              var listHeight = res[0].height
              that.triggerEvent("oninit", {
                items,
                listHeight
              })
            })
          })
        })
      }
    },
    current: {
      type: Number,
      value: -1,
      observer: function (newVal, oldVal) {
        this.setData({
          current: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playerList: [],
    _videoList: [],
    showCommentList: false,
    commentIndex: -1,
    commentList: [],
    content: "",
    start: 1,
    pageSize: 10,
    totalPage: 1,
    tabindexHeight: app.globalData.tabIndexHeight
  },

  lifetimes: {
    attached: function () {

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPlayTap: function (event) {
      var current = event.currentTarget.dataset.index
      this.setData({
        current: current
      })
    },
    formatDuration: function (a) {
      var b = ""
      var h = parseInt(a / 3600),
        m = parseInt(a % 3600 / 60),
        s = parseInt(a % 3600 % 60);
      if (h > 0) {
        h = h < 10 ? '0' + h : h
        b += h + ":"
      }
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      b += m + ":" + s
      return b;
    },
    getVideoHeight: function (width, height, itemWidth) {
      var ratio = Number(width) * 1.0 / Number(height)
      var videoHeight = itemWidth / ratio

      return videoHeight
    },
    onComment: function (event) {
      console.log(event)
      var commentIndex = event.currentTarget.dataset.index
      console.log('commentIndex', commentIndex)
      if (commentIndex == -1) {
        return
      }
      this.setData({
        _show: true,
        commentIndex: commentIndex
      })
      this.getFirstCommentList()
    },

    toVideoSwiper(e) {
      let index = e.currentTarget.dataset.index
      let params = {
        title: this.data._videoList[index].title,
        searchOptionPath: this.data._videoList[index].searchOptionPath,
        searchOptionName: this.data._videoList[index].searchOptionName,
        videoList: this.data._videoList,
        current: index
      }
      wx.navigateTo({
        url: '/pages/video-swiper/video-swiper?params=' + encodeURIComponent(JSON.stringify(params)),
      })
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
      let commentIndex = that.data.commentIndex
      var commentId = that.data._videoList[commentIndex].id
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

          let commentIndex = that.data.commentIndex
          var commentCount = that.data._videoList[commentIndex].commentCount
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
      let commentIndex = this.data.commentIndex
      var commentId = this.data._videoList[commentIndex].id
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
      let commentIndex = this.data.commentIndex
      var commentId = this.data._videoList[commentIndex].id
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
  }
})