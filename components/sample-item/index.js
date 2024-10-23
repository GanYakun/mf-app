// components/sample-item/index.js
// 样品特卖item
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sampleData: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        var sampleData = newVal
        if(!sampleData.picUrl) {
          sampleData.picUrl = ""
        }
        sampleData.picUrl = getApp().globalData.imgur + sampleData.picUrl
        this.setData({
          _sampleData: sampleData
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _sampleData: null
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
