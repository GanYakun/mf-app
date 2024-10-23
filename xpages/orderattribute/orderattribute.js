var app = getApp();
var api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isstroenum: false,
    xtypecode: '',
    isxshow: false,
    isxshows: false,
    couplistid: '',
    youhuijiages: 0.00,
    isdesignermanual: false,
    shejiidss: '', //让设计师列表默认选中  "请选择"
    recommenderId: '', //推荐人id
    pindex: 0,
    dindex: 0,
    imgur: app.globalData.imgur,
    qcappnoshare: true,
    ftpUrl:app.globalData.newFtpUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.log('页面参数信息', options)
    this.setData({
      addorderType: options.addorderType //判断是线下支付的订单还是线上支付的订单
    })
    //判断是否是大礼包购买过来的
    // if (options.isrecommenderId == 1) {
    //   this.setData({
    //     recommenderId: app.globalData.shareid
    //   })
    // }
    // if(options.pageParams){
    //   let pageParams = JSON.parse(decodeURIComponent(options.pageParams))
    //   console.log(pageParams)
    //   this.setData({
    //     cartsPromotionsId:pageParams.activiteId[0],
    //     cartsPromotionsType:pageParams.activiteType[0]
    //   })

    // }

    var that = this;

    try {
      var data = JSON.parse(decodeURIComponent(options.data))
      app.log('！！！抛出异常', '！！！抛出异常')
    } catch {
      var data = {
        mallItemSkuList: []
      }
    }
    // 查询购买的产品中是否存在线下产品
    var findOnlineAndOffline = data.onlineAndOffline
    app.log('查询购买的产品中是否存在线下产品', findOnlineAndOffline)
    that.setData({
      shopmessage: data,
      shopnumber: data.mallItemSkuList.length,
      shopmessagejiage: data.totlePrice,
      addorderType:that.data.addorderType?that.data.addorderType:(findOnlineAndOffline == 0|| findOnlineAndOffline == 2? false : 'offlinePayment')
    })
    if (!app.globalData.token) {
      return false
    }
    // 查询地址列表用来选择
    api.newget('/rest/memberCenter/myShippingAdress', {}, 'GET', function (e) {
      that.setData({
        addressList: e.data
      })
    })
    api.newget('/rest/memberCenter/getDeliveryAddress', {}, 'GET', function (e) {
      if (e) {
        if (e.data == null) {
          let tokens = app.globalData.token
          let data = {}
          console.log(tokens)

          api.newget('/rest/memberCenter/myShippingAdress', data, 'GET', function (e) {
            that.setData({
              addresobject: e.data[0]
            })
          })
        } else {
          wx.hideLoading({
            success: (res) => {},
          })
          that.setData({
            addresobject: e.data
          })
        }

      }
    })

    let dataone = {
      typegroupCode: 'web_ownStore'
    }
    api.request('/rest/dataDictionaryApi/dataDictionary', dataone, 'GET', function (e) {
      console.log(e)
      if (e) {
        wx.hideLoading({

        })

        let data = {
          typename: '请选择',
          typecode: ''
        }
        let arr = e.data
        arr.unshift(data)
        that.setData({
          getstroe: arr,
          xtypename: arr[0].typename
        })
      }
    })


    let datasheji = {}
    api.request('/rest/tWebDesignerDecoratorControllerApi/designerDecoratorList', datasheji, 'GET', function (e) {
      if (e) {
        wx.hideLoading({
          success: (res) => {},
        })
        let data = {
          name: '请选择',
          id: ''
        }
        let arr = e.data
        arr.unshift(data)
        that.setData({
          isdesignermanual: false,
          desinlist: arr,
          xshejitypename: arr[0].name
        })
      }

    })
  },

  /***
   * 
   * 门店弹出事件
   * 
   */
  stroeshow: function (e) {
    console.log("哈哈")
    this.setData({
      isstroenum: !this.data.isstroenum,
      isdesignermanual: false
    })
  },

  /**
   * 
   * 
   * 设计师弹出事件
   * 
   * 
   */
  designermanual: function () {
    this.setData({
      isdesignermanual: !this.data.isdesignermanual,
      isstroenum: false
    })
  },

  /**
   * 
   * 输入事件
   * 
   */
  bindtextarea: function (e) {
    this.setData({
      beizhutext: e.detail.value
    })

  },

  /**
   * 
   * 提交订单
   * 
   * 
   */
  tijiao: function (e) {
    let that = this;
    // var timestamp = Date.parse(new Date())
    var timestamp = new Date().getTime()
    console.log(timestamp)
    if (that.data.addresobject == null) {
      wx.showToast({
        title: '未选择地址',
        icon: 'none', //如果要纯文本，不要icon，将值设为'none'
        duration: 1500
      })
      return false
    }
    let data = {
      orderNum: timestamp, //订单号
      // designer: that.data.shejiidss, //设计师的id
      type: that.data.shopmessage.type, //购买的类型，1为普通购买
      remark: that.data.beizhutext, //输入的备注
      // ownStore: that.data.xtypecode, //门店的编号
      memberAddrId: that.data.addresobject.id, //地址的id
      couponId: that.data.shopmessage&&that.data.shopmessage.cuponConsumption&&that.data.shopmessage.cuponConsumption.length>0?that.data.shopmessage.cuponConsumption[0].id:'', //优惠券id
      quantity: that.data.shopmessage.quantity, //商品的数量        
      orderType: that.data.shopmessage.orderType, //订单类型
      orderStatus: that.data.addorderType&&that.data.addorderType!='undefined' ? 10 : '', //线下订单的订单状态
      skuId: that.data.shopmessage.skuId, //商品的skuid
      cartIds: that.data.shopmessage.cartIds, //购物车id字符串
      skuIds: that.data.shopmessage.skuIds, //购物车商品id字符串
      period: that.data.shopmessage.mallItemSkuList[0].period, //大礼包的期数
      promotionsId: that.data.cartsPromotionsId ? that.data.cartsPromotionsId : that.data.shopmessage.promotionsId, //促销的id
      recommenderId: app.globalData.shareid ||'', //推荐人id
      orderClassification:that.data.shopmessage.onlineAndOffline||that.data.shopmessage.onlineAndOffline==0?that.data.shopmessage.onlineAndOffline:1,
      // recommenderId:567               //推荐人id
    }
    console.log(data)
    if(data.couponId && data.couponId != '') {
      wx.showToast({
        title: '优惠券id：' + data.couponId + '' + '   订单号：' + data.orderNum + '' + '\r\n订单类型：' + data.orderType + '' + '   商品数量：' + data.quantity,
        icon: 'none',
        duration: 3500,
        mask: true
      })
    }
    api.newget('/rest/memberCenter/addOrder', data, 'POST', function (e) {
      console.log(e)
      if (e.code == 500) {
        wx.showToast({
          title: e.message,
          icon: 'none',
          duration: 4000
        })
        return false
      }
      //是线下支付的订单
      else if (that.data.addorderType == "offlinePayment") {
        // wx.showToast({
        //   title: '线下订单提交成功,即将跳转到订单详情',
        //   icon:'none',
        //   duration:2000,
        //   mask:true,
        //   success(){
        //    var timer =  setTimeout(()=>{
        //     clearTimeout(timer)
        //     wx.redirectTo({
        //       url: '/order/order_detail/order_detail?orderType='+e.data.orderType+'&id='+e.data.id,
        //     })
        //     },2000)
        //   }
        // })
        that.setData({
          isReselectShow: !that.data.isReselectShow,
          orderDetailType: e.data.orderType,
          orderDetailId: e.data.id
        })
        return false
      }else if(e&&e.data.orderStatus==0){
        var timer = setTimeout(() => {
          app.showToastMessage('下单成功')
          wx.redirectTo({
                  url: '/order/order_detail/order_detail?orderType='+e.data.orderType+'&id='+e.data.id,
              })
            clearTimeout(timer)
        }, 1500);
      }
       else if (e) {
        wx.login({
          success(res) {
            var codes = res.code
            //微信支付接口返回的数据
            api.newget('/rest/payApi/xcxPay?code=' + codes + '&orderNum=' + timestamp, {}, 'POST', function (e) {
              if (e.code == 500) {
                wx.showToast({
                  title: e.message,
                  icon: 'none'
                })
                return
              }
              
              if(e.code == 408) {
                wx.navigateTo({
                  url: '../../xpages/paypage/paypage?timestamp=' + timestamp + '&price=0.00' + '&status=' + '成功',
                })
                return
              }

              wx.requestPayment({
                'timeStamp': e.data.timeStamp,
                'nonceStr': e.data.nonceStr,
                'package': e.data.weixinPackage,
                'signType': 'MD5',
                'paySign': e.data.sign,
                "success": function (res) {
                  console.log(res)
                  wx.hideLoading({
                    success: (res) => {},
                  })
                  if (res.errMsg == "requestPayment:ok") {
                    wx.navigateTo({
                      url: '../../xpages/paypage/paypage?timestamp=' + timestamp + '&price=' + that.data.shopmessage.totlePrice + '&status=' + '成功',
                    })
                  }
                },
                "fail": function (res) {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.navigateTo({
                      url: '../../xpages/paypage/paypage?timestamp=' + timestamp + '&price=' + that.data.shopmessage.totlePrice + '&status=' + '失败',
                    })
                  }
                  wx.hideLoading({
                    success: (res) => {},
                  })

                  //  wx.showToast({
                  //   title: res,
                  //   icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
                  //   duration: 1500     
                  // })  
                }
              })
            }, 0)
          }
        })

      }
    })
  },





  /**
   * 
   * 选择门店的点击事件  
   * 
   */
  storedianji: function (e) {
    this.setData({
      xtypecode: e.currentTarget.dataset.typecode,
      xtypename: e.currentTarget.dataset.typename,
      isstroenum: !this.data.isstroenum
    })
  },

  //picker点击事件
  bindPickerChange: function (e) {
    let that = this
    let index = e.detail.value
    that.setData({
      pindex: index,
      xtypecode: that.data.getstroe[index].typecode,
      xtypename: that.data.getstroe[index].typename,
    })
    console.log(e)
  },

  //设计师点击
  bindPickerChangetwo: function (e) {
    let that = this
    let index = e.detail.value
    this.setData({
      dindex: index,
      shejiidss: that.data.desinlist[index].id,
      xshejitypename: that.data.desinlist[index].name,
    })
  },

  /**
   * 
   * 选择设计师的点击事件  
   * 
   */
  designdianji: function (e) {
    this.setData({
      shejiidss: e.currentTarget.dataset.id,
      xshejitypename: e.currentTarget.dataset.name,
      isdesignermanual: !this.data.isdesignermanual
    })
  },


  /**
   * 
   * 选择收获地址
   * 
   */
  addressbox: function () {
    this.setData({
      isxshow: !this.data.isxshow
    })
  },


  /**
   * 
   * 关闭收获地址选择
   * 
   */
  close: function () {
    this.setData({
      isxshow: !this.data.isxshow
    })
  },


  /**
   * 
   * 选择地址
   * 
   */
  onAddAddress: function (e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    let that = this
    that.setData({
      addresobject: that.data.addressList[index],
      id: e.currentTarget.dataset.id,
      isxshow: !that.data.isxshow
    })
  },


  /**
   * 
   * 新增地址
   * 
   */
  addnewaddress: function () {
    var that = this;
    // wx.showToast({
    //   title: '暂时不可用，请到个人中心添加',
    //   icon:'none'
    // })
    wx.navigateTo({
      url: '/member/add_address/add_address?id=' + '',
    })
    // that.setData({
    //   isxshows: !that.data.isxshows
    // })
  },

  /**
   * 
   * 关闭新增地址
   * 
   */
  closenew: function () {
    this.setData({
      isxshows: !this.data.isxshows
    })
  },



  /**
   * 
   * 收获地址选择
   * 
   */
  bindRegionChange: function (e) {
    this.setData({
      provinceCityCounty: e.detail.value,
      ishuadon: true
    })

  },

  /**
   * 
   * 添加收货地址
   * 
   */
  formSubmit: function (e) {
    console.log(e)
    let list = e.detail.value
    let that = this;

    if (list.getconsignee == '') {
      wx.showToast({
        title: '请输入收获人姓名',
        icon: 'none',
        duration: 1500
      })
    } else if (list.bindregionchange == '') {
      wx.showToast({
        title: '请输入收获人地址',
        icon: 'none',
        duration: 1500
      })
    } else if (list.getaddress == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1500
      })
    } else if (list.getphone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        duration: 1500
      })
    } else {
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(list.getphone)) {
        wx.showToast({
          title: '电话号码格式不对',
          icon: 'none',
          duration: 1500
        })
      } else {
        let tokens = app.globalData.token
        if (list.switch) {
          var isdefault = 1
        } else {
          var isdefault = 0
        }
        let data = {
          consignee: list.getconsignee,
          detailAddress: list.getaddress,
          provinceCityCounty: list.bindregionchange[0] + list.bindregionchange[1] + list.bindregionchange[2],
          consigneeTelephone: list.getphone,
          zipCode: list.getcode,
          addressAlias: list.getaddressa,
          isDefault: isdefault,
          id: ''
        }
        api.newget('/rest/memberCenter/shippingAdressAddOrUpdate', data, 'POST', function (e) {
          console.log(e)
          if (e.code == 200) {
            wx.showToast({
              title: '添加地址成功',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            let data = {}
            // 查询地址列表用来选择
            api.newget('/rest/memberCenter/myShippingAdress', data, 'GET', function (e) {
              that.setData({
                addressList: e.data,
                isxshows: !that.data.isxshows
              })
            })
          }
        })
      }
    }
  },


  usecoupon: function () {
    this.setData({
      dialogcouplist: true
    })
  },

  closetanchuang: function () {
    console.log('关闭')
    this.setData({
      dialogcouplist: false
    })
  },


  /**
   * 
   * 在优惠券列表选择优惠券
   * 
   * 
   */
  chiocecoup: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.ischiocecoup)
    let that = this
    let index = e.currentTarget.dataset.index
    let pricejia = e.currentTarget.dataset.couponamount
    console.log(pricejia)
    let zuizhongjiage = (that.data.shopmessage.totlePrice - pricejia).toFixed(2)
    let zuizhongjiages = parseFloat(zuizhongjiage)
    console.log(zuizhongjiages)
    if (e.currentTarget.dataset.ischiocecoup) {
      let list = 'shopmessage.cuponConsumption[' + index + '].ischiocecoup'
      let price = 'shopmessage.totlePrice'
      this.setData({
        [list]: false,
        couplistid: '',
        [price]: that.data.shopmessagejiage,
        youhuijiages: 0.00,
        dialogcouplist: false
      })
    } else {
      let list = 'shopmessage.cuponConsumption[' + index + '].ischiocecoup'
      let price = 'shopmessage.totlePrice'
      this.setData({
        [list]: true,
        couplistid: e.currentTarget.dataset.id,
        [price]: zuizhongjiages,
        youhuijiages: pricejia,
        dialogcouplist: false
      })

    }
  },

  //监听页面显示
  onShow: function () {
    var that = this
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] // 当前页
    console.log(currPage.data.isadd)
    if (currPage.data.isadd == 1) {
      //如果是从上个页面传的值则赋值remarks  1
      // 查询地址列表用来选择
      api.newget('/rest/memberCenter/myShippingAdress', {}, 'GET', function (e) {
        that.setData({
          addressList: e.data,
        })
      })
      api.newget('/rest/memberCenter/getDeliveryAddress', {}, 'GET', function (e) {
        if (e) {
          if (e.data == null) {
            api.newget('/rest/memberCenter/myShippingAdress', {}, 'GET', function (e) {
              that.setData({
                addresobject: e.data[0]
              })
            })
          } else {
            that.setData({
              addresobject: e.data
            })
          }
        }
      })
    }

  },



  // 添加新地址
  new_address: function () {
    wx.navigateTo({
      url: '/member/add_address/add_address',
    })
  },

  // 确定然后跳到订单详情页面
  reselect() {
    this.setData({
      isReselectShow: !this.data.isReselectShow
    })
    wx.redirectTo({
      url: '/order/order_detail/order_detail?orderType=' + this.data.orderDetailType + '&id=' + this.data.orderDetailId,
    })
  }
  // onShow: function () {
  //   var that = this
  //   // api.xget('/rest/memberCenter/getDeliveryAddress', data, 'GET', header, function (e) {
  //     // if (e) {
  //       // if (e.data == null) {
  //         let tokens = app.globalData.token
  //         let data = {}
  //         console.log(tokens)
  //         let header = {
  //           'content-type': 'application/json',
  //           'X-AUTH-TOKEN': tokens
  //         }
  //         api.xget('/rest/memberCenter/myShippingAdress', data, 'GET', header, function (e) {
  //           that.setData({
  //             addresobject: e.data[0]
  //           })
  //         })
  //       // } else {
  //       //   wx.hideLoading({
  //       //     success: (res) => {},
  //       //   })
  //       //   that.setData({
  //       //     addresobject: e.data
  //       //   })
  //       // }

  //     // }
  //   // })
  // }


})