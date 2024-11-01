import {
  calculationfun
} from '../../utils/Heightset' //es6
var api = require('../../utils/api.js')
var app = getApp()
import {
  wxml,
  style
} from './demo'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    page: 1,
    rows: '',
    isGetUserinfo: false,
    qcappnoshare: true,
    chooseFirstTab: true,
    chooseSecondTab: false,
    firstRadioCheck: false,
    secondRadioCheck: false,
    inviteType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.widget = this.selectComponent('.widget')
    var listData = JSON.parse(decodeURIComponent(options.listData))
    var page = options.page
    var rows = options.rows
    this.setData({
      navHeight: calculationfun.constructors().navHeight,
      listData: listData,
    })
    let datacard = {
      memberId: app.globalData.memberid
    }
    // api.newget('/rest/memberCenter/getBusinessCard', datacard, 'GET', function (e) {
    // api.request('/rest/shareApi/getBusinessCard', datacard, 'GET', function (e) {
    //   if (e.data.businessCard) {
    //     that.setData({
    //       isGetUserinfo: false
    //     })
    //   } else {
    //     if (getApp().globalData.userimg) {
    //       that.setData({
    //         isGetUserinfo: false
    //       })
    //     } else {
    //       that.setData({
    //         isGetUserinfo: true
    //       })
    //     }
    //   }
    // })

    var that = this
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


    console.log("系统信息", wx.getSystemInfoSync())
    let ratio = 750 / wx.getSystemInfoSync().windowWidth
    that.setData({
      pageWidth: Math.ceil(wx.getSystemInfoSync().windowWidth * ratio),
      pageHeight: Math.ceil(wx.getSystemInfoSync().windowHeight * ratio)
    })


  },


  // 邀请经纪人
  invite_agents: function () {
    wx.navigateTo({
      url: '../invite_agents/invite_agents',
    })
  },

  /**
   * 
   * 邀请经纪人
   * 
   */
  getUserInfo: async function (e) {
    var that = this
    console.log(e)
    var cardMessage = await that.getCard()
    if (cardMessage != '') {
      var headerPath = await that.convertImage(app.globalData.imgur + cardMessage.headPortraitPath)
      that.setData({
        headerImage: headerPath,
        usernick: cardMessage.name,
        storeName: cardMessage.storeName,
        cardPhone: cardMessage.phone
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

  // 经纪人详情
  agent_detail: function (e) {
    console.log(e)
    var nick = e.currentTarget.dataset.nick
    var cjcount = e.currentTarget.dataset.cjcount
    var phone = e.currentTarget.dataset.phone
    var applybrokerdate = e.currentTarget.dataset.applybrokerdate
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../agent_detail/agent_detail?nick=' + nick + '&phone=' + phone + '&cjcount=' + cjcount + '&applybrokerdate=' + applybrokerdate + '&id=' + id,
    })
  },


  // 分页
  lower: function () {
    console.log("分页")
    var that = this;
    var result = that.data.listData
    var page = that.data.page + 1;
    let data = {
      page: page,
      rows: 12
    }
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': app.globalData.token
    }
    api.newget('/rest/memberCenter/getMemberBrokerList', data, 'GET', function (e) {
      console.log(e.data)
      if (e.code == '200') {
        var mydata = e.data;
        if (mydata.length > 0) {

          var timer = setTimeout(() => {
            that.setData({
              listData: result.concat(mydata),
              page: page
            });
            wx.hideLoading();
            clearTimeout(timer)
          }, 1500)
          return false;
        } else {
          wx.showToast({
            title: '没有数据了',
            duration: 300,
            icon: 'none'
          });
        }
      }
    })

  },





  /**
   * 
   * 生成海报
   * 
   */
  renderToCanvas() {
    var that = this
    return new Promise((resolve, reject) => {
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
      let backGroudImgUrl = ''
      if (that.data.inviteType === "0") {
       backGroudImgUrl = "https://www.mufei100.com/file/group1/M00/4A/79/dDf7E2cjOzqAFKQsACsQu0KkFhE791.jpg"
      } else {
        backGroudImgUrl = "https://www.mufei100.com/file/group1/M00/4A/79/dDf7E2cjPGyAG5HrAAT-FliBC6Y917.jpg"
      }
      console.log(brokerBackgroundImagePath)
      if (!brokerBackgroundImagePath || !brandLogPath) {
        wx.showToast({
          title: '门店logo或背景为空，请到后台补充数据',
          icon: 'none'
        })
        that.Loading(0)
        return false
      }
      let Parameterspassed = {
        phoneicon: that.data.phoneicon,
        addressicon: that.data.addressicon,
        hedimg: that.data.headerImage,
        qrcode: app.globalData.upurl + that.data.qrcurl,
        name: that.data.usernick,
        remask: that.data.position,
        phone: that.data.cardPhone || app.globalData.phone,
        address: shareaddress,
        brokerBackgroundImagePath: backGroudImgUrl,
        brandLogPath: app.globalData.imgur + brandLogPath,
        officialAccountImgCodePath:that.data.officialAccountImgCodePath
        
      }
      console.log(Parameterspassed)
      let wxmlStr = wxml(Parameterspassed);
      console.log("wxmlStr", wxmlStr)
      let pagesize = {
        sizewidth: 750,
        sizeheight: 1340,
      }
      let pagesizes = style(pagesize)
      console.log("style", pagesizes)
      console.log("widget", that.widget)
      const p1 = that.widget.renderToCanvas({
        wxml: wxmlStr,
        style: pagesizes
      })
      console.log(p1)
      p1.then((res) => {
        // console.log('container', res)
        // that.container = res
        resolve('ok')
      })

    })

  },


  //导出图片
  extraImage() {
    console.log("导出图片的方法")
    var that = this
    return new Promise((resolve, reject) => {
      const p2 = that.widget.canvasToTempFilePath()
      console.log('p2', p2)
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

  //小程序页面隐藏
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })
    let that = this
    that.setData({
      showTips: false
    })
  },

  //获取二维码
  getqrc: function () {
    var that = this
    return new Promise((resove, reject) => {
      let qrcdatas = {
        // url:"http://mf.100good.cn/mlsmall/card_share?memberId=464&name=改天是那天"
        url: encodeURIComponent("https://www.100good.cn/card_share?memberId=" + app.globalData.memberid + "&name=" + that.data.usernick + "&type=" + that.data.inviteType)
      } 
      api.newget('/rest/shareApi/getQrCode', qrcdatas, 'GET', function (e) {
        resove(e.data.path)
      })
    })

  },

  NogetUserinfo: async function () {
    try {
      var that = this
      if (that.data.inviteType === '') {
        wx.showToast({
          title: '请选择要邀请的经纪人类型',
          icon: 'none'
        })
        return
      }
      var cardMessage = await that.getCard()
      console.log(cardMessage)
      if (cardMessage) {
        var headerPath = app.globalData.imgur + cardMessage.headPortraitPath
        that.setData({
          headerImage: headerPath,
          usernick: cardMessage.name,
          storeName: cardMessage.storeName,
          position: cardMessage.position,
          brokerBackgroundImagePath: cardMessage.brokerBackgroundImagePath,
          brandLogPath: cardMessage.brandLogPath,
          cardPhone: cardMessage.phone,
          officialAccountImgCodePath: cardMessage.officialAccountImgCodePath
        })
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
      wx.navigateTo({
        url: '../poster/poster',
      })
    } catch {
      let that = this
      that.setData({
        showTips: false
      })
      wx.showToast({
        title: '生成海报失败，请稍后重试',
        icon: 'none'
      })
    }

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

  handlerFirstTabClick: function() {
    this.setData({
      chooseFirstTab: true,
      chooseSecondTab: false
    })
  },

  handlerSecondTabClick: function() {
    this.setData({
      chooseFirstTab: false,
      chooseSecondTab: true,
    })
  },

  handlerFirstRadioChoose: function() {
    this.setData({
      firstRadioCheck: true,
      secondRadioCheck: false,
    })
    //传递经纪人类型参数
    this.setData({
      inviteType: "0",
    })
  },

  handlerSecondRadioChoose: function() {
    this.setData({
      firstRadioCheck: false,
      secondRadioCheck: true,
    })
    //传递经纪人类型参数
    this.setData({
      inviteType: "1",
    })
  },

  //输入事件
  Entering: function (e) {
    var that = this
    that.setData({
      EnteringValue: e.detail.value
    })
  },
  // 搜索
  lose: function (e) {
    var that = this
    let data = {
      page: 1,
      rows: 12,
      keyWord: that.data.EnteringValue
    }
    api.newget('/rest/memberCenter/getMemberBrokerList', data, 'GET', function (e) {
      if (e) {
        that.setData({
          listData: e.data
        })
      }
    })

  }
})