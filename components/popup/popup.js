var app = getApp();
var api = require("../../utils/api.js")
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    iosDialog1: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false // 属性初始值（可选），如果未指定则会根据类型选择一个
    },

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
    //隐藏弹框
    close: function (e) {
      var that = this;
      console.log(e)
      that.setData({
        iosDialog1: false
      })
      let isshowjixu = e.currentTarget.dataset.isjixu
      if (isshowjixu == "true") {
        var myEventDetail = {
          isjixu: isshowjixu
        }
        var myEventOption = {}
        that.triggerEvent('guanbi', myEventDetail, myEventOption)
      } else {

      }
      that.triggerEvent('guanbi')
    },

    bindGetUserInfo: function (e) {

      let that = this;
      console.log(e)
      if (e.detail.errMsg == "getUserInfo:ok") {
        console.log("测试测试测试")
        that.triggerEvent('guanbi', 'true')
        wx.setStorageSync('xuserixnfo', e.detail.userInfo)
        that.setData({
          dialog2: true
        })
        try {
          that.close()
        } catch {

        }
      }
    },
    GetUserInformation() {
      var that = this
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '获取用户头像和昵称来注册',
        success: function (res) {
          console.log('成功测试getUserProfile', res)
          if (res.errMsg == "getUserProfile:ok") {
            that.triggerEvent('guanbi', 'true')
            wx.setStorageSync('xuserixnfo', res.userInfo)
            that.setData({
              dialog2: true
            })
            try {
              that.close()
            } catch {

            }
          }
        },
        fail: function (res) {
          console.log('失败测试getUserProfile', res)

        }
      })
    },

    /**
     * 
     * 
     * 关闭获取手机号
     * 
     */
    closephone: function () {
      var that = this
      this.setData({
        dialog2: false
      })
      that.triggerEvent('guanbi')
    },


    /**
     * 同意获取手机号
     * 
     * 
     * */
    getPhoneNumber: function (e) {
      var that = this;
      console.log(e.detail.errMsg == "getPhoneNumber:ok");
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        console.log(e)
        let decryptionPhoneVo = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: wx.getStorageSync('session_key')
        }
        api.request('/rest/weiXin/decryptionPhone', decryptionPhoneVo, 'POST', function (e) {
          console.log(e)
          wx.setStorageSync('xphone', e.data)
          let xuserixnfo = wx.getStorageSync('xuserixnfo')
          console.log(xuserixnfo.nickName)
          if (xuserixnfo.gender == 1) {
            var xcxBindVo = {
              headPic: xuserixnfo.avatarUrl,
              nick: xuserixnfo.nickName,
              openId: wx.getStorageSync('oppenid'),
              phoneNum: e.data,
              sex: "男"
            }
          } else {
            var xcxBindVo = {
              headPic: xuserixnfo.avatarUrl,
              nick: xuserixnfo.nickName,
              openId: wx.getStorageSync('oppenid'),
              phoneNum: e.data,
              sex: "女",
              unionId: wx.getStorageSync('unionid') ? wx.getStorageSync('unionid'):''
            }
          }

          api.request('/rest/weiXin/xcxBind', xcxBindVo, 'POST', function (e) {
            app.onLaunch()
            app.obtaintoken()
            that.setData({
              dialog2: false
            })
            that.triggerEvent('guanbi')

          })
        })
      }
    }
  }
})