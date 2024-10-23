// components/haosong-poster-dialog/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        this.setData({
          userimg: app.globalData.userimg,
          username: app.globalData.username
        })
      }
    },
    posterImage: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ftpurl:app.globalData.ftpurl,
    imageUrl: app.globalData.imgur,
    userimg: "",
    username: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose: function(event) {
      this.setData({
        show: false
      })
      this.triggerEvent("close", {})
    },

    authorSaveToAlbum: function(event) {
      wx.getSetting({
        complete: (res) => {
          if(!res || !res.authSetting["scope.writePhotosAlbum"]) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.saveToAlbum()
              },
              fail: (err) => {
                wx.showModal({
                  content: "保存相册失败，您需要在设置中打开\"添加到相册\"开关。",
                  cancelText: "取消",
                  confirmText: "去设置",
                  complete: res => {
                    if(res && res.confirm) {
                      wx.openSetting()
                    }
                  }
                })
              }
            })
          } else {
            this.saveToAlbum()
          }
        }
      })
    },

    saveToAlbum: function() {
      wx.saveImageToPhotosAlbum({
        filePath:this.data.posterImage,
        success() {
          wx.showToast({
            title: '保存成功！',
            icon:'none',
            interceptor:false,
          })
        },fail() {
          wx.showToast({
            title: '保存失败！',
            icon:'none',
            interceptor:false,
          })
        }
      })
    }
  }
})
