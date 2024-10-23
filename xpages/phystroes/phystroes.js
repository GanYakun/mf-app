// pages/phystroes/phystroes.js
var api = require("../../utils/api.js")
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselList: [{
      url: 'http://116.55.251.19/group1/M00/00/72/dDf7E18jsTSAVn_8AACc1rrswQ0359.jpg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        console.log(pageWindowHeight)
        this.setData({
          pageWindowHeight: pageWindowHeight,
          newsClassId: options.id,
          imgur: app.globalData.imgur
        })
      }
    })
    console.log('options数据', options)
    this.setData({
      newsClassId: options.id ? options.id : options.newsClassId
    })
    // 获取实体门店数据
    let data = {
      start: 1,
      pageSize: 12,
      newsClassId: options.id ? options.id : options.newsClassId
    }
    api.request('/rest/newsClass/getPageModel', data, 'GET', this.getPageModel)
  },

  getPageModel: function (e) {
    console.log('这里----', e)
    // console.log(JSON.parse(e))
    this.setData({
      exlist: e.data,
      lists: e.data.list,
      TopTitle: e.data.newsClass.name
    })
    // console.log(e.data.list[0])
    // let sss = (JSON.parse(e.data.list[0].thumbnailPath))
    // console.log(sss)
    // console.log(sss[0].path)
  },
  slideusage: function () {
    let that = this
    var arr = that.data.exlist
    if (arr.webNextPage) {
      var startnum = arr.start + 1
      let data = {
        start: startnum,
        pageSize: 12,
        newsClassId: that.data.newsClassId
      }
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if (e) {
          wx.hideLoading({

          })
        }
        let arrList = that.data.lists.concat(e.data.list)
        var xiugai = 'list.webNextPage'
        var xiugai1 = 'list.start'
        that.setData({
          exlist: e.data,
          lists: arrList,
          [xiugai]: e.data.webNextPage,
          [xiugai1]: startnum
        })
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1500
      })
    }
  },
  contentimg: function (e) {
    let id = e.currentTarget.dataset.id
    // let imgarr = e.currentTarget.dataset.imgarr
    // let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../../xpages/storedetails/storedetails?id='+id+'&newsClassId='+this.data.newsClassId,
    })
    // wx.navigateTo({
    //   url: '../../xpages/storedetails/storedetails?imgarr=' + imgarr + '&title=' + title,
    // })
  },

  lookvr: function (e) {
    let url = e.currentTarget.dataset.url
    if (!url) {
      wx.showToast({
        title: '暂无vr全景',
        icon: 'none',
      })
      return false
    }
    wx.navigateTo({
      url: '../h5page/h5page?url=' + url,
    })
  },

  Navigation: function (e) {
    console.log(e.currentTarget.dataset.wapmapurl)
    var wapmap = e.currentTarget.dataset.wapmapurl
    if (wapmap) {
      // 调用接口
      // 调用接口
      var wapmapurl = wapmap.split(',')
      console.log(wapmapurl)
      // var longitude = Number(wapmapurl[0])
      // var latitude = Number(wapmapurl[1])
      var demo = new QQMapWX({
        key: '7YPBZ-NHS6D-MEB45-P4O5V-RKZSK-KHBVI'
      });
      // 调用接口
      demo.reverseGeocoder({
        location: {
          latitude: Number(wapmapurl[1]),
          longitude: Number(wapmapurl[0])
        },
        coord_type: 3, //baidu经纬度
        success: (res) => {
          var latitude = res.result.location.lat;
          var longitude = res.result.location.lng;
          wx.openLocation({
            latitude,
            longitude,
            scale: 18
          })
          console.log('tx', latitude, longitude)
        },
        fail: (error) => {
          console.error(error);
        },
        complete: (res) => {
          console.log(res);
        }
      })
    } else {
      wx.showToast({
        title: '暂无导航地址',
        icon: 'none'
      })
    }
  },
  call: function (el) {
    let phone = el.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },
})