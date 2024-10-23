var api = require('../../utils/api.js')
var app = getApp()
import requestCenter from "../../http/request-center"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    settlement: 0, //去结算的价格
    isall: false, //全选的判断元素
    gouwuchelist: [],
    alllistnumber: 0,
    cids: '',
    isReselectShow: false,
    cartType:0,
    activiteId: [], //活动id数组
    qcappnoshare:true //不分享该页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let ratio = 750 / wx.getSystemInfoSync().windowWidth;
    let scrollHeight = Math.ceil(wx.getSystemInfoSync().windowHeight * ratio);
    this.setData({
      imgur: app.globalData.imgur,
      pageWindowHeight: scrollHeight,
      tabIndexHeight: app.globalData.tabIndexHeight
    })
    if (options.status == 1) {
      console.log("3333")
      setTimeout(() => {
        wx.showToast({
          title: '成功',
          icon: 'none',
          duration: 2000
        })
      }, 1000);

    }
   
  },

  




  /**
   * 
   * 
   * 单选
   * 
   */
  chioceshop: function (e) {
    let that = this;
    let indexs = e.currentTarget.dataset.index
    let arr = this.data.gouwuchelist
    if (arr[indexs].ischioce == undefined) {
      let lista = 'gouwuchelist[' + indexs + '].ischioce'
      that.setData({
        [lista]: true
      })
    } else {
      let lists = 'gouwuchelist[' + indexs + '].ischioce'
      that.setData({
        [lists]: !arr[indexs].ischioce
      })
    }
    if (arr[indexs].ischioce) {
      var settlements = (that.data.settlement + (arr[indexs].onePrice * arr[indexs].quantity)).toFixed(2)
      console.log(settlements)
      var alllistnumberss = that.data.alllistnumber + arr[indexs].quantity
    } else {
      var settlements = (this.data.settlement - (arr[indexs].onePrice * arr[indexs].quantity)).toFixed(2)
      var alllistnumberss = that.data.alllistnumber - arr[indexs].quantity
    }
    if (alllistnumberss == this.data.shoppingCartLen) {
      that.setData({
        isall: true
      })
    } else {
      that.setData({
        isall: false
      })
    }
    this.setData({
      settlement: parseFloat(settlements),
      alllistnumber: alllistnumberss
    })
  },

  //全选
  allchioce: function () {
   this.setData({
    isShowLoding:true
   })
    let that = this
    let arr = that.data.gouwuchelist
    if (!that.data.isall) {
      that.setData({
        settlement: 0,

      })
      arr.forEach(function (v, k) {
        if (v.ischioce == undefined) {
          var gaibian = 'gouwuchelist[' + k + '].ischioce'
          that.setData({
            [gaibian]: true
          })
        } else {
          if (v.ischioce) {

          } else {
            let gaibian = 'gouwuchelist[' + k + '].ischioce'
            that.setData({
              [gaibian]: true
            })
          }
        }
        var settlements = parseFloat((that.data.settlement + (v.onePrice * v.quantity)).toFixed(2))
        that.setData({
          settlement: settlements
        })
      })
      that.setData({
        isall: true,
        alllistnumber:that.data.shoppingCartLen
      })
      wx.hideLoading({
        success: (res) => {},
      })
    } else {
      arr.forEach(function (v, k) {
        let gaibian = 'gouwuchelist[' + k + '].ischioce'
        that.setData({
          [gaibian]: false
        })
      })
      that.setData({
        isall: false,
        settlement: 0,
        alllistnumber: 0
      })
      
    }
    this.setData({
      isShowLoding:false
    })
  },

  // 加
  jia: async function (e) {
    let that = this
    var indexs = e.currentTarget.dataset.index
    let arr = that.data.gouwuchelist
    let productId = arr[indexs].productId
    let quantity = arr[indexs].quantity+1
    await this.quota(productId,quantity)
    let data = {
      // id:that.data.gouwuchelist[indexs].id,
      skuId: that.data.gouwuchelist[indexs].skuId,
      quantity: 1,
    }
    let Savecart = await that.saveOrUpdateCart(data)
    let shopnums = 'gouwuchelist[' + indexs + '].quantity'
    console.log(arr[indexs].quantity + 1, 'shopnums')
    that.setData({
      [shopnums]: arr[indexs].quantity + 1,
    })
    console.log(arr, 'arr')
    if (arr[indexs].ischioce) {
      let settlementsa = parseFloat((arr[indexs].onePrice * (arr[indexs].quantity - 1)).toFixed(2))
      let settlements = that.data.settlement
      console.log(settlementsa)
      console.log(settlements)
      let price = arr[indexs].onePrice
      let zuizhongprice = parseFloat(settlements) + parseFloat(price.toFixed(2))
      console.log(zuizhongprice)
      that.setData({
        settlement: parseFloat(zuizhongprice.toFixed(2)),
        alllistnumber:this.data.alllistnumber+1
      })
    } else {
      
    }


  },


  //减
  jian: async function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let arr = that.data.gouwuchelist
    if (arr[indexs].quantity == 1) {

    } else {
      let data = {
        // id:that.data.gouwuchelist[indexs].id,
        skuId: that.data.gouwuchelist[indexs].skuId,
        quantity: -1,
      }
      let Savecart = await that.saveOrUpdateCart(data)
      let shopnums = 'gouwuchelist[' + indexs + '].quantity'
      that.setData({
        [shopnums]: arr[indexs].quantity - 1,
      })
      if (arr[indexs].ischioce) {
        let settlements = that.data.settlement
        console.log(settlements)
        let price = arr[indexs].onePrice
        let zuizhongprice = parseFloat(settlements) - parseFloat(price.toFixed(2))
        console.log(zuizhongprice)
        that.setData({
          settlement: parseFloat(zuizhongprice.toFixed(2)),
          alllistnumber:this.data.alllistnumber-1
        })
      } else {

      }
    }

  },

  // 购物车更新
  saveOrUpdateCart: function (e) {
    return new Promise((resove, reject) => {
      api.newget('/rest/memberCenter/saveOrUpdateCart', e, 'PUT', function (e) {
        if (e) {
          resove('ok')
        } else {
          wx.showToast({
            title: '购物车更新失败！请稍后再试',
            icon: 'none'
          })
        }
      })
    })

  },

  // 删除
  deleteshop: function (e) {
    let that = this;
    if (app.globalData.token == undefined) {
      wx.hideLoading({
        success: (res) => {},
      })
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
      let tokens = app.globalData.token
      var header = {
        'content-type': 'application/json',
        'X-AUTH-TOKEN': tokens
      }
      let data = {

      }
      var indexs = e.currentTarget.dataset.index
      api.xpost('/rest/memberCenter/doDelShoppingCart?cartId=' + e.currentTarget.dataset.id, data, 'DELETE', header, function (e) {
        console.log(e)
        if (e.code == 200) {
          let arr = that.data.gouwuchelist
          if (arr[indexs].ischioce) {
            that.setData({
              settlement: parseFloat((that.data.settlement - parseFloat((arr[indexs].quantity * arr[indexs].onePrice).toFixed(2)).toFixed(2)))
            })
          }
          arr.splice(indexs, 1)
          that.setData({
            gouwuchelist: arr
          })
          wx.showToast({
            title: e.message,
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 1500
          })
        } else {
          console.log(e)
        }
      })
    }


  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(() => {
      this.tabList()
      this.setData({
        cartType:0
      })
    }, 1500);
  },

  //查询购物车列表
  tabList(type){
    let that = this;
    that.setData({
      settlement: 0,
      isall: false, //全选的判断元素
      alllistnumber:0,
    })
      //查询购物车列表
      api.newget('/rest/memberCenter/getShoppingCartList?type='+(type?type:0), {}, 'POST', function (e) {
         var shoppingCartLen = 0
          e.data.forEach((v,k)=>{
            if(v.quantity){
              shoppingCartLen = shoppingCartLen + v.quantity
            }
          })
            that.setData({
              gouwuchelist: e.data,
              shoppingCartLen:shoppingCartLen
            })
      })
  },

  //支付
  settlement: async function (e) {
    let that = this;
    let params = e.currentTarget.dataset.params
    that.setData({
      cids: '',
      activiteId: [],
      activiteType: []
    })
    //线下支付
    if(params == 'offlinePayment'){
      that.data.gouwuchelist.forEach(function (v, k) {
        if (v.ischioce) {
          that.data.activiteId.push(v.promotionId)
          that.data.activiteType.push(v.promotionsType)
          console.log(that.data.activiteType)
          that.setData({
            cids: that.data.cids.concat(v.id + ','),
          })
        }
      })
    }
    //线上支付
    else{
      let settlementSon = await this.settlementPromise()
      if (!settlementSon) {
        this.setData({
          isReselectShow: true
        })
        return false
      }
    }
    
    let basic = that.data.cids
    if (basic == '') {
      wx.showToast({
        title: '未选择商品',
        icon: 'none', //如果要纯文本，不要icon，将值设为'none'
        duration: 1500
      })
    } else {
      let xids = basic.substring(0, basic.lastIndexOf(','));
      console.log(xids)
      let extendData = {}
      extendData['cartId'] = xids;
      let data = {
        type: '2',
        ids: JSON.stringify(extendData),
        orderClassification:this.data.cartType||0

      }
      api.newget('/rest/memberCenter/nowBuy', data, 'GET', function (e) {
        console.log(e)
        let arr = JSON.stringify(e.data)
        if (e.code == 200) {
          let pageParams = {
            activiteId: that.data.activiteId,
            activiteType: that.data.activiteType
          }
          wx.navigateTo({
            url: '../../xpages/orderattribute/orderattribute?data=' + encodeURIComponent(arr) + '&pageParams=' + encodeURIComponent(JSON.stringify(pageParams))+'&addorderType='+params,
          })
        }
      })
    }

  },

  //支付的Promise函数
  settlementPromise: function () {
    return new Promise((resove, reject) => {
      this.data.gouwuchelist.forEach((v, k) => {
        console.log("settlementPromise", v)
        if (v.ischioce) {
            //判断是否是线下产品
          if(v.onlineAndOffline == 1){
            resove(false)
          }else{
            this.setData({
              cids: this.data.cids.concat(v.id + ','),
            })
          }
      }
      })
      resove(true)
    }).catch((res) => {
      console.log(res)
    })


  },


  //点击后展开加减按钮关闭其他加减按钮
  NumClick: function (e) {
    let index = e.currentTarget.dataset.index
    let upindex = this.data.upindex
    if (upindex || upindex == 0) {
      let setvalue = 'gouwuchelist[' + upindex + '].NumClick'
      this.setData({
        [setvalue]: false
      })
    }
    let setvalue = 'gouwuchelist[' + index + '].NumClick'
    this.setData({
      [setvalue]: true,
      isOtherShopnumClose: false,
      upindex: index
    })
  },

  scroll: function () {
    this.setData({
      isOtherShopnumClose: true,
    })
  },

  //点击商品跳转
  ProductDetails: function (e) {
    wx.navigateTo({
      url: '/xpages/shop/shop' + '?newsClassId=' + 155 + '&NeworderType=' + 0 + '&objectId=' + e.currentTarget.dataset.id + '&categoryId=' + 155
      //categoryId只限产品部分，筛选时候用得倒，可能是cid
    })
  },

  //重新选择
  reselect: function () {
    this.setData({
      isReselectShow: false
    })
  },
  //判断是否达到限制
  quota(productId,quantity){
    return new Promise(async (resove,reject)=>{
      let params = {
        productId:productId,
        quantity:quantity
      }
      let putLimitCounts = JSON.parse(await requestCenter.putLimitCounts(params))
      console.log(putLimitCounts)
      if(putLimitCounts.statusCode==200){
        app.showToastMessage(putLimitCounts.message)
        reject('')
      }else{
        resove('')
      }
    })
  },

  //购物车列表筛选
  listScreen(e){
    let type = e.target.dataset.type
    if(!type&&type!==0){
      return 
    }
    this.setData({
      cartType:type
    })
    this.tabList(type)
  }
})