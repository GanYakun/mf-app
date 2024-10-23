// pages/shop/shop.js
var api = require("../../utils/api.js")
var app = getApp()
var WxParse = require("../../wxParse/wxParse.js")
var isConsole = app.globalData.isConsole
import requestCenter from '../../http/request-center'
import pageRote from "../../utils/page-route"
import {
  wxml,
  style
} from './demo.js'
Page({
  data: {
    click: false,
    isshow: true,
    shows: "hidden", //控制是否弹出
    bottom: "xia", //显示或隐藏弹窗
    shows1: "hidden", //控制是否弹出
    bottom1: "xia", //显示或隐藏弹窗
    carshows: "hidden", //控制是否弹出
    carbottom: "xia", //显示或隐藏弹窗
    shopshow: ['产品展示', '规格参数'],
    shopindexs: 0,
    shopindex: 0,
    buynum: 1,
    oneindex: 0,
    twoindex: 0,
    threeindex: 0,
    fourindex: 0,
    stas: [],
    iosDialog22: false,
    couponList: '',
    Advancedeposit: false, //控制显示预付定金  默认不显示
    Deposit: [], //预付定金列表
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    shopPhone: app.globalData.callPhone,
    showBubble: false, //控制客服的弹窗
    shopScroll: app.globalData.pageWindowHeight / 1.55, //规格、说明、等的滑动区域最大高度
    chioceArr: [{
      name: '视频',
      type: 'productVedio'
    },
    {
      name: '图片',
      type: 'imagePathList'
    }],
    chioceIndex: 1,
    ftpurl: app.globalData.ftpurl,
    isemployee:app.globalData.isemployee,
    showSkuDialog: false
  },
  onLoad: async function (options) {
    app.log('xpages/shop/shop 跳转商品详情页面传的的数据', options)
    let fromPromotionsId = options.promotionsId
    this.setData({
      fromPromotionsId: fromPromotionsId
    })
    // console.log(decodeURIComponent(options.source))
    let scene = options.scene
    if (scene) {
      scene = decodeURIComponent(scene)
      let kvList = scene.split("&")
      let paramsObj = {}
      for (var i = 0; i < kvList.length; i++) {
        var key = kvList[i].split("=")[0]
        var val = kvList[i].split("=")[1]
        paramsObj[key] = val
      }
      if (paramsObj && paramsObj.p) {
        let arr = paramsObj.p.split('-')
        options.NeworderType = arr[0]
        options.cid = arr[1]
        options.objectId = arr[2]
        options.promotionsId = arr[3]
        options.typeId = arr[4]
        options.typeofpurchase = arr[5]
        app.globalData.shareid = arr[6]||''
      } else {
        options.objectId = paramsObj.objectId
        options.cid = paramsObj.cid
        options.typeId = paramsObj.typeId
        options.NeworderType = paramsObj.NeworderType
      }
    }
    //设置首页的标题
    let that = this
    let NeworderType = options.NeworderType
    if (NeworderType == 1 || NeworderType == 5) {
      let data = {
        promotionsType: options.NeworderType,
      }
      api.request('/rest/tWebPromotionsControllerApi/getXsqgListByPromotionsType', data, 'GET', function (e) {
        let index = 0
        if(fromPromotionsId) {
          for(let i=0; i<e.data.length; i++) {
            if(fromPromotionsId == e.data[i].id) {
              index = i
              break
            }
          }
        }
        that.setData({
          shoppromotionsId: e.data[index].id
        })
      })
    }
    if (NeworderType == 1) {
      that.flashmobileblogfunction();
      let queryPromotionsType = await that.queryPromotionsType(1)
      app.log('xpages/activitypage/activitypage 页面 queryPromotionsType', queryPromotionsType)
      let extendDataJson = {
        promotionsId: queryPromotionsType.id,
        promotionsType: 1
      }
      var extendData = JSON.stringify(extendDataJson)
    }

    let ratio = 750 / wx.getSystemInfoSync().windowWidth;
    let scrollHeight = Math.ceil(wx.getSystemInfoSync().windowHeight * ratio);
    if (options.NeworderType && options.NeworderType != "undefined") {
      if (!options.NeworderType) {
        that.setData({
          ordertype: 0
        })
      } else {
        that.setData({
          ordertype: options.NeworderType
        })
        //接受样品特卖的产品详情
        if (options.NeworderType == 3) {
          let queryPromotionsType = await that.queryPromotionsType(3)
          app.log('xpages/activitypage/activitypage 页面 queryPromotionsType', queryPromotionsType)
          let extendDataJson = {
            promotionsId: queryPromotionsType.id,
            promotionsType: 3
          }
          var extendData = JSON.stringify(extendDataJson)
          that.setData({
            shoppromotionsId: queryPromotionsType.id
          })
        }
      }
    } else if (options.buytype) {
      that.setData({
        ordertype: options.buytype
      })
    }
    that.setData({
      buytype: options.buytype,
      scorrlviewheight: scrollHeight
    })

    //如果是非功能按钮进来的
    if (options.buytype == 4) {
      //调用查询限时抢购的时间
      that.flashmobileblogfunction();
      let buydata = JSON.parse(options.buydata || {})
      let isgonnengdata = JSON.parse(options.isgonnengdata)
      that.setData({
        objectId: buydata.objectId,
        typeId: buydata.typeId,
        cid: isgonnengdata.cid,
        shoppromotionsId: buydata.extendData.promotionsId, //促销id
        buyxtype: 1, //购买的类型,
        ordertype: 1 //订单类型
      })
      // 查询规格
      var SpecificationsData = {
        itemId: buydata.objectId
      }
      //查询规格结束
      //设置状态栏标题
      if (isgonnengdata.productName == null) {
        if (isgonnengdata.itemName == null) {

        } else {
          wx.setNavigationBarTitle({
            title: isgonnengdata.itemName,
          })
        }
      } else {
        wx.setNavigationBarTitle({
          title: isgonnengdata.productName,
        })
      }
      api.newget('/rest/newsClass/getModel', buydata, 'GET', that.getModel)
      that.setData({
        getModelxx: buydata,
        buytype: options.buytype
      })
    } else {
      console.log("首页楼层进来或者其他")
      var objectId = options.objectId
      var typeId = options.typeId
      // 查询规格接口的参数
      var SpecificationsData = {
        itemId: objectId
      }
      if (options.typeofpurchase == 'dangqi') {
        if (that.data.ordertype) {
          var orderleixing = that.data.ordertype
        } else {
          var orderleixing = 2 //订单类型,
        }
      } else {
        if (that.data.ordertype) {
          var orderleixing = that.data.ordertype
        } else {
          var orderleixing = 0
        }
      }
      that.setData({
        objectId: objectId,
        typeId: typeId,
        cid: options.cid,
        // shoppromotionsId: '', //促销id
        buyxtype: 1, //购买的类型
        ordertype: orderleixing //订单类型
      })
      let getModelData = {
        objectId: objectId,
        newsClassId: 155,
        extendData: extendData ? extendData : {}
        // typeId: typeId
      }


      that.setData({
        getModelxx: getModelData,
        SpecificationsData: SpecificationsData
      })
      api.newget('/rest/newsClass/getModel', getModelData, 'GET', that.getModel)
      if (options.productName == null || options.productName == 'null') {
        if (options.itemName == null || options.itemName == 'null') {

        } else {
          wx.setNavigationBarTitle({
            title: options.itemName,
          })
        }
      } else {
        wx.setNavigationBarTitle({
          title: options.productName,
        })
      }
    }

    that.service()
  },




  /*** 查询限时抢购剩余的时间*/
  flashmobileblogfunction: function () {
    var that = this;
    let flashmobileblog = {
      promotionsType: 1
    }
    api.request('/rest/tWebPromotionsControllerApi/getXsqgListByPromotionsType', flashmobileblog, 'GET', function (e) {
      let index = 0
      let fromPromotionsId = that.data.fromPromotionsId
      if(fromPromotionsId) {
        for(let i=0; i<e.data.length; i++) {
          if(fromPromotionsId == e.data[i].id) {
            index = i
            break
          }
        }
      }

      // 计算限时抢购剩余的时间
      let endtime = e.data[index].promotionsEndTime
      let end_str = (endtime).replace(/-/g, "/");
      var end_date = new Date(end_str); //将字符串转化为时间  
      var mytime = new Date();
      if (end_date < mytime) {
        that.setData({
          time: 0
        })
      } else {
        that.setData({
          time: end_date - mytime
        })
      }
    })
  },

  /**根据活动的类型查询活动的id */
  queryPromotionsType(orderType) {
    let that = this
    return new Promise((resove, reject) => {
      let data = {
        promotionsType: orderType
      }
      api.request('/rest/tWebPromotionsControllerApi/getXsqgListByPromotionsType', data, 'GET', function (e) {
        let index = 0
        let fromPromotionsId = that.data.fromPromotionsId
        if(fromPromotionsId) {
          for(let i=0; i<e.data.length; i++) {
            if(fromPromotionsId == e.data[i].id) {
              index = i
              break
            }
          }
        }

        if (e.data) {
          resove(e.data[index])
        }
      })
    })
  },



  onShow: function () {

  },

  getModel: function (e) {
    var that = this;
    if (!(e && e.data)) {
      wx.showToast({
        title: '后台参数配置错误',
        icon: 'none',
        duration: 1500
      })
      var timer = setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
        clearTimeout(timer)
      }, 1500)
      return false
    }
    app.log('xpages/shop/shop 页面 getModel回调', that.data.ordertype)
    app.log('xpages/shop/shop 页面promotionsDetails ', JSON.parse(e.data.promotionsDetails))
    var ordertype = that.data.ordertype

    if (e.data) {
      console.log(e.data)
      if (e.data.brandZtContent) {
        WxParse.wxParse('brandZtContent', 'html', e.data.brandZtContent, that, 5);
      }
      console.log("getModel", e.data)
      that.setData({
        wxBannerList: e.data.wxBannerList, //微信广告图
        cid: e.data.cid,
        stock: (e.data.stock || e.data.stock == 0) ? (e.data.stock < 0 ? 0 : e.data.stock) : e.data.stock, //商品库存
        limitQuantity: e.data.limitQuantity, //商品限量
        ordinaryLimitCounts: e.data.limitCounts, //商品限购
        appletLabelsList:e.data.appletLabelsList
      })
    } else {
      wx.showToast({
        title: '内容数据出错',
        icon: 'none',
        duration: 1500
      })
      var timer = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
          success: function () {}
        })
        clearTimeout(timer)
      }, 1500)
      return false
    }
    try {
      if (e.data.productName || e.data.itemName) {
        that.setData({
          shareTitle: e.data.productName ? e.data.productName : e.data.itemName
        })
      }
    } catch {

    }
    console.log("onload加载的函数getModel", e)
    var YupayModel = e.data.promotionsDetailsList
    // 有预付定金走该方法
    if (e.data.promotionsDetailsList) {
      e.data.promotionsDetailsList.forEach(function (v, k) {
        // 计算限时抢购剩余的时间
        let endtime = v.promotionsEndTime
        let end_str = (endtime).replace(/-/g, "/");
        var end_date = new Date(end_str); //将字符串转化为时间  
        var mytime = new Date();
        let time = 'Deposit[' + k + '].promotionsEndTime'
        let salePrice = 'Deposit[' + k + '].salePrice' //满salePrice元减offsetAmount元
        let offsetAmount = 'Deposit[' + k + '].offsetAmount'
        let productSku = 'Deposit[' + k + '].productSku'
        that.setData({
          [salePrice]: v.salePrice,
          [offsetAmount]: v.offsetAmount,
          [productSku]: v.productSku
        })
        if (end_date < mytime) {
          that.setData({
            [time]: 0
          })
        } else {
          that.setData({
            [time]: end_date - mytime
          })
        }

      })


      this.setData({
        Advancedeposit: true,
        promotionsDetailsList: e.data.promotionsDetailsList[0]
      })
    }
    this.setData({
      xshopmessage: e.data
    })
    var productName = e.data.productName
    var itemName = e.data.itemName
    var brandImagesPath = e.data.brandImagesPath
    if (brandImagesPath) {
      brandImagesPath = JSON.parse(brandImagesPath)
      for (let i = 0; i < brandImagesPath.length; i++) {
        if (brandImagesPath[i].path) {
          e.data.imagePathList.push(brandImagesPath[i].path)
        }
      }
    }
    var imagePathList = e.data.imagePathList
    var ispromotionsDetails = e.data.sku
    if (ordertype == 3) {
      var skustr = e.data.promotionsDetails
    } else if (ordertype == 1) {
      var skustr = e.data.promotionsDetails
      var skustr2 = JSON.parse(e.data.sku)
    } else {
      var skustr = e.data.sku
    }
    var cid = e.data.cid
    console.log('skustr', skustr)
    console.log(skustr.length)
    //商品下架处理
    if (skustr == [] || skustr == '[]') {
      wx.showToast({
        title: '该商品已下架',
        icon: 'none',
        duration: 1500
      })
      var timer = setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
        clearTimeout(timer)
      }, 1500)
      return false
    }
    var itemPrice = e.data.itemPrice
    console.log("itemPrice", itemPrice)
    // 刚进入页面需要显示最低的价格
    if (skustr != '' && skustr != null) {
      var skuList = JSON.parse(skustr)
      console.log("sku规格列表的数组", skuList)
      var pricearr = [];
      var pricearr2 = []; //为限时抢购时把sku的价格存进去
      skuList.forEach(function (v, k) {
        if (ordertype == 1) {
          pricearr.push(v.sale_price)
        } else {
          pricearr.push(v.one_price)
        }
      })
      console.log('把价格存到数组', pricearr)
      var min = Math.min.apply(null, pricearr)
      console.log(min)
      let indexes = pricearr.indexOf(min) //最低价格所对应的索引
      // 得到限时抢购的原价
      if (skustr2) {
        that.setData({
          originalPrice: skustr2[indexes].one_price
        })

      }
      //如果为样品特卖  需要算出降价的价格
      if (ordertype == 3) {
        var one_price = skuList[indexes].one_price
        var skuid = skuList[indexes].id
        var surplus_stock = skuList[indexes].surplus_stock

        //add
        var specialPrice = skuList[indexes].specialprice
        //add

        try {
          var offset_amount = skuList[indexes].offset_amount
        } catch {
          var offset_amount = 0
        }
        that.setData({
          originalPrice: one_price + offset_amount,
          specialPrice: specialPrice,
          surplus_stock: surplus_stock
        })
      } else if (ordertype == 1) {
        var one_price = skuList[indexes].sale_price
        var skuid = skuList[indexes].product_sku
        console.log(skuList[indexes])
        that.setData({
          limitCounts: skuList[indexes].limit_counts,
          saleCounts: skuList[indexes].sale_counts,
          surplus_stock: skuList[indexes].surplus_stock
        })
      } else if (!ispromotionsDetails) {
        var one_price = skuList[indexes].sale_price
        var skuid = skuList[indexes].product_sku
      } else {
        console.log(skuList, indexes)
        var one_price = skuList[indexes].one_price
        var skuid = skuList[indexes].id
      }
      if (YupayModel) {
        var test = YupayModel.find(obj => obj.productSku == skuList[indexes].id)
      }
      if (test) {
        that.setData({
          isYuPay: true
        })
      } else {
        that.setData({
          isYuPay: false
        })
      }
      console.log("skuList", skuList[indexes])
      this.setData({
        one_price: one_price,
        xskuid: skuid,
        defaultproperties: skuList[indexes].properties,
        defaultpropertiesHide: skuList[indexes].properties,
        defaultSku: skuList[indexes]
      })
      // 刚进入页面时让默认选中的规格正确
    }

    var promotionsDetailsList = e.data.promotionsDetailsList
    var detail = e.data.detail
    if (e.data.specifications) {
      var article = e.data.specifications.trim()
      article = article.replace(/\r/g, "")
      article = article.replace(/\n/g, "")
      article = article.replace(/\t/g, "")
    }
    if (article == null) {
      this.setData({
        shopshow: ['产品展示'],
      })
    } else {
      WxParse.wxParse('article', 'html', article, this, 5);
    }
    console.log("promotionsDetailsList", promotionsDetailsList)
    try {
      var rechtml = detail.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ')
    } catch {
      var rechtml = ''
    }
    WxParse.wxParse('detail', 'html', rechtml, this, 5);
    if(e && e.data && e.data.productVedio) {
      this.setData({
        list: e.data,
        chioceIndex: 0
      })
    } else {
      this.setData({
        list: e.data,
        chioceIndex: 1
      })
    }
    this.setData({
      productName: productName,
      itemName: itemName,
      imgurl: app.globalData.imgur,
      imagePathList: imagePathList,
      specifications: article,
      itemPrice: itemPrice,
      skustr: skustr,
      cid: cid
    })

    var mallItemsStart = 1
    let getMallItemsListData = {
      cid: cid,
      start: mallItemsStart,
      pageSize: 10
    }
    api.request('/rest/tWebMallItemSkuControllerApi/getMallItemsList', getMallItemsListData, 'GET', this.getMallItemsList)
    that.couponList()
    api.request('/rest/tWebMallItemCatControllerApi/getmallItemSkuProperties', this.data.SpecificationsData, 'GET', that.getmallItemSkuProperties)
  },


  getMallItemsList: function (e) {
    let arr = e.data
    let objectId = this.data.objectId
    let index = arr.findIndex(obj => obj.itemId == objectId)
    if (index != -1) {
      arr.splice(index, 1)
    }
    this.setData({
      mallItemsStart: 1,
      getMallItemsList: arr
    })
  },

  change: function (e) {
    this.setData({
      shopindex: e.detail.current
    })
    if (e.detail.current != 0) {
      this.setData({
        isshow: false
      })
    } else {
      this.setData({
        isshow: true
      })
    }
  },


  //点击规格显示底部弹出框
  clickme: function (e) {
    var btn = e.currentTarget.dataset.btn
    this.setData({
      shows: "show",
      bottom: "chu",
      btn: btn
    })
    var itemId = this.data.objectId
    console.log(itemId)
    let SpecData = {
      itemId: itemId
    }
    let getmallItemSkuPropertiesList = this.data.getmallItemSkuPropertiesList
    let stuskr = JSON.parse(this.data.skustr)
    console.log(stuskr)

    api.request('/rest/tWebMallItemCatControllerApi/getmallItemSkuProperties', SpecData, 'GET', this.getmallItemSkuProperties)
  },

  carclickme: function () {
    this.setData({
      carshows: "show",
      carbottom: "chu"
    })
    var itemId = this.data.objectId

    let getmallItemSkuPropertiesData = {
      itemId: itemId
    }
    api.request('/rest/tWebMallItemCatControllerApi/getmallItemSkuProperties', getmallItemSkuPropertiesData, 'GET', this.getmallItemSkuProperties)
  },
  //点击优惠活动显示底部弹出框
  clickmes: function () {
    let that = this
    that.couponList()
    that.setData({
      shows1: "show",
      bottom1: "chu"
    })
  },
  /**
   * 
   * 优惠券列表
   * 
   * 
   */
  couponList: function (e) {
    let that = this
    let cid = that.data.cid
    let itemId = that.data.objectId
    let token = app.globalData.token
    let couponListData = {
      cid: cid,
      itemId: itemId
    }
    api.newget('/rest/tWebCouponControllerApi/couponList', couponListData, 'GET', function (e) {
      if (e.code == 200) {
        that.setData({
          couponList: e.data
        })

      } else {
        console.log('未登录')
      }
    }, 0)

  },
  // 领取优惠券
  onReceiveTap: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let token = app.globalData.token
    if (token == undefined) {
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
      let saveData = {
        // couponId: id
      }
      let header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': token
      }
      api.xget('/rest/tWebCouponControllerApi/save?couponId=' + id, saveData, 'PUT', header, function (e) {
        console.log(e)
        if (e.message == '') {
          wx.showToast({
            title: '领取成功',
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


  // 服务保证项
  service: function () {
    let that = this
    let data = {
      newsClassId: 155
    }
    api.request('/rest/tWebWxBannerControllerApi/getServiceIconByNewsClassId', data, 'GET', function (e) {
      if (e.code == 200) {
        that.setData({
          serviceList: e.data,
          remark: e.data.remark
        })
      }
    })

  },









  /**
   * 
   * 查询规格的回调函数
   * 
   */
  getmallItemSkuProperties: function (e) {
    let that = this
    let defaultproperties = that.data.defaultproperties //默认选中的规格参数
    if (this.data.skustr) {
      var stuskr = JSON.parse(this.data.skustr || "{}")
    }

    return new Promise((resolve, reject) => {
      console.log("规格的返回结果", e)
      let getmallItemSkuPropertiesList = e.data
      that.setData({
        getmallItemSkuPropertiesList: getmallItemSkuPropertiesList,
      })
      getmallItemSkuPropertiesList.forEach((v, k) => {
        v.propValueIdList.forEach((vs, ks) => {
          let defaultproperties = this.data.defaultproperties
          let defauArr = defaultproperties.split(';')
          let subscriptindex = defauArr.findIndex(obj => obj.split(':')[1] == vs.id)
          if (subscriptindex != -1) {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: true
            })
          }
          console.log(defauArr)
          let findPropIdIndex = defauArr.findIndex(obj => obj.split(':')[0] == v.propId)
          defauArr[findPropIdIndex] = v.propId + ':' + vs.id
          let finSkuIndex = stuskr.findIndex(obj => obj.properties == defauArr.join(';'))
          if (finSkuIndex == -1) {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].noProperties`]: true
            })
          } else {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].noProperties`]: false
            })
          }
        })
      })

    })
  },

  /**
   * 
   * 拿到规格列表后默认选中第一个时的价格
   * 
   */
  async contrast(e) {
    var that = this
    var propertiesarr = e
    console.log("返回来的propertiesarr", propertiesarr)
    var shopMessage = that.data.list
    var defaultproperties = defaultproperties
  },



  //隐藏底部弹窗
  close() {
    this.setData({
      shows: "hidden",
      bottom: "xia",
      shows1: "hidden",
      bottom1: "xia",
      carshows: "hidden",
      carbottom: "xia",
    })
  },


  chioceaaa() {
    let defaultproperties = this.data.defaultproperties //初始化时默认选中的规格参数
    let defaultPropertiesOne = defaultproperties.split(';')[0]
    let getmallItemSkuPropertiesList = this.data.getmallItemSkuPropertiesList
    for (var i = 0; i < getmallItemSkuPropertiesList.length; i++) {
      for (var j = 0; i < getmallItemSkuPropertiesList[i].propValueIdList.length; j++) {
        let skuCombination = getmallItemSkuPropertiesList[i].propId + ':' + getmallItemSkuPropertiesList[i].propValueIdList[j].id
        console.log(skuCombination)
      }
    }
    // getmallItemSkuPropertiesList.forEach((v,k)=>{
    //   (v.propValueIdList).forEach((vs,ks)=>{
    //     let skuCombination = v.propId+':'+vs.id
    //     console.log(skuCombination)
    //   })
    // })
    if (!this.data.skustr) {
      return false
    }
    let skustr = JSON.parse(this.data.skustr)
    console.log(skustr)
    skustr.forEach((v, k) => {
      (v.properties.split(';')).forEach((vs, ks) => {
        console.log(vs)
      })
    })
    // let findIndexSku = skustr.findIndex(obj => obj.properties == joinDefauArr)
    // console.log(findIndexSku)
    let testArr = []
    skustr.forEach((v, k) => {
      // skustr[k].properties = v.properties.split(';')
      let skustr = v.properties.split(';')
      testArr.push({
        arr: [],
        value: v
      })
      defauArr.forEach((vs, ks) => {
        console.log(skustr)
        console.log(vs)
        var findIndexSkustr = skustr.findIndex(obj => obj == vs)
        console.log(findIndexSkustr)
        testArr[k].arr.push(findIndexSkustr)
      })
    })
    console.log(testArr)
    // let findIndexSku = skustr.findIndex(obj => obj.properties == joinDefauArr)
    let findIndexSkuArr = []
    testArr.forEach((vs, ks) => {
      findIndexSkuArr.push({
        index: ((vs.arr).findIndex(obj => obj == -1)),
        value: vs.value
      })
    })
    console.log(findIndexSkuArr)
  },

  // 规格的点击事件
  async chioce(e) {
    let oneindex = e.currentTarget.dataset.index
    let fatindex = e.currentTarget.dataset.fatindex
    let getmallItemSkuPropertiesList = this.data.getmallItemSkuPropertiesList
    //选中时取消选中
    let skuClick = getmallItemSkuPropertiesList[fatindex].propValueIdList[oneindex].isChioce
    let id = getmallItemSkuPropertiesList[fatindex].propValueIdList[oneindex].id
    let parentId = getmallItemSkuPropertiesList[fatindex].propId
    let skustr = JSON.parse(this.data.skustr)
    app.log('规格点击事件', skustr)
    let defaultproperties = this.data.defaultproperties //初始化时默认选中的规格参数

    let defauArr = []
    console.log(fatindex)
    getmallItemSkuPropertiesList.forEach((v, k) => {
      if (k === fatindex) {
        (v.propValueIdList).forEach((vs, ks) => {
          if (ks === oneindex) {
            if (!vs.isChioce) {
              let skuCombination = v.propId + ':' + vs.id
              defauArr.push(skuCombination)
            }
          }
        })
      } else {
        (v.propValueIdList).forEach((vs, ks) => {
          if (vs.isChioce) {
            let skuCombination = v.propId + ':' + vs.id
            defauArr.push(skuCombination)
          }
        })
      }
    })
    app.log('处理过后的defauArr', defauArr)
    this.setData({
      buyProperties: defauArr
    })
    if (!((this.data.defaultpropertiesHide.split(';')).length == defauArr.length)) {
      getmallItemSkuPropertiesList.forEach((v, k) => {
        if (k == fatindex) {
          v.propValueIdList.forEach((vs, ks) => {
            if (vs.id == id) {
              if (skuClick) {
                this.setData({
                  [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: false //设置选中的选项
                })
              } else {
                this.setData({
                  [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: true //设置选中的选项
                })
              }

            } else {
              this.setData({
                [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: false //去除其他选中的选项
              })
            }

          })
        }
      })
      return false
    }
    let defaultProSplit = this.data.defaultpropertiesHide.split(';')
    defaultProSplit.forEach((v, k) => {
      defaultProSplit[k] = v.split(':')[0]
    })
    console.log(defaultProSplit)

    let defaultProSplitFun = function () {
      var defauArrHandle = []
      return new Promise((resove, reject) => {

        defaultProSplit.forEach((v, k) => {
          console.log(defauArr)
          let findIndex = defauArr.findIndex(obj => obj.split(':')[0] === v)
          // defauArrHandle[findIndex] = defauArr[k]
          defauArrHandle.push(defauArr[findIndex])
        })
        resove(defauArrHandle)
      })
    }
    let defauArrHandle = await defaultProSplitFun()
    console.log(defauArrHandle)
    let joinDefauArr = defauArrHandle.join(';')
    console.log(joinDefauArr)
    console.log(skustr)
    console.log(defaultProSplit)
    this.setData({
      defaultproperties: joinDefauArr
    })
    let findIndexSku = skustr.findIndex(obj => obj.properties == joinDefauArr)




    if (findIndexSku != -1) {
      var that = this
      let comparison = skustr[findIndexSku]
      if (!comparison.one_price) {
        var one_price = comparison.sale_price
        var skuid = comparison.product_sku
      } else {
        var one_price = comparison.one_price
        var skuid = comparison.id
      }
      // 当产品为限时抢购时
      if (that.data.ordertype == 1) {
        that.setData({
          limitCounts: comparison.limit_counts,
          originalPrice: JSON.parse(that.data.xshopmessage.sku)[findIndexSku].one_price,
          surplus_stock: comparison.surplus_stock,
          saleCounts: skuList[indexes].sale_counts,
        })
      }
      //判断点击的规格是否有预付定金
      if (that.data.promotionsDetailsList) {
        var test = that.data.promotionsDetailsList.find(obj => obj.productSku == comparison.id)
        console.log(test)
      } else {
        var test = ''
      }
      if (test) {
        that.setData({
          isYuPay: true,
          shoppromotionsId: test.promotionsPeriod
        })
      } else {
        that.setData({
          isYuPay: false
        })
      }
      that.setData({
        one_price: one_price,
        xskuid: skuid,
        defaultproperties: joinDefauArr,
        defaultSku: comparison
      })
    } else {

      if (!skuClick) {
        let pname = getmallItemSkuPropertiesList[fatindex].pname
        if (!(this.data.pleaseArr ? this.data.pleaseArr.length > 0 : false)) {
          app.showToastMessage("该" + pname + '暂时无货')
          return false
        }

      }


      //选中选项处理
      getmallItemSkuPropertiesList.forEach((v, k) => {
        if (k == fatindex) {
          v.propValueIdList.forEach((vs, ks) => {
            if (vs.id == id) {
              if (skuClick) {
                this.setData({
                  [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: false //设置选中的选项
                })
              } else {
                this.setData({
                  [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: true //设置选中的选项
                })
              }

            } else {
              this.setData({
                [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: false //去除其他选中的选项
              })
            }
          })
        }
      })
      return false
    }
    getmallItemSkuPropertiesList.forEach((v, k) => {
      if (k == fatindex) {
        v.propValueIdList.forEach((vs, ks) => {
          console.log(vs.id + '和' + id)
          if (vs.id == id) {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: true //设置选中的选项
            })
          } else {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: false //去除其他选中的选项
            })
          }

        })
      }
    })





    return
    // var that = this;
    // that.data.isSpu=[]  // 把判断是否存在规格的数组设为空
    // let oneindex = e.currentTarget.dataset.index
    // let fatindex = e.currentTarget.dataset.fatindex
    // let list = that.data.getmallItemSkuPropertiesList
    // let fatid = list[fatindex].propId
    // let sonid = list[fatindex].propValueIdList[oneindex].id
    // let contrast = fatid + ":" + sonid
    // console.log(fatindex)
    // console.log('规格点击事件', fatindex, '和', oneindex, '第二个', )
    // let arrlist = 'getmallItemSkuPropertiesList[' + fatindex + '].isclick'

    // // var clickskulist = await that.publicfun(fatindex)
    // var defaultproperties = that.data.defaultproperties.split(';')
    // defaultproperties[fatindex] = contrast
    // var clickskulist = defaultproperties
    // let skustr = JSON.parse(that.data.skustr)
    // app.log('xpages/shop/shop  skustr',skustr)
    // app.log('xpages/shop/shop   this.data.skustr', this.data.skustr)
    // // let finData = skustr.find(obj => obj.properties = clickskulist.join(";"))
    // // app.log('xpages/shop/shop   finData.sale_price', finData.sale_price)
    // skustr.forEach(function (v, k) {
    //   console.log(v.properties)
    //   console.log(clickskulist.join(";"))
    //   if (v.properties == clickskulist.join(";")) {

    //     console.log("相等",v.one_price?v.one_price:v.sale_price)
    //     that.data.isSpu.push(v.one_price?v.one_price:v.sale_price)    //是否存在该规格
    //     if (v.one_price == undefined) {
    //       var one_price = v.sale_price
    //       var skuid = v.product_sku
    //     } else {
    //       var one_price = v.one_price
    //       var skuid = v.id
    //     }
    //     // 当产品为限时抢购时
    //     if(that.data.ordertype == 1){
    //       that.setData({
    //         limitCounts:v.limit_counts,
    //         originalPrice:JSON.parse(that.data.xshopmessage.sku)[k].one_price,
    //         surplus_stock:v.surplus_stock
    //       })
    //     }
    //     //判断点击的规格是否有预付定金
    //     if (that.data.promotionsDetailsList) {
    //       var test = that.data.promotionsDetailsList.find(obj => obj.productSku == v.id)
    //       console.log(test)
    //     } else {
    //       var test = ''
    //     }

    //     if (test) {
    //       that.setData({
    //         isYuPay: true,
    //         shoppromotionsId: test.promotionsPeriod
    //       })
    //     } else {
    //       that.setData({
    //         isYuPay: false
    //       })
    //     }
    //     that.setData({
    //       one_price: one_price,
    //       xskuid: skuid,
    //       defaultproperties: clickskulist.join(';')
    //     })
    //   }
    //   })
    // if(that.data.isSpu.length == 0){
    //   wx.showToast({
    //     title: '无货',
    //     icon:'none'
    //   })
    // }else{
    //   that.setData({
    //     [arrlist]: contrast
    //   })
    //   let arr = that.data.chioceSpec
    //   arr[fatindex].subscript.forEach(function (vs, ks) {
    //     if (ks == oneindex) {
    //       arr[fatindex].subscript[ks].ischioce = 1
    //     } else {
    //       arr[fatindex].subscript[ks].ischioce = 0
    //     }
    //   })
    //   that.setData({
    //     chioceSpec: arr
    //   })
    // }

    // })
    // })




  },

  chiocetest(event) {
    let oneindex = event.currentTarget.dataset.index
    let fatindex = event.currentTarget.dataset.fatindex
    let getmallItemSkuPropertiesList = this.data.getmallItemSkuPropertiesList
    let propValueIdList = getmallItemSkuPropertiesList[fatindex].propValueIdList[oneindex]
    let skuClick = propValueIdList.isChioce
    let defaultpropertiesSplit = this.data.defaultproperties.split(';') //初始化时默认选中的规格参数
    let propertiesHide = this.data.defaultpropertiesHide.split(';')
    let propId = getmallItemSkuPropertiesList[fatindex].propId //第一级id
    let id = propValueIdList.id
    let newArray = []
    let isDisaple = propValueIdList.noProperties
    if (isDisaple) {
      //判断是否有货
      app.log('判断是否有货', '无货')
      return false
    }
    getmallItemSkuPropertiesList.forEach((v, k) => {
      if (propId == v.propId) {
        v.propValueIdList.forEach((vs, ks) => {
          if (vs.id == id) {
            let skuIndex = propertiesHide.findIndex(obj => obj.split(':')[0] == v.propId)
            if (vs.isChioce) {
              // defaultpropertiesSplit.splice(skuIndex,1)
              defaultpropertiesSplit[skuIndex] = ''
            } else {
              defaultpropertiesSplit[skuIndex] = v.propId + ':' + vs.id
            }
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: vs.isChioce ? false : true,
              defaultproperties: defaultpropertiesSplit.join(';')
            })

          } else {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].isChioce`]: false
            })
          }
        })
      }
    })
    let skustr = JSON.parse(this.data.skustr)
    getmallItemSkuPropertiesList.forEach((v, k) => {
      v.propValueIdList.forEach((vs, ks) => {
        let deProp = this.data.defaultproperties.split(';')
        let skuIndex = propertiesHide.findIndex(obj => obj.split(':')[0] == v.propId)
        deProp[skuIndex] = v.propId + ':' + vs.id
        let isNull = deProp.findIndex(obj => obj == '')
        if (isNull != -1) {
          this.setData({
            [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].noProperties`]: false
          })
        } else {
          let isIndex = skustr.findIndex(obj => obj.properties == deProp.join(';'))
          if (isIndex == -1) {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].noProperties`]: true
            })
          } else {
            this.setData({
              [`getmallItemSkuPropertiesList[${k}].propValueIdList[${ks}].noProperties`]: false
            })
          }
        }

      })
    })
    let isNull = defaultpropertiesSplit.findIndex(obj => obj == '')
    if (isNull == -1) {
      let findIndexSku = skustr.findIndex(obj => obj.properties == defaultpropertiesSplit.join(';'))
      console.log(findIndexSku)
      if (findIndexSku != -1) {
        var that = this
        let comparison = skustr[findIndexSku]
        if (!comparison.one_price) {
          var one_price = comparison.sale_price
          var skuid = comparison.product_sku
          var stock = comparison.stock
        } else {
          var one_price = comparison.one_price
          var skuid = comparison.id
          var stock = comparison.stock
        }
        
        // 当产品为限时抢购时
        if (that.data.ordertype == 1) {
          let arr = JSON.parse(that.data.xshopmessage.sku)
          that.setData({
            limitCounts: comparison.limit_counts,
            originalPrice: arr[findIndexSku].one_price,
            surplus_stock: comparison.surplus_stock
          })
        } else if(that.data.ordertype == 3) {
          //add
          that.setData({
            specialPrice: comparison.specialprice
          })
          //add
        }
        //判断点击的规格是否有预付定金
        if (that.data.promotionsDetailsList) {
          var test = that.data.promotionsDetailsList.find(obj => obj.productSku == comparison.id)
          console.log(test)
        } else {
          var test = ''
        }
        if (test) {
          that.setData({
            isYuPay: true,
            shoppromotionsId: test.promotionsPeriod
          })
        } else {
          that.setData({
            isYuPay: false
          })
        }
        that.setData({
          one_price: one_price,
          xskuid: skuid,
          defaultSku: comparison
          // stock:stock
        })
      }
    }
  },

  /**
   * 点击规格和单位时用到的方法
   */
  publicfun: function (e) {
    var that = this
    return new Promise((resolve, reject) => {
      var defaultproperties = that.data.defaultproperties.split(';')
      var usesku = that.data.getmallItemSkuPropertiesList
      var arrSpec = []
      usesku.forEach(function (v, k) {
        console.log(v.isclick)
        if (v.isclick) {
          //如果当前规格已选中
          arrSpec.push(v.isclick)
        } else {
          var Specon = defaultproperties[k]
          arrSpec.push(Specon)
        }
      })
      resolve(arrSpec)
    })
  },



  // 规格参数和产品展示点击事件
  shopchioce(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      // scrollTop:index == 0?this.data.scrollTopPro:this.data.scrollTopSpe,
      scrollToId: index == 0 ? 'proisplay' : 'speparam',
      shopindexs: e.currentTarget.dataset.index
    })
  },

  /**
   * 
   * 商品数量加
   * 
   */
  buyjia() {
    let num = this.data.buynum
    console.log('数量加', num)
    let limitCounts = this.data.limitCounts || '' //活动限购
    let surplus_stock = this.data.surplus_stock //活动库存
    let saleCounts = this.data.saleCounts //活动限量
    let ordinaryLimitCounts = this.data.ordinaryLimitCounts //普通限购
    let limitQuantity = this.data.limitQuantity //普通限量
    let stock = this.data.stock //普通库存
    let nums = ++num
    console.log('buynum', nums)
    if (limitCounts && limitCounts != null) {
      if (nums > limitCounts) {
        // console.log('到这里----->1')
        app.showToastMessage('限购：' + limitCounts, )
        return false
      }
    } else if (ordinaryLimitCounts && ordinaryLimitCounts != null) {
      if (nums > ordinaryLimitCounts) {
        // console.log('到这里----->2')
        app.showToastMessage('限购：' + ordinaryLimitCounts, )
        return false
      }
    }
    if (surplus_stock && surplus_stock != null) {
      //活动库存
      if (nums > surplus_stock) {
        console.log('到这里----->1')
        app.showToastMessage('库存：' + surplus_stock, )
        return false
      }
    } else if (stock && stock != null) {
      if (nums > stock) {
        console.log('到这里----->2')
        app.showToastMessage('库存：' + stock, )
        return false
      }
    }
    if (saleCounts && saleCounts != null) {
      if (nums > saleCounts) {
        app.showToastMessage('限量：' + saleCounts)
        return false
      }
    } else if (limitQuantity && limitQuantity != null) {
      if (nums > limitQuantity) {
        app.showToastMessage('限量：' + limitQuantity)
        return false
      }
    }
    this.setData({
      buynum: nums
    })
  },

  /**
   * 
   * 商品数量减
   * 
   */
  buyjian() {
    let num = this.data.buynum
    let nums = num - 1
    if (nums == 0) {
      this.setData({
        buynum: 1
      })
    } else {
      this.setData({
        buynum: nums
      })
    }
  },



  shop: async function (e) {
    // await app.obtaintoken()
    // if (!app.globalData.token) {
    //   app.UserLoginToClick()
    //   return false
    // }
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var typeId = this.data.typeId
    wx.navigateTo({
      url: '/xpages/shop/shop?objectId=' + id + '&typeId=' + typeId
    })
  },
  // 收藏
  onCollectionTap: async function (e) {
    let that = this;
    let isclick = that.data.xshopmessage.isCollect
    let id = that.data.xshopmessage.pid
    app.log('isclick', id)
    if (isclick) {
      // api.newget('/rest/memberCenter/deleteCollectionById?collectionId=' + isclick, {}, 'POST', function (e) {
      //   if (e.code == 200) {
      //     wx.showToast({
      //       title: '取消收藏成功',
      //       icon: 'none'
      //     })
      //     that.setData({
      //       ['xshopmessage.isCollect']: false
      //     });
      //   }
      // }, 0)
      await requestCenter.deleteCollectionById({
        collectionId: isclick
      });
      wx.showToast({
        title: '取消收藏成功',
        icon: 'none'
      })
      that.setData({
        ['xshopmessage.isCollect']: false
      });
    } else {
      let data = {
        collectionId: id,
        collectionType: 'goods',
      }

      await requestCenter.addCollection(data);
      let data1 = {
        newsClassId: 155,
        objectId: id
      }
      let model = await requestCenter.getModel(data1);
      wx.showToast({
        title: "收藏成功",
        icon: 'none',
        duration: 1500
      })
      that.setData({
        ['xshopmessage.isCollect']: model.isCollect
      })

      // api.newget('/rest/memberCenter/addCollection', data, 'POST', function (e) {
      //   wx.showToast({
      //     title: e.message,
      //     icon: 'none',
      //     duration: 1500
      //   })
      //   let data1 = {
      //     newsClassId: 155,
      //     objectId: id
      //   }
      //   api.request('/rest/newsClass/getModel', data1, 'GET', function (res) {
      //     that.setData({
      //       ['xshopmessage.isCollect']: res.data.isCollect
      //     });
      //   }, 0)
      // }, 0)

    }

  },



  /**
   * 
   * 
   * 立即购买后的立即购买
   * 
   * 
   */
  bestbuymobile: async function () {
    let that = this;
    let getmallItemSkuPropertiesList = this.data.getmallItemSkuPropertiesList
    let defaultproperties = this.data.defaultproperties
    let defaultpropertiesSplit = defaultproperties.split(';')
    let defaultpropertiesHide = this.data.defaultpropertiesHide
    let defaultpropertiesHideSplit = defaultpropertiesHide.split(';')
    let isNull = defaultpropertiesSplit.findIndex(obj => obj == '')
    if (isNull != -1) {
      let fun = function () {
        return new Promise((resove, reject) => {
          let array = []
          getmallItemSkuPropertiesList.forEach((v, k) => {
            let findIndex = defaultpropertiesSplit.findIndex(obj => obj.split(':')[0] == v.propId)
            array.push(findIndex)
          })
          resove(array)
        })
      }
      let funEnd = await fun()
      console.log(funEnd)
      let noPropId = funEnd.findIndex(obj => obj == -1)
      if (noPropId != -1) {
        app.showToastMessage('请选择' + getmallItemSkuPropertiesList[noPropId].pname)
        return false
      }
    }
    await this.isStock()
    await this.quota()
    await app.obtaintoken()
    if (!app.globalData.token) {
      app.UserLoginToClick()
    } else {
      console.log(that.data.xskuid)
      var extendData = {};
      extendData['skuId'] = that.data.xskuid; //规格id
      extendData['quantity'] = that.data.buynum;
      extendData['itemId'] = that.data.objectId; //产品的id
      extendData['newsClassId'] = '155';
      extendData['promotionsId'] = that.data.shoppromotionsId; //促销的id，不是促销为空
      //  extendData['type']='1'                             //购买的类型，普通购买为1
      extendData['orderType'] = that.data.ordertype; //订单的类型
      
      let data = {
        ids: extendData,
        type: that.data.buyxtype,
        orderClassification:this.data.xshopmessage.onlineAndOffline||0
      }
      console.log("extendData", data)
      //判断是否达到限制购买次数
      let islimitBuy = that.data.ordertype
      if (islimitBuy == 1 || islimitBuy == 5) {
        let isCount = await that.isCount()
      }
      //样品特卖特殊处理
      if (islimitBuy == 3) {
        if (that.data.buynum > that.data.surplus_stock) {
          wx.showToast({
            title: '库存不足',
            icon: 'none'
          })
          return false
        }
      }
      api.newget('/rest/memberCenter/nowBuy', data, 'GET', function (e) {
        if (that.data.ordertype == 3) {
          e.data.originalPrice = that.data.originalPrice
        }
        if (that.data.limitCounts || that.data.limitCounts == 0) {
          if (e.data.quantity > that.data.limitCounts) {
            wx.showToast({
              title: '限量' + that.data.limitCounts + '件',
              icon: 'none'
            })
            return false
          }

        }
        let arr = JSON.stringify(e.data)
        if (e) {
          wx.hideLoading({
            success: (res) => {},
          })
          if (e.message == '未登录') {
            app.obtaintoken()
            that.data.bestbuymobile
          } else {
            wx.navigateTo({
              url: '../../xpages/orderattribute/orderattribute?data=' + encodeURIComponent(arr),
            })
          }
        }
      })
    }
  },

  //库存判断
  isStock() {
    return new Promise(async (resove, reject) => {
      // 判断库存是否还有---开始
      let getModelxx = this.data.getModelxx
      if (getModelxx) {
        let getShopModel = await requestCenter.getModel(getModelxx)
        let stock = getShopModel.stock //普通产品库存
        let promotionsDetails = getShopModel.promotionsDetails
        let buynum = this.data.buynum
        if (stock || stock == 0) {
          this.setData({
            stock: stock
          })
        }
        try {
          var jsonPromotionsDetails = JSON.parse(promotionsDetails)
        } catch (error) {
          var jsonPromotionsDetails = ''
          console.log('抛出异常', error)
        }
        if (jsonPromotionsDetails && jsonPromotionsDetails != 'null' && jsonPromotionsDetails[0] && jsonPromotionsDetails[0].surplus_stock || jsonPromotionsDetails && jsonPromotionsDetails[0].surplus_stock == 0) {
          this.setData({
            surplus_stock: jsonPromotionsDetails[0].surplus_stock
          })
          let surplus_stock = jsonPromotionsDetails[0].surplus_stock
          if ((surplus_stock || surplus_stock == 0) && buynum > surplus_stock) {
            app.showToastMessage('库存不足')
            reject('')
          }
        } else if ((stock || stock == 0) && buynum > stock) {
          app.showToastMessage('库存不足')
          reject('')
        }



        resove('')
      } else {
        let stock = this.data.stock
        let surplus_stock = this.data.surplus_stock
        if (surplus_stock) {
          if ((surplus_stock || surplus_stock == 0) && buynum > surplus_stock) {
            app.showToastMessage('库存不足')
            reject('')
          }
        } else if ((stock || stock == 0) && buynum > stock) {
          app.showToastMessage('库存不足')
          reject('')
        }
        resove('')
      }
      // 判断库存是否还有---结束
    })

  },

  quota() {
    return new Promise(async (resove, reject) => {
      let params = {
        productId: this.data.list.pid,
        quantity: this.data.buynum
      }
      let putLimitCounts = JSON.parse(await requestCenter.putLimitCounts(params))
      console.log(putLimitCounts)
      if (putLimitCounts.statusCode == 200) {
        app.showToastMessage(putLimitCounts.message)
        reject('')
      } else {
        resove('')
      }
    })
  },

  //判断购买次数是否达到了限制
  isCount: function () {
    var that = this
    return new Promise((resove, reject) => {
      // return false
      let dataCount = {}
      api.newget('/rest/tWebPromotionsControllerApi/saleCounts?skuId=' + that.data.xskuid + '&quantity=' + that.data.buynum + '&promotionsId=' + that.data.shoppromotionsId, '', 'PUT', function (e) {
        let message = JSON.parse(e.message)
        if (message.statusCode == 200) {
          wx.showToast({
            title: message.message,
            icon: 'none'
          })
          reject(message.message)

        } else {
          resove('')
        }
      })

    })
  },
  /**
   * 
   * 加入购物车
   * 
   */
  likebuy: async function () {
    let getmallItemSkuPropertiesList = this.data.getmallItemSkuPropertiesList
    let defaultproperties = this.data.defaultproperties
    let defaultpropertiesSplit = defaultproperties.split(';')
    let defaultpropertiesHide = this.data.defaultpropertiesHide
    let defaultpropertiesHideSplit = defaultpropertiesHide.split(';')
    let isNull = defaultpropertiesSplit.findIndex(obj => obj == '')
    if (isNull != -1) {
      let fun = function () {
        return new Promise((resove, reject) => {
          let array = []
          getmallItemSkuPropertiesList.forEach((v, k) => {
            let findIndex = defaultpropertiesSplit.findIndex(obj => obj.split(':')[0] == v.propId)
            array.push(findIndex)
          })
          resove(array)
        })
      }
      let funEnd = await fun()
      console.log(funEnd)
      let noPropId = funEnd.findIndex(obj => obj == -1)
      if (noPropId != -1) {
        app.showToastMessage('请选择' + getmallItemSkuPropertiesList[noPropId].pname)
        return false
      }
    }
    
    await this.isStock()
    console.log("likebuy", app.globalData.token)
    let quotaRes = await this.quota()
    let that = this;
    await app.obtaintoken()
    if (!app.globalData.token) {
      app.UserLoginToClick()
      return false
    }
    console.log(app.globalData.token)
    if (app.globalData.token == undefined) {
      that.setData({
        bottom: 'xia',
        shows: 'hidden'
      })
      let userinfoss = wx.getStorageSync('xuserixnfo')
      console.log(userinfoss)
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
      let dataput = {
        skuId: that.data.xskuid, //单品Id 
        quantity: that.data.buynum, //产品的数量
        productId: that.data.xshopmessage.pid, //产品id
        promotionId: that.data.shoppromotionsId,
        promotionsType: that.data.ordertype
      }
      api.xpost('/rest/memberCenter/saveOrUpdateCart', dataput, 'PUT', header, function (e) {
        console.log(e)
        if (e) {
          wx.hideLoading({
            success: (res) => {},
          })
          if (e.message == '未登录') {
            app.obtaintoken()
            that.data.likebuy
          } else {
            wx.showToast({
              title: '加入购物车成功',
              icon: 'none',
              duration: 1500
            })
          }
        }
      })

    }
  },


  onPopupTap: function (e) {
    let that = this
    let remark = e.currentTarget.dataset.remark
    if (remark) {
      that.setData({
        iosDialog22: true,
        remark: remark
      })
    }

  },

  // 关闭弹窗
  closes: function () {
    let that = this
    that.setData({
      iosDialog22: false
    })

  },


  /**
   * 
   * 跳转到购物车页面
   * 
   */
  jumpcart: function () {
    wx.navigateTo({
      url: '/pages/tab-cart/tab-cart',
    })
  },



  /**
   * 
   * 监听页面隐藏
   * 
   * 
   */
  onHide: function () {
    console.log('测试隐藏')
    clearTimeout()
    wx.hideLoading({
      success: (res) => {},
    })
  },


  //客服 或者 首页
  kefu: function () {
    this.setData({
      showBubble: !this.data.showBubble
    })
  },

  //拨打电话
  callPhne() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.callPhone,
    })
  },
  //跳转到客服页面
  customer() {
    wx.navigateTo({
      url: '/xpages/contact/contact',
    })
  },
  //图片加载完成
  imgload: function (e) {
    console.log(e)
    let ratio = 750 / wx.getSystemInfoSync().windowWidth
    //创建节点选择器
    var query = wx.createSelectorQuery()
    query.select('#img').boundingClientRect((res) => {
      console.log('test', res)
      this.setData({
        swiperHeight: Math.ceil((res.dataset.height) * ratio)
      })
    }).exec()

  },

  //定金支付
  Yupaygou: function () {
    var that = this;
    that.setData({
      ordertype: 5
    })
    that.bestbuymobile()
  },

  //产品预览
  chomeCarouselClick(e) {
    let arr = e.currentTarget.dataset.imgarr //获取当前点击的 图片 url
    let index = e.currentTarget.dataset.index
    let arrImgurl = []
    arr.forEach((v, k) => {
      arrImgurl.push(this.data.imgurl + v)
    })
    app.log('appImgurl', arrImgurl[index])
    // app.log('产品预览图',{arr:arr,index:index,url:this.data.imgurl+arr[index],imgurl:this.data.imgurl})
    wx.previewImage({
      current: arrImgurl[index], // 获取当前点击的 图片 url
      urls: arrImgurl //查看图片的数组
    })
  },

  //立即购买后的图片预览
  viewPicture(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    let urls = []
    urls.push(src)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls
    })
  },
  //拨打电话
  call(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  },

  //页面滑动事件
  pageScroll(e) {
    var scrollTop = parseInt(e.detail.scrollTop); //滚动条距离顶部高度
    var isSatisfy = scrollTop >= this.data.fixedTop ? true : false
    if (this.data.isFixed === isSatisfy) {
      return false;
    }
    this.setData({
      isFixed: isSatisfy
    })
  },
  //长按复制
  copy(e) {
    console.log(e, '长按复制')
    var text = e.currentTarget.dataset.message
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        });
      }
    })
  },
  //设计师详情
  DesignerDetails: function (e) {
    wx.navigateTo({
      url: '../allhouse_detail/allhouse_detail?id=' + e.currentTarget.dataset.id + "&newsClassId=121" + '&Popupornot=' + e.currentTarget.dataset.popupornot,
    })
  },

  //切换图片和视频
  chioceTap(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      chioceIndex: index
    })
  },

  //广告图点击事件
  adImgTap(event) {
    let index = event.currentTarget.dataset.index
    var newPageRote = new pageRote()
    let params = {
      eventType: 'brandBanner',
      position: index ? index : 0,
      source: this.data.wxBannerList
    }
    newPageRote.onAction(params)
  },

  //显示分享弹窗
  sharePoup() {
    this.setData({
      showShare: !this.data.showShare
    })
  },
  //获取时间
  getTime(e) {
    let time = e.detail.time
    if (!time) {
      this.data.endTimeHb = '00天00小时00分00秒'
    } else {
      this.data.endTimeHb = (time.days > 10 ? time.days : '0' + time.days) + '天' + (time.hours > 10 ? time.hours : '0' + time.hours) + '小时' + (time.minutes > 10 ? time.minutes : '0' + time.minutes) + '分' + (time.seconds > 10 ? time.seconds : '0' + time.seconds) + '秒'
    }
  },

  //生成海报
  async generatePoster() {
    this.setData({
      isShowLoding:true
    })
    let widget = this.selectComponent('.widget')
    let imagePathList = this.data.imagePathList
    if (!imagePathList) {
      app.showToastMessage('商品暂无图片，生成失败')
      return
    }
    let createQRCode = await requestCenter.getCreateQRCode({
      itemId: this.data.objectId,
      promotionsId:this.data.shoppromotionsId
    })
    var base64 = (createQRCode.QRCodeMSG).replace(/[\r\n]/g, "");
    const fs = wx.getFileSystemManager();
    var times = new Date().getTime();
    var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.jpg';
    fs.writeFile({
      filePath: codeimg,
      data: base64,
      encoding: 'base64',
      success: (res) => {
        console.log(res)
        console.log(codeimg)
      }
    });
    let srcData = {
      shopImg: this.data.imgurl + imagePathList[0],
      xsBg: this.data.ftpurl + '/plug-in/aykjmobile/images/bg_xsqg.png',
      price: this.data.one_price.toFixed(2),
      time: this.data.endTimeHb,
      productName: this.data.productName,
      qrcode: codeimg,
      qrIntro:this.data.xshopmessage.shareWords||'扫一扫了解更多内容，详情请咨询设计师，具体活动内容以门店当期活动案为准'
      // 
    }
    console.log(srcData)
    let wxmlData = wxml(srcData);
    let pageSize = {
      pageWidth: 750,
      pageHeight: 1340
    }
    let styleData = style(pageSize)
    const p1 = widget.renderToCanvas({
      wxml: wxmlData,
      style: styleData
    })
    p1.then((res) => {
      const p2 = widget.canvasToTempFilePath({
        fileType: 'png',
        quality: 1
      })
      p2.then(result => {
        console.log(result.tempFilePath)
        this.setData({
          isShowLoding: false
        })
        wx.navigateTo({
          url: '/xpages/poster-display/poster-display?imgUrl=' + result.tempFilePath,
        })
      })
     
    })
  },

  /**************************** 2023年5月23日产品sku弹窗重构 *************************/
  //产品切换弹窗:clickme，替代处理
  toShowSkuDialog(event) {
    // sourceAction: "skuSelect",
    // supportDeposit: false,//是否支持预付定金,
    // payType: "online",//支付方式，online：线上支付，offline：线下支付
    // orderType: 1,//1: 限时抢购    3: 样品特卖    取其他值按普通商品处理

    //请求这个接口的目的是为了获取最新的库存
    this.setData({
      isShowLoding: true
    })
    let params = this.data.getModelxx
    requestCenter.getModel(params || {})
      .then((res) => {
        this.setData({
          xshopmessage: res
        })

        let sourceAction = event.currentTarget.dataset.sourceAction || "skuSelect"
        let payType = (this.data.xshopmessage.onlineAndOffline && this.data.xshopmessage.onlineAndOffline != 2) ? "offline":"online"
        let orderType = this.data.ordertype

        let skuPropertiesList = (this.data.getmallItemSkuPropertiesList || [])
        let selectedSkuProperties = this.data.defaultproperties || ""

        let skuInfo = {
          sourceAction: sourceAction,
          payType: payType,
          orderType: orderType,
          supportDeposit: false,
          selectedSkuProperties: selectedSkuProperties,
          skuPropertiesList: skuPropertiesList,
          productDictionary: this.data.xshopmessage || {},
          Deposit: []
        }

        this.setData({
          showSkuDialog: true,
          skuShowInfo: skuInfo
        })
      })
      .finally(() => {
        this.setData({
          isShowLoding: false
        })
      })
  },
  

  onSkuChange: function(event) {
    console.log("onSkuChange", event)
    let skuSelectTips = event.detail.skuSelectTips || ""
    let skuProInfo = event.detail.skuProInfo || {}
    let selectedSkuProperties = event.detail.selectedSkuProperties
    let supportDeposit = event.detail.supportDeposit
    let depositModel = event.detail.depositModel

    this.setData({
      skuSelectTips: skuSelectTips,
      isYuPay: supportDeposit,
      defaultproperties: selectedSkuProperties
    })

    if(depositModel) {
      this.setData({
        shoppromotionsId: depositModel.promotionsPeriod || "",
      })
    }

    let one_price = 0
    let skuid = ""
    let stock = 0
    if(!skuProInfo.one_price) {
      one_price = skuProInfo.sale_price
      skuid = skuProInfo.product_sku
      stock = skuProInfo.stock
    } else {
      one_price = skuProInfo.one_price
      skuid = skuProInfo.id
      stock = skuProInfo.stock
    }

    if (this.data.ordertype == 1) {
      //限时抢购
      this.setData({
        limitCounts: skuProInfo.limit_counts,
        originalPrice: skuProInfo.one_price,
        surplus_stock: skuProInfo.surplus_stock,
        one_price: one_price,
        xskuid: skuid,
        defaultSku: skuProInfo
      })
    } else if(this.data.ordertype == 3) {
      //样品特卖
      this.setData({
        specialPrice: skuProInfo.specialprice,
        one_price: one_price,
        xskuid: skuid,
        defaultSku: skuProInfo
      })
    } else {
      this.setData({
        one_price: one_price,
        xskuid: skuid,
        defaultSku: skuProInfo
      }) 
    }
  },

  onSkuSelectedConfirm: function(event) {
    console.log("onSkuSelectedConfirm", event)
    let type = event.detail.type
    let buyNum = event.detail.buyNum

    let promise = null
    this.setData({
      isShowLoding: true
    })
    if(type == "buyNowWithOffline" || type == "buyNowWithOnline") {
      //立即购买
      promise = this.toBuyNow(buyNum)
    } else if(type == "addCart"){
      //加入购物车
      promise = this.toAddCart(buyNum)
    } else {
      //预付定金
      promise = this.toPayDeposit(buyNum)
    }
    promise.finally(() => {
      this.setData({
        isShowLoding: false
      })
    })
  },

  toAddCart: function(buyNum = 1) {
    let params = {
      skuId: this.data.xskuid, //单品Id 
      quantity: buyNum, //产品的数量
      productId: this.data.xshopmessage.pid, //产品id
      promotionId: this.data.shoppromotionsId,
      promotionsType: this.data.ordertype
    }
    console.log("toAddCart", params)
    return requestCenter.putSaveOrUpdateCart(params)
      .then(() => {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'none',
          duration: 1500
        })
        this.setData({
          showSkuDialog: false
        })
      })
  },

  toBuyNow: function(buyNum = 1) {
    let params = {
      ids: {
        skuId: this.data.xskuid,
        quantity: buyNum,
        itemId: this.data.xshopmessage.pid,
        newsClassId: 155,
        promotionsId: this.data.shoppromotionsId,
        orderType: this.data.ordertype
      },
      type: this.data.buyxtype,
      orderClassification: this.data.xshopmessage.onlineAndOffline||0
    }
    console.log("toBuyNow", params)
    return requestCenter.getNowBuy(params)
      .then((res) => {
        res = res || {}
        if (this.data.ordertype == 3) {
          res.originalPrice = this.data.originalPrice
        }
        
        this.setData({
          showSkuDialog: false
        })

        let timer = setTimeout(() => {
          wx.navigateTo({
            url: '../../xpages/orderattribute/orderattribute?data=' + encodeURIComponent(JSON.stringify(res)),
          })
          clearTimeout(timer)
        }, 500)
      })
  },

  toPayDeposit: function(buyNum = 1) {
    this.setData({
      ordertype: 5
    })
    return this.toBuyNow(buyNum)
  }
  /**************************** 2023年5月23日产品sku弹窗重构 *************************/
})