// components/messagepopup/messagepopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    remark:{
  type:String,
  value:'弹窗里面的内容'
},
isshow:{
  type:Boolean,
  value:false
}
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
  // 关闭弹窗
  closes:function(){
    let that = this
    that.setData({
      isshow:false
    })
  },
  }
})
