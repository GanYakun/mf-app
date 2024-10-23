// components/floor-item-form/index.js
var api = require("../../utils/api.js")
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msgList: {
      type: Array, 
      value: [],
      observer: function(newVal, oldVal) {
        this.setData({
          _msgList: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _msgList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 
     * 抢vr设计图
     * 
     * 
     */
    yuyuename: function (e) {
      this.setData({
        yuyuenamenamedata: e.detail.value
      })
    },
    yuyuephone: function (e) {
      this.setData({
        yuyuephonedata: e.detail.value
      })
    },
    tijioayuyue: function (e) {
      var that = this
      let tel = that.data.yuyuephonedata
      let name = that.data.yuyuenamenamedata
      let data = {
        name: name,
        tel: tel,
        sourceType: 'xcx',
        memberId: app.globalData.shareid,
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (tel == undefined) {
        wx.showToast({
          title: '输入的手机号为空',
          icon: 'none',
          duration: 1500,
          memberId: app.globalData.shareid,
        });
        return false
      } else if (name == undefined || name.length == 0) {
        wx.showToast({
          title: '请输入昵称',
          icon: 'none',
          duration: 1500
        });
        return false
      } else if (tel.length === 0) {
        wx.showToast({
          title: '输入的手机号为空',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else if (tel.length < 11) {
        wx.showToast({
          title: '手机号长度有误！',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else if (!myreg.test(tel)) {
        wx.showToast({
          title: '手机号有误！',
          icon: 'none',
          duration: 1500
        });
        return false;
      }
      api.request('/rest/tWebYuyueControllerApi/doAddYuyue', data, 'PUT', function (e) {
        console.log(e)
        if (e.code == 200) {
          wx.showToast({
            title: '恭喜您预约成功,客服热线：0871-68123333',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            yuyuevrdata: ''
          })
        } else {
          wx.showToast({
            title: '预约失败',
            icon: 'none',
            duration: 1500
          })
        }
      })
    },
  }
})
