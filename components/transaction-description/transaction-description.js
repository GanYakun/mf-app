  var api = require("../../utils/api.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
    created(){
      api.newget('/rest/newsClass/getModel?newsClassId=230&objectId=251',{},'GET',(res)=>{
        console.log(res)
        this.setData({
          contentWap:res.data.contentWap
        })
      },0)
    },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
