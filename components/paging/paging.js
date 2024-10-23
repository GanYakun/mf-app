// components/paging/paging.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listzujian:{
      type: Object, 
      value:''
    },
    maxStart: {
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '最大页数'   
    },
    currentPageNo:{
      type: String, 
      value:'当前页数'
    },
  
    
  },

  /**
   * 组件的初始数据
   */
  data: {
isshow:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    xuanze:function(){
      this.setData({
        isshow:!this.data.isshow
      })
    },
   //选择第几页
    onParentEvent: function(event){
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        index:event.currentTarget.dataset.index
      } 
      // 触发事件的选项
      var myEventOption = {} 
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('parentEvent', myEventDetail, myEventOption)
      this.setData({
        isshow:!this.data.isshow
      })
    },

    //下一页
    nextafter:function(event){
      var myEventDetail = {
        index:event.currentTarget.dataset.index
      } 
      var myEventOption = {} 
      this.triggerEvent('nextpad', myEventDetail, myEventOption)
    },

    //上一页
    upafter:function(event){
      var myEventDetail = {
        index:event.currentTarget.dataset.index
      } 
      var myEventOption = {} 
      this.triggerEvent('uptpad', myEventDetail, myEventOption)
    }
  }
})
