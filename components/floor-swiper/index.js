// components/floor-swiper/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgList: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
          _imgList: newVal
        })
      }
    },
    width: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        this.setData({
          _width: newVal
        })
      }
    },
    imgList2: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
          _imgList2: newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _imgList: [],
    imgur: app.globalData.imgur,
    current: 0,
    _width: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImageChange: function(event) {
      this.setData({
        current: event.detail.current
      })
    },

    onImageLoad: function(event) {
      console.log(event)
      var index = event.currentTarget.dataset.index
      var width = event.detail.width
      var height = event.detail.height
      var _imgList = this.data._imgList
      var ratio = 750 / app.globalData.SystemWidth
      let scale = app.globalData.SystemWidth / width
      var _height = Math.ceil((height * scale)*ratio)
      this.setData({
        SwiperHeight:_height
      })
      // if(!_imgList[index].height) {
      //   _imgList[index].height = Math.ceil(_width/(width/height))
      //   this.setData({
      //     _imgList: _imgList
      //   })
      // }
    },

    onImageError: function(event) {
      var index = event.currentTarget.dataset.index
      var _imgList = this.data._imgList
      
      if(_imgList[index].height == undefined) {
        _imgList[index].height = 0
        this.setData({
          _imgList: _imgList
        })
      }else{

      }
    },

    onBannerTap: function(event) {
      var position = event.currentTarget.dataset.position
      var sourcesType = event.currentTarget.dataset.sourcesType
      var detail = {
        position: position,
        sourcesType:sourcesType
      }
      this.triggerEvent("itemtap", detail)
    }
  }
})
