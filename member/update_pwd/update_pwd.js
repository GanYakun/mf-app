// member/update_pwd/update_pwd.js
var api = require("../../utils/api.js")
var app = getApp()
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
  onLoad: function (options) {

  },

  OriginalPassword: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      oldPassword: e.detail.value
    })
  },
  NewPassword: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      newPassword: e.detail.value
    })
  },
  ConfirmPassword: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      rePassword: e.detail.value
    })
  },
  onSureTap: function () {
    let that = this;
    var oldPassword = that.data.oldPassword
    var newPassword = that.data.newPassword
    var rePassword = that.data.rePassword
    if (oldPassword == null || newPassword == null || rePassword == null) {
      wx.showToast({
        title: '请输入完整信息！',
        icon: 'none'
      })
      return

    }
    if (newPassword != rePassword) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none'
      })
      return
    }
    if (newPassword == oldPassword) {
      wx.showToast({
        title: '新密码与原密码一致',
        icon: 'none'
      })
      return

    }

    if (newPassword.length < 6) {
      wx.showToast({
        title: '密码长度不能少于6位',
        icon: 'none'
      })
      return

    }

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
        // oldPassword:that.data.oldPassword,
        // newPassword:that.data.newPassword,
        // rePassword:that.data.rePassword
      }
      console.log(tokens)
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      api.xpost('/rest/memberCenter/passwordUpdate?oldPassword=' + that.data.oldPassword + "&newPassword=" + that.data.newPassword + "&rePassword=" + that.data.rePassword, data, 'PUT', header, function (e) {

        console.log(e)

        wx.showToast({
          title: e.message,
          icon: 'none'
        })
        if (e.code == 200) {
          clearTimeout(that.data.setTime)
          that.data.setTime = setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        }





      })
    }


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