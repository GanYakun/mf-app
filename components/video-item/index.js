// components/video-item/index.js
var api = require("../../utils/api.js")
import { parse, diff, format } from '../../utils/community-dateformat-utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoData: {
      type: Object,
      value: {
        "createName": "孙艳波",
        "createBy": "sunyanbo",
        "createDate": "2020-12-21 08:12:20",
        "updateName": "孙艳波",
        "updateBy": "sunyanbo",
        "updateDate": "2020-12-22 09:42:36",
        "sysOrgCode": "A01A01A01",
        "sysCompanyCode": "A01",
        "bpmStatus": "1",
        "title": "尚品宅配16800套餐",
        "audited": 1,
        "memberId": 172,
        "orderValue": 101,
        "praise": 0,
        "browseNum": 0,
        "belongStore": "22",
        "brandLog": "https://wj.100good.cn/group1/M00/00/E0/dDf7E1_f8w2AeOoYAAIomUgyz8I583.png",
        "vedioPath": "[{\"ext\":\"mp4\",\"fileName\":\"尚品宅配16800.mp4\",\"sysCompanyCode\":\"A01\",\"path\":\"group1/M00/00/E1/dDf7E1_hSPWAFhgVAB5sFp4RiEA652.mp4\",\"createBy\":\"sunyanbo\",\"fileSize\":1948,\"enable\":1,\"sysOrgCode\":\"A01A01A01\",\"id\":\"ff808081767a97180176881cbf7503fc\",\"contentType\":\"video/mp4\",\"createName\":\"孙艳波\",\"createDate\":1608601354000}]",
        "vedio": "ff808081767a97180176881cbf7503fc",
        "wapThumbnail": "ff808081766eb629017674cdff6d01c5",
        "pcThumbnail": "ff808081766eb629017674ce0c7f01c6",
        "contention": null,
        "briefContent": null,
        "subTitle": null,
        "seoTitle": null,
        "seoKeyword": null,
        "seoDescription": null,
        "recommend": 1,
        "reviewNum": null,
        "remen": 0,
        "wapThumbnailPath": "[{\"ext\":\"png\",\"fileName\":\"微信截图_20201218154336.png\",\"sysCompanyCode\":\"A01\",\"path\":\"group1/M00/00/E0/dDf7E1_cV6iARB9sABK43YIrZ4Y449.png\",\"createBy\":\"sunyanbo\",\"fileSize\":1199,\"enable\":1,\"sysOrgCode\":\"A01A01A01\",\"id\":\"ff808081766eb629017674cdff6d01c5\",\"contentType\":\"image/png\",\"createName\":\"孙艳波\",\"createDate\":1608277426000}]",
        "pcThumbnailPath": "[{\"ext\":\"png\",\"fileName\":\"微信截图_20201218154336.png\",\"sysCompanyCode\":\"A01\",\"path\":\"group1/M00/00/E0/dDf7E1_cV6uAOGCHABK43YIrZ4Y518.png\",\"createBy\":\"sunyanbo\",\"fileSize\":1199,\"enable\":1,\"sysOrgCode\":\"A01A01A01\",\"id\":\"ff808081766eb629017674ce0c7f01c6\",\"contentType\":\"image/png\",\"createName\":\"孙艳波\",\"createDate\":1608277429000}]",
        "collectMemberLogList": [{
          "headPath": "https://wj.100good.cn/group1/M00/00/E0/dDf7E1_dt5SAdlagAAAcecSTuaU074.jpg"
        }],
        "brandNam": "尚品宅配",
        "isCollect": 1,
        "collectId": 65,
        "id": 12,
        "type": "ppjs",
        "vedioPathParse": {
          "ext": "mp4",
          "fileName": "尚品宅配16800.mp4",
          "sysCompanyCode": "A01",
          "path": "https://wj.100good.cn/group1/M00/00/E1/dDf7E1_hSPWAFhgVAB5sFp4RiEA652.mp4",
          "createBy": "sunyanbo",
          "fileSize": 1948,
          "enable": 1,
          "sysOrgCode": "A01A01A01",
          "id": "ff808081767a97180176881cbf7503fc",
          "contentType": "video/mp4",
          "createName": "孙艳波",
          "createDate": 1608601354000
        },
        "wapThumbnailPathParse": {
          "ext": "png",
          "fileName": "微信截图_20201218154336.png",
          "sysCompanyCode": "A01",
          "path": "https://wj.100good.cn/group1/M00/00/E0/dDf7E1_cV6iARB9sABK43YIrZ4Y449.png",
          "createBy": "sunyanbo",
          "fileSize": 1199,
          "enable": 1,
          "sysOrgCode": "A01A01A01",
          "id": "ff808081766eb629017674cdff6d01c5",
          "contentType": "image/png",
          "createName": "孙艳波",
          "createDate": 1608277426000
        }
      },
      observer: function(newVal, oldVal) {
        var videoData = newVal
        this.setData({
          videoData: videoData
        })
      }
    },
    showPlayer: {
      type:Boolean,
      value:false,
      observer: function(newVal, oldVal) {
        var that = this
        this.setData({
          showPlayer:newVal
        })
        if(newVal) {
          var videoContext = wx.createVideoContext('player', that)
          if(videoContext) {
            videoContext.stop()
          }
          setTimeout(function() {
            var videoContext = wx.createVideoContext('player', that)
            if(videoContext) {
              videoContext.play()
            }
          }, 500)
        }
      }
    },
    position: {
      type: Number,
      value: -1,
      observer: function(newVal, oldVal) {
        // console.log('current', newVal)
        this.setData({
          position: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  lifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLogoLoadError: function(event) {
      var videoData = this.data.videoData
      // videoData.brandLog = "./images/mf_logo.png"
      videoData.searchOptionPath = "./images/mf_logo.png"
      // console.log("videoData.searchOptionPath", videoData.searchOptionPath)
      this.setData({
        videoData: videoData
      })
    },

    toCollect: function(event) {
      var that = this
      var videoData = this.data.videoData
      var isCollect = videoData.isCollect
      var postData = {}
      if(isCollect) {
        postData = {
          collectionId: videoData.collectId
        }
        api.newget("/rest/memberCenter/deleteCollectionById?collectionId=" + videoData.collectId, postData, "POST", (res) => {
          // videoData.isCollect = 0
          // var collectMemberLogList = videoData.collectMemberLogList
          // if(!collectMemberLogList) {
          //   collectMemberLogList = []
          // }
          // var preDeleteHeaderPath = getApp().globalData.imgur + getApp().globalData.userimg
          // var preDeleteIndex = -1
          // for(var i=0; i<collectMemberLogList.length; i++) {
          //   if(collectMemberLogList[i].headPath && collectMemberLogList[i].headPath == preDeleteHeaderPath) {
          //     preDeleteIndex = i
          //     break
          //   }
          // }
          // collectMemberLogList.splice(preDeleteIndex, 1)
          // var collectCount = videoData.collectCount
          // collectCount -= 1
          // videoData.collectCount = collectCount


          let video = res && res.data && res.data.vedio ? res.data.vedio:undefined
          if(video) {
            let collectMemberLogList = video.collectMemberLogList
            collectMemberLogList.forEach((item) => {
              item.headPath = getApp().globalData.imgur + "/" + item.headPath
            })
            videoData.isCollect = video.isCollect
            videoData.collectMemberLogList = collectMemberLogList
            videoData.collectCount = video.collectCount
            videoData.collectId = video.collectId
            that.setData({
              videoData: videoData
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
          // if(!collectMemberLogList) {
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
          let video = res && res.data && res.data.vedio ? res.data.vedio:undefined
          if(video) {
            let collectMemberLogList = video.collectMemberLogList
            collectMemberLogList.forEach((item) => {
              item.headPath = getApp().globalData.imgur + "/" + item.headPath
            })
            videoData.isCollect = video.isCollect
            videoData.collectMemberLogList = collectMemberLogList
            videoData.collectCount = video.collectCount
            videoData.collectId = video.collectId
            that.setData({
              videoData: videoData
            })
          }
        })
      }
    },

    onPlayTap: function(event) {
      var videoContext = wx.createVideoContext('player', this)
      this.triggerEvent("playtap", {})
    },

    toCommentList: function(event) {
      this.triggerEvent("comment", {})
    },

    toLike: function() {
      var that = this
      var videoData = that.data.videoData
      var hasPraise = videoData.hasPraise
      var postData = {
        vedioId: videoData.id
      }
      api.newget("/rest/shareApi/updateVedio?vedioId=" + videoData.id, postData, "POST", (res) => {
        var code = res.code
        if(code == 200) {
          var praise = res.data
          videoData.praise = praise
          videoData.hasPraise = true

          that.setData({
            videoData: videoData
          })
        }
      })
    }
  }
})
