// components/activity-sign-dialog/activity-sign-dialog.js
const app = getApp()
import config from "../../http/config"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    times: {
      type: String,
    },
    imgurl:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ftpUrl: config.ftpUrl,
    hostUrl: app.globalData.hostUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹窗
    close(){
      this.setData({
        show: false
      })
    },
  }
})
