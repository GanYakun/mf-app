// member/update_photo/update_photo.js
var app = getApp()
var api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setTime: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  chooseImage: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imagepath: res.tempFilePaths,
          imgurl: app.globalData.imgur
        })
        wx.uploadFile({
          url: 'http://mf.100good.cn/rest/memberCenter/imageUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart/form-data",
            'X-AUTH-TOKEN': app.globalData.token
          },
          formData: {
            "user": "test",
          },
          success(res) {
            console.log('77777' + res.data)
            // wx.showToast({
            //   title: res.data.message,
            //   icon:"none"
            // })
            that.setData({
              logo:res.data
            })
           
          }
        })
      }
    })

  },
  onSureTap: function (e) {
    let that = this
    console.log(e)
    if (app.globalData.token == undefined) {
      let userinfoss = wx.getStorageSync('xuserixnfo')
      if (userinfoss == "") {
        that.setData({
          iosDialog1: true
        })
      } else {
        that.setData({
          iosDialog2: true
        })
      }

    } else {
      let tokens = app.globalData.token
      let data = {
        
      }
      console.log(tokens)
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xget('/rest/memberCenter/headPicUpdate?logo=' + that.data.logo, data, 'PUT', header, function (e) {
        console.log(e)
        wx.showToast({
          title: e.message,
          icon:'none'
        })
        if(e.code==200){
          clearTimeout(that.data.setTime)
          that.data.setTime = setTimeout(() => {
            wx.navigateBack({
              delta: 2,
            })
           
          }, 1500)
        //  wx.setStorageSync('avatarUrl', that.data.avatarUrl)
        }
        

      })
    }

  },
  onLoad: function (options) {
    let that = this
    // console.log(options.imagepath)
    that.setData({
      imagepath:options.imagepath,
      imgurl:app.globalData.imgur
    })
    // let userinfoss = wx.getStorageSync('xuserixnfo')
    // that.setData({
    //   avatarUrl:userinfoss.avatarUrl
    // })
    // wx.getUserInfo({
    //   success: function(res) {
    //     console.log(res)
    //     var userInfo = res.userInfo
    //     var avatarUrl = userInfo.avatarUrl
    //     that.setData({
    //       avatarUrl:userInfo.avatarUrl
    //     })
    //   }
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})