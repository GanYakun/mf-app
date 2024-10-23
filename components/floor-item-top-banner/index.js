// components/floor-item-top-banner/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topBanner: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
          _topBanner: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _topBanner: [],
    imgur: app.globalData.imgur,
    swheight: 0,
    current: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 
     * 轮播图自适应
     * 
     */
    goheight: function (e) {
      //图片的原始宽度
      let imagewidth = e.detail.width;
      //图片的原始高度
      let imageheight = e.detail.height
      //同步获取设备宽度
      let sysinfo = wx.getSystemInfoSync()
      //屏幕宽度
      let screenWidth = sysinfo.screenWidth
      //屏幕和原图的比例
      let scale = screenWidth / (imagewidth*1.0)
      //设置容器的高度
      console.log('imageHeight', scale)
      // console.log('swheight', imageheight * scale)
      this.setData({
        swheight: Math.floor(imageheight * scale * 1.0)
      })
    },

    onBannerChange: function(event) {
      var current = event.detail.current
      this.setData({
        current: current
      })
    },

    onAction: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position:0
      
      var _item = {
        adImageList: this.data._topBanner
      }
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },
  }
})
