// components/comment-list-dialog/index.js
var api = require("../../utils/api.js")
var app = getApp()
import { parse, diff, format } from '../../utils/community-dateformat-utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        console.log('newVal', newVal)
        this.setData({
          start: 1,
          pageSize: 10,
          _show: newVal
        })
        if(newVal) {
          this.getFirstCommentList()
        }
      }
    },
    commentId: {
      type: String, 
      value: "",
      observer: function(newVal, oldVal) {
        this.setData({
          _commentId: newVal
        })
      } 
    },
    commentCount: {
      type: Number,
      value: 0,
      // observer: function(newVal, oldVal) {
      //   this.setData({
      //     commentCount: newVal
      //   })
      // }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    commentList: [],
    content: "",
    start: 1,
    pageSize: 10,
    totalPage: 1,
    tabindexHeight:app.globalData.tabIndexHeight
  },

  lifetimes: {
    attached: function() {
      console.log('show', this.data.show)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide: function(event) {
      this.setData({
        _show: false
      })
    },
    sendComment: function(event) {
      var that = this
      var commentList = that.data.commentList
      var content = event.detail.value
      var commentId = this.data._commentId
      var postData = {
        vedioId: commentId,
        content: content
      }
      api.newget("/rest/memberCenter/commentVedio", postData, "POST", (res) => {
        var code = res.code
        if(code == "200") {
          var data = res.data
          data.memberLogoPath = getApp().globalData.imgur + getApp().globalData.userimg
          data.memberName = getApp().globalData.username

          var diffTime = diff(data.createDate, new Date().getTime())
          var timeago = format(diffTime, {})
          data.timeago = timeago

          commentList.unshift(data)


          var commentCount = that.data.commentCount
          if(!commentCount) {
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
    scrollToLower: function(event) {
      this.loadMoreCommentList()
    },
    getFirstCommentList: function(res) {
      var commentId = this.data._commentId
      var start = this.data.start
      var pageSize = this.data.pageSize
      var postData = {
        page: start,
        rows: pageSize,
        vedioId: commentId
      }
      api.newget("/rest/shareApi/vedioComment?page=" + start + "&rows=" + pageSize + "&vedioId=" + commentId, postData, "POST", this.getCommentList.bind(this))
    },
    getCommentList: function(res) {
      console.log("res", res)
      var code = res.code
      if(code == "200") {
        var commentList = res.data.results
        var total = res.data.total
        var pageSize = this.data.pageSize

        var totalPage = 1
        if(total > 0) {
          if(total%pageSize > 1) {
            totalPage = Math.ceil(total/pageSize) + 1
          } else {
            totalPage = Math.ceil(total/pageSize)
          }
        }
        console.log("totalPage", totalPage)

        if(!commentList) {
          commentList = []
        }

        for(var i=0; i<commentList.length; i++) {
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
    loadMoreCommentList: function() {
      var commentId = this.data._commentId
      var start = this.data.start
      var pageSize = this.data.pageSize
      var totalPage = this.data.totalPage

      start += 1

      if(start >= totalPage) {
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
    moreCommentList: function(res) {
      var code = res.code
      if(code == "200") {
        var newCommentList = res.data.results
        var total = res.data.total
        var pageSize = this.data.pageSize

        var totalPage = 1
        if(total > 0) {
          if(total%pageSize > 1) {
            totalPage = Math.ceil(total/pageSize) + 1
          } else {
            totalPage = Math.ceil(total/pageSize)
          }
        }

        if(!newCommentList) {
          newCommentList = []
        }

        for(var i=0; i<newCommentList.length; i++) {
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
