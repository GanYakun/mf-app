var app = getApp()

var api = require("../../utils/api.js")
import requestCenter  from "../../http/request-center"



Page({

  /**
   * 页面的初始数据
   */
  data: {
    valueName: '请选择',
    qcappnoshare:true, //页面设置这个表示不分享
    isclick: 0,
    selected: 0,
    click: 0,
    imgsr: app.globalData.links,
    tabList: [{
      name: '全部',
      selected: 1,
      orderStatus: ''
    },
    {
      name: '产品线上支付',
      selected: '',
      orderStatus: '',
      orderClassification:0
    },
    {
      name: '产品线下支付',
      selected: 0,
      orderStatus: 10,
      orderClassification:1
    },
    {
      name: '服务线上支付',
      selected: 0,
      orderStatus: 10,
      orderClassification:2
    },
    //  {
    //   name: '待付款',
    //   selected: 0,
    //   orderStatus: 1
    // }, {
    //   name: '待发货',
    //   selected: 0,
    //   orderStatus: 0
    // }, {
    //   name: '待收货',
    //   selected: 0,
    //   orderStatus: 8
    // },
    //  {
    //   name: '待评价',
    //   selected: 0,
    //   orderStatus: 2
    // },
  ],
    typeLists: [
      '请选择',
      '退货',
      '换货',
    ],
    current: 0,
    setTime:null,
    imgarr: [],
    imagePath: [],
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options, "22222")
    let that = this
    that.setData({
      // orderStatus: options.orderStatus == 'undefined' ? '' : options.orderStatus,
      current: options.xindex,
      orderClassification:options.xindex-1==-1?'':options.xindex-1
    })
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    console.log(scrollHeight)
    that.setData({
      scrollHeight: scrollHeight
    })
    that.getOrderLists(options.orderListType)
    let params = {
      typegroupCode:'web_returns_type'
    }
    let getDataDictionary = await requestCenter.getDataDictionary(params)
    console.log(getDataDictionary)
    this.setData({
      thTypeArr:getDataDictionary
    })
  },



  getOrderLists: function (res) {

      let that = this
      let data = {
        // orderStatus: that.data.orderStatus
        orderStatus: '',
        orderClassification:this.data.orderClassification
      }
      console.log(data)
      api.newget('/rest/memberCenter/getOrderList?start=1' + "&pageSize=12", data, 'POST', function (e) {
        if (e.code == 200) {
          that.setData({
            orderlist: e.data.list,
            imgurl: app.globalData.imgur,
            maxStart:e.data.maxStart,
            PageStart:1
          })
        }

      })
  
   
  },
  // 订单详情
  onOrderDetailTap: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../order/order_detail/order_detail?id=' + e.currentTarget.dataset.id + '&orderType=' + e.currentTarget.dataset.ordertype
    })

  },
  // 支付
  pay: function () {
    wx.navigateTo({
      url: '/pages/settlement/settlement',
    })
  },
  // 取消订单
  onCancelOrderTap: function (e) {
    let that = this
    let tokens = app.globalData.token
    let data = {
      id: e.currentTarget.dataset.id,
      orderStatus: e.currentTarget.dataset.orderstatus
    }
    // api.xpost('/rest/memberCenter/doUpdateOrder?id=' + e.currentTarget.dataset.id + "&orderStatus=" + e.currentTarget.dataset.orderstatus ,data,'PUT', header,function (e) {
    api.newget('/rest/memberCenter/doUpdateOrder', data, 'PUT', function (e) {
      console.log(e)
      if (e.code == 200) {
        wx.showToast({
          title: e.message,
          icon:'none'
        })
        that.getOrderLists()
      }

    })

  },
 
  // 删除图片
  onDeleteTap(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(e.currentTarget.dataset.index)
    let imgarr = that.data.imgarr
    imgarr.splice(index, 1)
    that.setData({
      imgarr: that.data.imgarr
    })
  },
  
  onChangeTab: function (event) {
    console.log(12)
    let that = this
    let index = event.currentTarget.dataset.index;
    that.setData({
      current: index,
      orderStatus: event.currentTarget.dataset.orderstatus,
      orderClassification:this.data.tabList[index].orderClassification||this.data.tabList[index].orderClassification==0?this.data.tabList[index].orderClassification:'',
      scroolTop:0
    })
    // that.getOrderLists()
  },
  tabChange: function (e) {
    console.log(e)
    let that = this
    let indexs = parseInt(e.detail.current)
    console.log(indexs)
    console.log(that.data.tabList[indexs].orderStatus)
    that.setData({
      current: e.detail.current,
      orderStatus: that.data.tabList[indexs].orderStatus
    })
    that.getOrderLists()
  },
  //查看物流
  logistics: function (e) {
    wx.navigateTo({
      url: '../logistics/logistics',
    })
  },
  //退换货申请
  onApplyTap: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.click)
    let id = e.currentTarget.dataset.id
    that.setData({
      click: e.currentTarget.dataset.click,
      ordernum: e.currentTarget.dataset.ordernum,
      returnGoodId:id
    })
  },
  // 关闭弹窗
  screenEd: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.click)
    that.setData({
      click: e.currentTarget.dataset.click
    })
  },
  // 选择
  onTypeTap: function () {
    let that = this
    var isclick = that.data.isclick
    that.setData({
      isclick: !isclick
    })
  },
  // 退换货理由
  reason: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      reason: e.detail.value
    })
  },
  // 选择类型
  onSelectTap: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let thTypeArr = this.data.thTypeArr
    console.log(e.currentTarget.dataset.index)
    that.setData({
      selected: e.currentTarget.dataset.index,
      isclick: false,
      value: e.currentTarget.dataset.value,
      valueName:thTypeArr[index].typename
    })

  },
  // 选择图片
  chooseImage: function () {
    let that = this
    let imgarr = that.data.imgarr
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        // console.log(res)
        // // tempFilePath可以作为img标签的src属性显示图片
        imgarr.push(res.tempFilePaths)
        that.setData({
          imgarr: imgarr
        })
        wx.uploadFile({
          url: 'http://mf.100good.cn/rest/memberCenter/imageUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart/form-data",
            'X-AUTH-TOKEN': app.globalData.token
          },
          formData: {
            "user": "test",
          },
          success(res) {
            console.log('77777' + res.data)
            let imagePath = that.data.imagePath
            imagePath.push(res.data)
            let imagesPath = imagePath.join(",")
            that.setData({
              imagesPath: imagesPath
            })
            console.log(imagesPath)
          }
        })


      }
    })

  },
  // 确定提交
  submit: function (e) {
    let that = this
    let click= that.data.click
    let orderNum = that.data.ordernum
    let type = that.data.value
    let reason = that.data.reason
    let imagePath = that.data.imagesPath
    let tokens = app.globalData.token
    if (orderNum == null || type == null || type=='请选择' || reason == null) {
      wx.showToast({
        title: '请填写完整信息！',
        icon:'none'
      })
      return
    }
    let data = {
      orderNum: orderNum,
      type: type,
      imagePath: imagePath,
      reason: reason,
      orderId:this.data.returnGoodId||''
    }
    console.log(data)
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': tokens
    }
    api.xpost('/rest/tWebProductReturnControllerApi/addOrUpdateProductReturn', data, 'PUT', header, function (e) {
      console.log(e)
      if (e.code == 200) {
        wx.showToast({
          title: '退换货成功',
          icon:'none'
        })
        
        // clearTimeout(that.data.setTime)
        //   that.data.setTime = setTimeout(() => {
        //     let click = that.data.click
            
        //   }, 1500)

      } else {
        wx.showToast({
          title: '退货失败',
          icon: 'none'
        })
      }

    })
    that.setData({
      click:e.currentTarget.dataset.click
    })
    that.getOrderLists()
  },

  /**
   * 
   * 去付款
   * 
   * 
   */
  gouby:function(e){
var ordernum = e.currentTarget.dataset.ordernum
var prices = e.currentTarget.dataset.prices
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
      console.log(e)
        let data1 = {

        }
        let data11 = JSON.stringify(data1)
        wx.login({
          success(res) {
            var codes = res.code
            //微信支付接口返回的数据
            api.newget('/rest/payApi/xcxPay?code=' + codes + '&orderNum=' + ordernum, data11, 'POST', function (e) {
              console.log(e)
              wx.requestPayment({
                'timeStamp': e.data.timeStamp,
                'nonceStr': e.data.nonceStr,
                'package': e.data.weixinPackage,
                'signType': 'MD5',
                'paySign': e.data.sign,
                "success": function (res) {
                  console.log(res)
                  wx.hideLoading({
                    success: (res) => { },
                  })
                  if (res.errMsg == "requestPayment:ok") {
                    wx.showToast({
                      title: '支付成功',
                      icon:'none'
                    })
                    that.getOrderLists()
                  }
                },
                "fail": function (res) {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                      title: '支付失败',
                      icon:'none'
                    })
                    
                  }
                  wx.hideLoading({
                    success: (res) => { },
                  })

                }
              })
            })
          }
        })

      

  },

  lookqrc:function(e){
    console.log(e)
    this.setData({
      iosDialog2:true,
qrcurl:e.currentTarget.dataset.qrcurl
    })
  },

  /**
   * 
   * 关闭二维码弹窗
   * 
   */
  close:function(){
    this.setData({
      iosDialog2:false
    })
  },

  //长按复制订单号
  longcopy:function(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
       console.log('复制成功')
      }
  })
  },

   //滑动加载订单
   solidLower:function(){
    let that = this
    let start = that.data.PageStart?that.data.PageStart+1:2
    if(start>that.data.maxStart){
      wx.showToast({
        title: '暂无数据',
        icon:'none'
      })
      return false;
    }
    let data = {
      // orderStatus:that.data.orderStatus
      orderStatus: '',
      orderClassification:this.data.orderClassification
    }
    api.newget('/rest/memberCenter/getOrderList?start='+start+'&pageSize='+12, data, 'POST', function (e) {
      if (e.code == 200) {
        that.setData({
          orderlist: that.data.orderlist.concat(e.data.list),
          imgurl: app.globalData.imgur,
          PageStart:start
        })
      }

    })
  },

  //去评价
  goPinjia(e){
    wx.navigateTo({
      url: '/order/evaluate/evaluate?orderNum='+e.currentTarget.dataset.ordernum,
    })
  }



})