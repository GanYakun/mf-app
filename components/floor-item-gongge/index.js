// components/floor-item/index.js
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
        // app.log('floor-item-gongge 组件的newVal',newVal)
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
    //判断是否是内页的广告图列表
    isAdvList:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _item: null,
    imgur: app.globalData.imgur,
    _itemWidth: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAction: async function(event) {
      // await app.obtaintoken()
      // if (!app.globalData.token) {
      //   app.UserLoginToClick()
      //   return false
      // }
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position:0
      var adListType = event.currentTarget.dataset.adlistType
      app.log('floor-item-gongge组件 adListType',adListType)
      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item,
        adListType:adListType
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
    }
  }
})
