const {
  strDiscode
} = require("../../wxParse/wxDiscode")

// components/leftbutton/index.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    toptitle: {
      type: String,
      value: '木菲美家',
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.setData({
            _toptitle: newVal
          })
        }
      },
    },
    componentData: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        app.log('componentData', newVal)
        this.setData({
          _componentData: newVal
        })

      }
    },
    customStyle: {
      type: String, //有特殊的样式需要传过来
      value: ''
    },
    videoStyle: {
      type: String,
      value: ''
    },
    isVideo: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    Iswxml: true
  },
  ready() {
    let that = this
    let pageMessage = wx.getSystemInfoSync()
    let capsuleMessage = wx.getMenuButtonBoundingClientRect()
    let ratio = 750 / pageMessage.windowWidth;
    let gap = capsuleMessage.top - pageMessage.statusBarHeight //胶囊按钮到状态栏的高度
    let menuHeight = capsuleMessage.height //右上角胶囊按钮的高度
    console.log(gap)
    let titleBarHeight = gap * 2 + menuHeight + 4 //标题栏高度
    that.setData({
      navHeight: Math.ceil((pageMessage.statusBarHeight + titleBarHeight) * ratio),
      leftboxTop: Math.ceil(capsuleMessage.top * ratio),
      leftboxleft: Math.ceil((pageMessage.windowWidth - capsuleMessage.right) * ratio),
      leftboxHeight: Math.ceil(capsuleMessage.height * ratio),
      leftBoxWidth: Math.ceil(capsuleMessage.width * ratio),
      statusBarHeight: Math.ceil(pageMessage.statusBarHeight * ratio)
    })
    app.globalData.LeftButtonnavHeight = Math.ceil((pageMessage.statusBarHeight + titleBarHeight) * ratio)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 
     * 返回上一页
     * */
    backpage: function () {
      wx.navigateBack({
        delta: 1,
        success: function (res) {
          console.log(res)
        },
        fail: (res) => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      })


    },

    /**
     * 
     * 回到首页
     */
    gohome: function () {
      app.globalData.newshareid = ''
      wx.reLaunch({
        url: '/pages/index/index',
      })
      console.log(app.globalData.newshareid)
    },
  }
})