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
    iosDialog2: { // 属性名
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
        iosDialog2: !that.data.iosDialog2
      })
      that.triggerEvent('guanbi')
    },

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
          if (xuserixnfo.gender == 1) {
            var xcxBindVo = {
              headPic: xuserixnfo.avatarUrl,
              nick: xuserixnfo.nickName,
              openId: wx.getStorageSync('oppenid'),
              phoneNum: e.data,
              sex: "男"
            }
          } else {
            console.log('昵称',xuserixnfo.nickName)
            var xcxBindVo = {
              headPic: xuserixnfo.avatarUrl,
              // nick: Base64.encodeBase64String(xuserixnfo.nickName),
              nick:xuserixnfo.nickName,
              // nick:xuserixnfo.nickName,
              openId: wx.getStorageSync('oppenid'),
              phoneNum: e.data,
              sex: "女",
              unionId: wx.getStorageSync('unionid') ? wx.getStorageSync('unionid'):''
            }
          }

          api.request('/rest/weiXin/xcxBind', xcxBindVo, 'POST', function (e) {
            app.onLaunch()
            app.obtaintoken()
            that.triggerEvent('guanbi')
          })
        })
      }
    },

  }
})