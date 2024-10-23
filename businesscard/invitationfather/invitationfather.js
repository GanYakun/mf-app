var api = require("../../utils/api.js")
var app = getApp()
import {
  wxml,
  style
} from './demo.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qcappnoshare:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.widget = this.selectComponent('.widget')
    var that = this
    let datacard = {
      memberId: app.globalData.memberid
    }
    // api.newget('/rest/memberCenter/getBusinessCard', datacard, 'GET', function (e) {
    api.request('/rest/shareApi/getBusinessCard', datacard, 'GET', function (e) {
      if (e) {
        that.setData({
          isGetUserinfo: false
        })
      }
    })

    //获取海报的背景图
    let dangqibannerdata = {
      rootId: 42, //正式服的id
      // rootId:551,       //测试服id
      SearchRowNum: 5,
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', dangqibannerdata, 'GET', async function (e) {
      console.log(e)
      that.setData({
        phoneicon: getApp().globalData.imgur + e.data[0].imageVo.imagePath,
        addressicon: getApp().globalData.imgur + e.data[1].imageVo.imagePath,
      })
    })
    let ratio = 750 / wx.getSystemInfoSync().windowWidth
    that.setData({
      pageWidth: Math.ceil(wx.getSystemInfoSync().windowWidth*ratio),
      pageHeight: Math.ceil(wx.getSystemInfoSync().windowHeight*ratio)
    })
    wx.hideLoading({})
  },

  getUserInfo: async function (e) {
    wx.showLoading({
      title: '请稍等...',
    })
    var that = this
    console.log(e)
    var cardMessage = await that.getCard()
    if (cardMessage != '') {
      var headerPath = await that.convertImage(app.globalData.imgur + cardMessage.headPortraitPath)
      that.setData({
        headerImage: headerPath,
        usernick: cardMessage.name,
        storeName: cardMessage.storeName,
        position: cardMessage.position
      })
    } else {
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        wx.hideLoading({
          success: (res) => {},
        })
        return false;
        // getApp().globalData.username
      } else {
        console.log('头像是否为空', that.data.headerImage)
        if (!that.data.headerImage) {
          var headerPath = await that.convertImage(e.detail.userInfo.avatarUrl)
          that.setData({
            headerImage: headerPath,
            usernick: e.detail.userInfo.nickName
          })
        } else {
          that.setData({
            usernick: getApp().globalData.username
          })
        }
      }
    }
    var qrcdata = await that.getqrc()
    that.setData({
      qrcurl: qrcdata
    })
    var isrendto = await that.renderToCanvas()
    console.log(isrendto)
    if (isrendto == 'ok') {
      var parameterarr = await that.extraImage()
      console.log("导出图片", parameterarr)
      let transformation = parameterarr.src
      wx.navigateTo({
        url: '../posterimage/posterimage?transformation=' + transformation,
      })
    } else {

    }
    // wx.navigateTo({
    //   url: '../poster/poster',
    // })
  },


  /**
   * 
   * 生成海报
   * 
   */
  renderToCanvas() {
    var that = this
    return new Promise(async(resolve, reject) => {
      that.Loading(1)
      var address = that.data.storeName
      var shareaddress = '木菲总店'
      let brokerBackgroundImagePath = that.data.brokerBackgroundImagePath
      let brandLogPath = that.data.brandLogPath
      if (address == null || address == '') {
        shareaddress = ''
      } else {
        shareaddress = address
      }
      console.log(brokerBackgroundImagePath)
      if (!brokerBackgroundImagePath || !brandLogPath) {
        wx.showToast({
          title: '门店logo或背景为空，请到后台补充数据',
          icon: 'none'
        })
        return false
      }
      let Parameterspassed = {
        phoneicon: that.data.phoneicon,
        addressicon: that.data.addressicon,
        hedimg: that.data.headerImage,
        qrcode: app.globalData.upurl + that.data.qrcurl,
        name: that.data.usernick,
        remask: that.data.position,
        phone: that.data.cardPhone||app.globalData.phone,
        address: shareaddress,
        brokerBackgroundImagePath: app.globalData.imgur + brokerBackgroundImagePath,
        brandLogPath: app.globalData.imgur + brandLogPath,
        officialAccountImgCodePath:that.data.officialAccountImgCodePath
      }
      console.log(wxml)
      console.log('Parameterspassed',Parameterspassed)
      let wxmlStr = wxml(Parameterspassed);
      console.log("wxmlStr", wxmlStr)
      let pagesize = {
        sizewidth: that.data.pageWidth,
        sizeheight: that.data.pageHeight,
      }
      let pagesizes = style(pagesize)
      console.log("style", pagesizes)
      console.log("widget", that.widget)
      const p1 = that.widget.renderToCanvas({
        wxml: wxmlStr,
        style: pagesizes
      })
      console.log(await p1)
      p1.then((res) => {
        // console.log('container', res)
        // that.container = res
        resolve('ok')
      })

    })

  },



  extraImage() {
    console.log("导出图片的方法")
    var that = this
    return new Promise((resolve, reject) => {
      const p2 = that.widget.canvasToTempFilePath()
      p2.then(res => {
        console.log(res)
        let parameterarr = {
          src: res.tempFilePath,
          // width: this.container.layoutBox.width,
          // height: this.container.layoutBox.height
        }
        resolve(parameterarr)
      })
    })
  },

  convertImage: function (url) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#convertor')
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          const image = canvas.createImage()
          image.src = url
          image.onload = function () {
            canvas.width = image.width
            canvas.height = image.height
            var sysInfo = wx.getSystemInfoSync()
            var width = sysInfo.windowWidth
            var height = sysInfo.windowHeight
            canvas.width = width
            canvas.height = height
            ctx.drawImage(image, 0, 0, width, height)
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: canvas.width,
              height: canvas.height,
              destWidth: width,
              destHeight: height,
              canvas: canvas,
              success(res) {
                resolve(res.tempFilePath)
              }
            })
          }
        })
    })
  },

  onHide: function () {
    let that = this
    that.setData({
      showTips: false
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },
  // 加载弹窗
  Loading: function (e) {
    let that = this
    if (e == 1) {
      that.setData({
        showTips: true
      })
    } else {
      that.setData({
        showTips: false
      })
    }
  },

  //获取二维码
  getqrc: function () {
    var that = this
    return new Promise((resove, reject) => {
      let qrcdatas = {
        // url:"http://mf.100good.cn/mlsmall/card_share?memberId=464&name=改天是那天"
        url: encodeURIComponent(app.globalData.upurl + "card_share?memberId=" + app.globalData.memberid + "&name=" + that.data.usernick)
      }
      api.newget('/rest/shareApi/getQrCode', qrcdatas, 'GET', function (e) {
        resove(e.data.path)
      })
    })

  },

  getCard: function () {
    return new Promise((resove, reject) => {
      let datacard = {
        memberId: app.globalData.memberid
      }
      // api.newget('/rest/memberCenter/getBusinessCard', datacard, 'GET', function (e) {
      api.request('/rest/shareApi/getBusinessCard', datacard, 'GET', function (e) {
        if (e.data) {
          resove(e.data.businessCard)
        } else {
          wx.showModal({
            title: '请先生成名片',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/businesscard/newmake_card/newmake_card?type=1',
                })
              } else {
                console.log('点击取消回调')
              }
            }
          })
        }
      })
    })

  },



  NogetUserinfo: async function () {
    try {
      var that = this
      var cardMessage = await that.getCard()
      console.log(cardMessage)
      if (cardMessage) {
        if (!cardMessage.headPortraitPath) {
          app.showToastMessage('名片头像未上传，请上传名片头像')
          return false
        }
        var headerPath = app.globalData.imgur + cardMessage.headPortraitPath
        that.setData({
          headerImage: headerPath,
          usernick: cardMessage.name,
          storeName: cardMessage.storeName,
          position: cardMessage.position,
          brokerBackgroundImagePath: cardMessage.brokerBackgroundImagePath,
          brandLogPath: cardMessage.brandLogPath,
          cardPhone:cardMessage.phone,
          officialAccountImgCodePath:cardMessage.officialAccountImgCodePath
        })
        console.log('ppppppppppp',cardMessage)
      } else {
        that.setData({
          usernick: getApp().globalData.username
        })
      }
      var qrcdata = await that.getqrc()
      that.setData({
        qrcurl: qrcdata
      })
      var isrendto = await that.renderToCanvas()
      console.log(isrendto)
      if (isrendto == 'ok') {
        var parameterarr = await that.extraImage()
        console.log("导出图片", parameterarr)
        let transformation = parameterarr.src
        that.Loading(0)
        wx.navigateTo({
          url: '../posterimage/posterimage?transformation=' + transformation,
        })
      } else {

      }
      // wx.navigateTo({
      //   url: '../poster/poster',
      // })
    } catch {
      let that = this
      that.setData({
        showTips: false
      })
      wx.showToast({
        title: '生成失败，请稍后重试',
        icon: 'none'
      })
    }

  },
})