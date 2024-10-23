// components/floor-item-headlines/floor-item-headlines.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:[],
      observer:function(newVal,oldVal){
        let id = newVal.adImageList.newsClass.id
        let name = '全部'
        let iconVo = newVal.adImageList.newsClass.iconVo
        newVal.filterList.unshift({
          name:name,
          id:id,
          iconVo:iconVo
        })
        app.log('今日头条组件item数据',newVal)
        this.setData({
          _item:newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgur:app.globalData.imgur
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
  }
})
