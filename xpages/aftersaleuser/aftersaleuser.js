var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iosDialog2: false,
    xinxinnum: 5,
    xinxinnums: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      imgurl: app.globalData.imgur
    })
    let data = {
      newsClassId: options.newsClassId,
      objectId: options.id
    }
    api.request('/rest/newsClass/getModel', data, 'GET', this.getModel)
  },

  /**
   * 回调函数
   */

  getModel: function (e) {
    this.setData({
      getModel: e.data,
      contributeList:e.data.contributeList,
      TopTitle:e.data.name
    })
  },

  publish: function () {
    var id = this.data.id
    console.log(id)
    wx.navigateTo({
      url: '../publish/publish?id=' + id,
    })
  },

  /**
   * 
   * 我要评价
   * 
   */
  meyaopingjia: function (e) {
    this.setData({
      iosDialog22: true
    })
  },

  /** 
   * 
   * 关闭弹窗
   * 
   */
  close: function () {
    this.setData({
      iosDialog22: false
    })
  },

  /**
   * 
   * 点击服务态度评分事件
   * 
   */
  xinxincbtn: function (e) {
    console.log(e)
    this.setData({
      xinxinnum: e.currentTarget.dataset.index + 1
    })

  },


  /**
   * 
   * 专业能力评分
   * 
   */
  xinxincbtns: function (e) {
    console.log(e)
    this.setData({
      xinxinnums: e.currentTarget.dataset.index + 1
    })
  },

  /**
   * 
   * 输入的评价内容
   * 
   */
  shurucontent: function (e) {
    console.log(e)
    this.setData({
      inputcontent: e.detail.value
    })
  },



  /**
   * 
   * 确定评价
   * 
   */
  queding: function (e) {
    var that = this
    var inputcontent = that.data.inputcontent
    if (!inputcontent) {
      wx.showToast({
        title: '请输入评价内容',
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
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': app.globalData.token
      }
      let data = {
        commentContent: that.data.inputcontent,
        serviceAttitude: that.data.xinxinnum,
        professionalLevel: that.data.xinxinnums,
        designerDecoratorId: parseInt(that.data.id)
      }
      api.xpost('rest/memberCenter/pinJiaDes', data, 'POST', header, function (e) {
        if (e.message == '未登录') {
          wx.showLoading({
            title: '加载中...',
            duration: 1500,
          });
          app.obtaintoken()
        } else {
          wx.showToast({
            title: e.message,
            icon: 'none',
            duration: 1500
          })
        }
      })
    }


  },
  //图片预览
  previewImage: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var topImageList = e.currentTarget.dataset.topimagelist
    var imgurl = this.data.imgurl
    var imgarr = []
    topImageList.forEach((v, k) => {
      imgarr.push(imgurl + v.imagePath)
    });
    wx.previewImage({
      current: imgarr[index], // 当前显示图片的http链接
      urls: imgarr // 所有要预览的图片的地址集合 数组形式
    })
  },

  // 点赞
  onPraiseTap: function (e) {
    let that = this
    let token = app.globalData.token
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    that.setData({
      id: id,
    })
    if (e.currentTarget.dataset.isclick) {
      wx.showToast({
        title: '你已经点过赞了',
        icon: 'none'
      })
    } else {
      let data = {}
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': token
      }
      api.xpost('/rest/tWebContributeControllerApi/contributePraise?contributeId=' + id, data, 'PUT', header, function (e) {

        console.log(e)
        if (e.code == 200) {
          var listx = 'getModel.contributeList[' + index + '].isclick'
          var clicknum = 'getModel.contributeList[' + index + '].praise'
          that.setData({
            [listx]: true,
            [clicknum]: e.data
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: e.message,
            icon: 'none'
          })
        }
      })
    }
  },
  onTap: function (e) {
    wx.navigateTo({
      url: '../wordofmouth/wordofmouth?id=' + e.currentTarget.dataset.id,
    })
  },





})