// components/floor-item-top-menu/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topMenu: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
          _topMenu: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _topMenu: [],
    imgur: app.globalData.imgur,
    current: 0,
    isShowMenu:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMenuPageChange: function(event) {
      var current = event.detail.current
      this.setData({
        current: current
      })
    },

    onAction: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position:0
      
      var _item = {
        adImageList: this.data._topMenu
      }
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },
    //隐藏菜单栏
    close(){
      app.log('isShowMenu',this.data.isShowMenu)
      this.setData({
        isShowMenu:!this.data.isShowMenu
      })
      let detail = {
        isShowMenu:this.data.isShowMenu,
        height:this.data.isShowMenu?215:50
      }
      this.triggerEvent("hidemenu", detail)
    }
  }
})
