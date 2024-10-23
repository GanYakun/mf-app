// components/floor-item-step/index.js
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
    }
  }
})
