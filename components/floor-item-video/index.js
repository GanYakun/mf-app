// components/floor-item-video/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        var videoList = newVal && newVal.adImageList && newVal.adImageList.list ? newVal.adImageList.list:[]
        for(var i=0; i<videoList.length; i++) {
          var videoPath = videoList[i].vedioPath
          if(videoPath) {
            videoList[i].brandLog = getApp().globalData.imgur + videoList[i].brandLog
            videoList[i].vedioPathParse = JSON.parse(videoList[i].vedioPath)[0]
            videoList[i].videoUrl = getApp().globalData.imgur + videoList[i].vedioPathParse.path
            videoList[i].vedioPathParse.path = getApp().globalData.imgur + videoList[i].vedioPathParse.path

            if(videoList[i].wapThumbnailPath) {
              videoList[i].wapThumbnailPathParse = JSON.parse(videoList[i].wapThumbnailPath)[0]
              videoList[i].wapThumbnailPathParse.path = getApp().globalData.imgur + videoList[i].wapThumbnailPathParse.path
            }

            var collectMemberLogList = videoList[i].collectMemberLogList
            if(!collectMemberLogList) {
              collectMemberLogList = []
            }
            for(var j=0; j<collectMemberLogList.length; j++) {
              collectMemberLogList[j].headPath = getApp().globalData.imgur + collectMemberLogList[j].headPath
            }
            videoList[i].collectMemberLogList = collectMemberLogList
          }
        }
        newVal.adImageList.list = videoList
        newVal.filterList.unshift({
          id:'',
          searchName:'全部',
          ftpImg:app.globalData.ftpurl+'/plug-in/aykjmobile/images/all_video.png'
        })
        this.setData({
          _item: newVal
        })
      }
    },
    itemWidth: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        this.setData({
          _itemWidth: newVal
        })
      }
    },
    playIndex: {
      type: Number,
      value: -1,
      observer: function(newVal, oldVal) {
        this.setData({
          _playIndex: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _item: null,
    imgur: app.globalData.imgur,
    _itemWidth: 0,
    _playIndex: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAction: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position:0
      
      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },

    onBannerTap: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.detail.position

      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },

    onVideoListInit: function(res) {
      var items = res.detail.items
      var listHeight = res.detail.listHeight
      this.triggerEvent("videoinit", res.detail)
    },
  }
})
