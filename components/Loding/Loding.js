// components/Loding/Loding.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached: function() {
      
    console.log("created 生命周期被触发")
    var times = 0
    var that = this;
     var i = setInterval(function() {
          times++
          console.log(times)
          if (times ==7) {
               clearInterval(i)
               that.setData({
                // isClose:true,
                // closeLoding:false
               })
          } else {
              
          }
     }, 1000)
     that.setData({
      TimeInterval:i
     })
    },
    detached:function(){
      console.log("detached 生命周期被触发")
      clearInterval(this.data.TimeInterval)
        },
  },
 
  
  /**
   * 组件的初始数据
   */
  data: {
    closeLoding:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeLoding:function(){
      console.log('关闭')
      this.setData({
        closeLoding:false
      })
    }
  }
})
