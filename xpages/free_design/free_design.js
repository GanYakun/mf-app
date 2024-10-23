// xpages/free_design/free_design.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("设计师名字是否传过来了",options)
    let that = this
    that.setData({
      Designername:options.appointDesign
    })
    let data = {
      rootId: 1,
      SearchRowNum: 1
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', data, 'GET', function (e) {
      console.log(e)
      that.setData({
        list: e.data,
        imgurl: app.globalData.imgur
      })
    })

  //获取最近预约的列表
  api.request('/rest/tWebYuyueControllerApi/list?limitNum=20', {}, 'GET', function (e) {
    var msgList = []
    e.data.forEach(function (v, k) {
      if (v.createDate != null) {
        var timex = v.createDate
        // var year =timex.split('')[0]+timex.split('')[1]+timex.split('')[2]+timex.split('')[3];
        var month = timex.split('')[5] + timex.split('')[6];
        var day = timex.split('')[8] + timex.split('')[9];
        var name = v.name
        var timeStr = month + '月' + day + '日'
        msgList.push({ time: timeStr, name: name })
      }
    })
    that.setData({
      msgList: msgList
    })
  })
  },
/*
   * 
   * 
   * 提交装修预算
   * 
   */
  formSubmit: function (e) {
    console.log(e)
    console.log(e)
    let that = this
console.log(that.data.Designername)
    let name = e.detail.value.callofduty
    let tel = e.detail.value.phone
    let area = e.detail.value.areacodes
    let data = {
      appointDesign:that.data.Designername,           //预约的设计师的名字
      name: name,
      tel: tel,
      houseStructure: area,
      sourceType:'xcx',
      memberId:app.globalData.shareid,

  
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (tel.length === 0) {
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
          inputValue: '',
          inputValues: '',
          allImg:[],
          imgShow:[]
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

 
})