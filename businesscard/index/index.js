var app = getApp()
var api = require('../../utils/api.js')
import requestCenter from "../../http/request-center"
import config from "../../http/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    rows: 12,
    isclick: false,
    appagain: 0,
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    display: true,
    qcappnoshare: true,
    ftpUrl: config.ftpUrl,
    intentCustomerMonth:0,
    intentCustomerAll:0,
    signInMonth:0,
    signInAll:0,
    isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //查询我的客户，意向客户，我的经纪人数量那些
    // api.newget('/rest/memberCenter/memberCenterCustomerCount', {}, 'GET', function (e) {
    //   that.setData({
    //     StatisticsData: e.data
    //   })
    // })
    // this.getOrderStatusCounts()
    // this.getCount()

    requestCenter.getBusinessIndexData()
      .then((res) => {
        console.log("getBusinessIndexData success", res)
        res = res || []
        this.setData({
          StatisticsData: res[0] || {}, 
          orderCounts: res[1] || {},
          signInMonth: (res[2] || {}).monthlyAddition || 0,
          signInAll: (res[2] || {}).cumulative || 0,
          intentCustomerAll: (res[3] || {}).cumulative || 0,
          intentCustomerMonth: (res[3] || {}).monthlyAddition || 0,
          isLogin: true
        })
        return requestCenter.getMemberInfo()
      })
      .catch((error) => {
        console.log("getBusinessIndexData", error)
        if(error.code == 407) {
          //未注册
          this.setData({
            isLogin: false
          })
          return Promise.reject()
        } else {
          return Promise.reject(error)
        }
      })
      .then((res) => {
        app.globalData.username = res.nick
        app.globalData.userimg = res.logoVo.imagePath
        app.globalData.isemployee = res.isEmployee
        app.globalData.isBroker = res.isBroker
        app.globalData.postCouponPower = res.postCouponPower
        app.globalData.brokerPower = res.brokerPower
        if (res.phone == null) {
          app.globalData.phone = res.account
        } else {
          app.globalData.phone = res.phone
        }
        //用户的会员id  这里是不管是普通会员还是内部人员都携带着id走
        // app.globalData.ordinarymemberid = res.id
        app.globalData.isVerificate = res.isVerificate
        if (res.isEmployee == 1 || (res.isBroker == 1 && res.brokerPower == 1)) {
          app.globalData.memberid = res.id
          app.globalData.ordinarymemberid = res.id
        } else {
          app.globalData.memberid = ''
        }

        this.setData({
          imgur: app.globalData.imgur,
          userimg: app.globalData.userimg,
          username: app.globalData.username,
          tabIndexHeight: app.globalData.tabIndexHeight, //底部导航栏的高度
          isemployee: app.globalData.isemployee,
          isVerificate: app.globalData.isVerificate,
          isBroker: app.globalData.isBroker,
          memberId: app.globalData.memberid,
          postCouponPower:app.globalData.postCouponPower,
          brokerPower:app.globalData.brokerPower
        })
        this.setpagedata()
      })
  },
  toAuthor: function() {
    let pages = getCurrentPages()
    let curPage = pages[pages.length - 1]
    return Promise.reject({
      code: 407,
      message: "未注册",
      curPage: curPage
    })
  },
  //
  async getOrderStatusCounts() {
    let getOrderStatusCounts = await requestCenter.getOrderStatusCounts({})
    this.setData({
      orderCounts:getOrderStatusCounts
    })
  },
 
  /*
  意向客户
  我的进店
  统计
  */
  async getCount() {
    let myCustomerTotalByHuoDong = await requestCenter.getMyCustomerTotal()
    let getMyCustomerTotalByHaoSong = await requestCenter.getMyCustomerTotalByHaoSong({})
    this.setData({
      intentCustomerAll:getMyCustomerTotalByHaoSong.cumulative,
      intentCustomerMonth:getMyCustomerTotalByHaoSong.monthlyAddition,
      signInMonth:myCustomerTotalByHuoDong.monthlyAddition,
      signInAll:myCustomerTotalByHuoDong.cumulative
    })
  },

   /**
   * 
   * 设置页面数据
   * 
   */

  setpagedata: function (e) {
    var that = this
    if (that.data.leave) {
      return false
    }
    let userimg = that.data.userimg
    let username = that.data.username
    let isemployee = that.data.isemployee
    let isVerificate = that.data.isVerificate
    let isBroker = that.data.isBroker
    let postCouponPower = that.data.postCouponPower
    let brokerPower = that.data.brokerPower
    console.log('是否得到', isemployee, '名字', username, '头像', userimg, '是否具有核销权限', isVerificate,
      '是否具有我的客户权限', isBroker)
    if ((!brokerPower&&brokerPower!=0) || !postCouponPower || !userimg || username === '' || isemployee === '' || isVerificate === '' || isBroker == '') {
      console.log('进入')
      that.setData({
        userimg: app.globalData.userimg,
        username: app.globalData.username,
        isemployee: app.globalData.isemployee,
        isVerificate: app.globalData.isVerificate,
        isBroker: app.globalData.isBroker,
        memberId: app.globalData.memberid,
      })
      var timer = setTimeout(() => {
        that.setData({
          appagain: that.data.appagain + 1
        })
        if (that.data.appagain < 6) {
          that.setpagedata()
        } else {

        }
        clearTimeout(timer)
      }, 1000)
    } else {

    }

  },

  /**
   * 
   * 美家名片
   */
  mecard: function () {
    let data = {
      memberId: app.globalData.memberid
    }
    // api.newget('/rest/memberCenter/getBusinessCard', data, 'GET', function (e) {
    api.newget('/rest/shareApi/getBusinessCard', data, 'GET', function (e) {
      if (e.code == '406') {

      } else if (e.code == '500') {
        wx.navigateTo({
          url: '../newmake_card/newmake_card?type=1',
        })

      } else if (e.code == '200') {
        wx.navigateTo({
          url: '../../xpages/Electroniccard/Electroniccard',
        })
        // wx.navigateTo({
        //   url: '../newmake_card/newmake_card?type=1',
        // })

      }

      // else if (e.data.length > 0) {
      //   wx.navigateTo({
      //     url: '../my_agent/my_agent',
      //   })
      // } else {
      //   // wx.navigateTo({
      //   //   url: '../invitation/invitation',
      //   // })
      //   wx.navigateTo({
      //     url: '../invitationfather/invitationfather',
      //   })
      // }
    })

    //     var judge = 2
    // if(judge==1){
    //   wx.navigateTo({
    //     url: '../../xpages/Electroniccard/Electroniccard'
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '../../businesscard/make_cards/make_cards'
    //   })
    // }

  },

  /**
   * 我的经纪人
   * 
   */
  meagent: function () {
    var page = this.data.page
    var rows = this.data.rows
    let data = {
      page: page,
      rows: rows
    }
    api.newget('/rest/memberCenter/getMemberBrokerList', data, 'GET', function (e) {
      console.log(e.data)
      if (e.code == '406') {} else if (e.data.length > 0) {
        var listData = JSON.stringify(e.data)
        wx.navigateTo({
          url: '../my_agent/my_agent?listData=' + encodeURIComponent(listData),
        })
      } else {
        wx.navigateTo({
          url: '../invitationfather/invitationfather',
        })
      }
    })


  },

  //查看全部订单
  allorder: function (e) {
    console.log(e)
    var xindex = e.currentTarget.dataset.xindex
    var orderStatus = e.currentTarget.dataset.orderStatus
    var that = this;
    console.log('登陆状态', app.globalData.token)
    if (app.globalData.token == undefined) {
      wx.showToast({
        title: '帐号异常',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '../../order/my_order_list/my_order_list?orderStatus=' + orderStatus + '&xindex=' + xindex,
      })
    }
  },

  /**
   * 
   * 我的客户
   * 
   */
  mecustomer: function () {
    wx.navigateTo({
      url: '../../businesscard/mecustomer/index',
    })
  },

  /**
   * 
   * 商品收藏和作品收藏
   * **/
  onCollectionTap: function (e) {
    console.log(e)
    var collectiontype = e.currentTarget.dataset.collectiontype
    var id = e.currentTarget.dataset.id
    if (collectiontype == 'cart') {
      wx.navigateTo({
        url: '/pages/tab-cart/tab-cart',
      })
      return false
    }
    wx.navigateTo({
      url: '../../member/collection/collection?collectiontype=' + collectiontype + "&id=" + id
    })
  },

  pingjia: function () {
    wx.navigateTo({
      url: '../invitation/invitation',
    })
  },

  address: function () {
    wx.navigateTo({
      url: '/member/address_list/address_list',
    })
  },


  /**
   * 
   * 核销
   * 
   */
  hexiao: function () {
    wx.navigateTo({
      url: '../Writeoffoperation/Writeoffoperation',
    })
    // wx.scanCode({
    //   success: (res) => {
    //     console.log('扫描二维码返回的数据', res)
    //     if (res.result) {
    //       wx.navigateTo({
    //         url: '../writeoff/writeoff?id=' + res.result,
    //       })
    //     }
    //   }
    // })
  },
  test: function () {
    wx.navigateTo({
      url: '../writeoff/writeoff?id=' + '1604645180000',
    })
  },
  clicked: function () {
    var isclick = this.data.isclick
    this.setData({
      isclick: !isclick
    })
  },



  //显示论坛管理二级
  forum: function () {
    console.log(this.data.isforum)
    if (this.data.isforum) {
      this.setData({
        isforum: false
      })
    } else {
      this.setData({
        isforum: true
      })
    }

  },


  // 用户中心口碑
  user_praise: function () {
    let that = this
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
      wx.navigateTo({
        url: '../../member/user_praise/user_praise',
      })
    }

  },


  // 用户口碑发布
  onPublicPraiseTap: function (e) {
    let that = this
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
      wx.navigateTo({
        url: '../../member/public_praise/public_praise?type=' + e.currentTarget.dataset.type,
      })
    }

  },


  //拨打电话
  tophone: function (el) {
    let phone = el.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },

  //页面隐藏
  onHide: function () {
    var that = this
    that.setData({
      leave: true
    })
  },

  //意向客户
  yixiangmecustomer: function () {
    wx.navigateTo({
      url: '../Potentialcustomers/Potentialcustomers',
    })
  },

  // 视频上传
  upvideo: function () {
    wx.navigateTo({
      url: '../../pages/video_upload/video_upload',
    })
  },

  //下定订单的全部
  DepositAllorder: function (e) {

    console.log(e)
    var xindex = e.currentTarget.dataset.xindex
    var orderStatus = e.currentTarget.dataset.orderStatus
    var that = this;
    console.log('登陆状态', app.globalData.token)
    if (app.globalData.token == undefined) {
      wx.showToast({
        title: '帐号异常',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: './orderList/orderList?orderStatus=' + orderStatus + '&xindex=' + xindex,
      })
    }
  },
  Mydecision: function (e) {
    let xindex = e.currentTarget.dataset.xindex
    let orderStatus = e.currentTarget.dataset.status
    wx.navigateTo({
      url: './orderList/orderList?orderStatus=' + orderStatus + '&xindex=' + xindex,
    })
  },

  // 展示个人小程序二维码
  smallCode() {
    //查询自己的小程序码
    if (this.data.myEwmCode) {
      this.setData({
        isMyEwm: !this.data.isMyEwm
      })
      return false
    }
    api.newget('/rest/memberCenter/myEwm', {}, 'GET', (res) => {
      this.setData({
        myEwmCode: res.data,
        isMyEwm: !this.data.isMyEwm
      })
    })

  },

  closeCodePoup() {
    this.setData({
      isMyEwm: !this.data.isMyEwm
    })
  },
  closeCodePoup() {
    this.setData({
      isMyEwm: !this.data.isMyEwm
    })
  },

  //保存个人小程序码
  saveCode(e) {
    if (!this.data.myEwmCode) {
      return false
    }
    var path = this.data.imgur + this.data.myEwmCode
    console.log(path)
    wx.downloadFile({
      url: path,
      success: function (res) {
        wx.saveImageToPhotosAlbum({ //保存到本地
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  wx.showModal({
                    title: '请求授权',
                    content: '需要授权保存图片，请确认授权',
                    success: function (res) {
                      if (res.cancel) {
                        wx.showToast({
                          title: '拒绝授权',
                          icon: 'none',
                          duration: 1000
                        })
                      } else if (res.confirm) {
                        wx.openSetting({
                          success: function (dataAu) {
                            if (dataAu.authSetting["scope.writePhotosAlbum"] == true) {
                              wx.showToast({
                                title: '授权成功',
                                icon: 'success',
                                duration: 1000
                              })
                            } else {
                              wx.showToast({
                                title: '授权失败',
                                icon: 'none',
                                duration: 1000
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: '保存图片失败',
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  //拎包案例
  lbal() {
    let id = 698
    // let id = 638
    let cname = '拎包案例'
    let type = 'lbal'
    wx.navigateTo({
      url: '../../xpages/classification/classification?id=' + id + "&cname=" + cname + '&ScreeningFloors=' + 1 + '&type=' + type + '&noShare=' + true,
    })
    // wx.navigateTo({
    //   url: '/xpages/designsketch/designsketch?newsClassId='+147,
    // })
  },

  //全屋套餐跳转
  allHouse() {
    let id = 638
    wx.navigateTo({
      url: '/xpages/classification/classification?ScreeningFloors=' + 1 + '&id=' + id + '&cname=' + '全部' + '&noShare=' + true,
    })
  },

  //扫粉二维码
  dusting() {
    wx.navigateTo({
      url: '/businesscard/dusting/dusting',
    })
  },

  //内部会员点击事件
  internalMember() {
    wx.navigateTo({
      url: '/businesscard/internal-member-list/internal-member-list',
    })
  },


  internalMemberBrowse() {
    wx.navigateTo({
      url: '/businesscard/internal-member-bro-list/internal-member-bro-list',
    })
  },

  //爱帮你家居服务和我的优惠券
  serverInHelp(e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/businesscard/server-in-help/server-in-help?type=' + type,
    })
  },

  //点击进店壕送
  intoSent(e){
    wx.navigateTo({
      url: '/member/into_sent/into_sent',
    })
  },

  //点击活动签到
  activitySign(e){
    wx.navigateTo({
      url: '/member/activity_sign/activity_sign',
    })
  },

  //意向客户
  intentCustomer(e){
    wx.navigateTo({
      url: '/member/intent_customer/intent_customer'
    })
  },

  //我的进店
  intoShop(e){
    wx.navigateTo({
      url: '/member/mine_infoshop/mine_infoshop'
    })
  },

  // 客户须知
  buyerReading(){
      wx.navigateTo({
        url: '/xpages/childactivity/childactivity?id=2251&newsClassId=230',
      })
  }


})