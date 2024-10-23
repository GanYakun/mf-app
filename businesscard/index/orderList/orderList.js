var app = getApp()
var api = require("../../../utils/api.js")
import requestCenter from "../../../http/request-center"



Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      name: '全部',
      selected: 1,
      orderStatus: ''
    }, {
      name: '待付款',
      selected: 0,
      orderStatus: 0
    }, {
      name: '已使用',
      selected: 0,
      orderStatus: 2
    }, {
      name: '已取消',
      selected: 0,
      orderStatus: 4
    }],
    current: 0,
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "22222")
    let that = this
    that.setData({
      orderStatus: options.orderStatus == 'undefined' ? '' : options.orderStatus,
      current: options.xindex
    })
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    console.log(scrollHeight)
    that.setData({
      scrollHeight: scrollHeight
    })
    that.getOrderLists(options.orderListType)
  },
  getOrderLists: function (res) {
    let that = this
    let data = {
      // orderStatus: that.data.orderStatus,
    }
    console.log(data)
    api.newget('/rest/memberCenter/getDepositOrderList?page=1&rows=12', data, 'POST', function (e) {
      if (e.code == 200) {
        that.setData({
          orderlist: e.data.results,
          imgurl: app.globalData.imgur,
          total:e.data.total
        })
      }

    })
  },

  // 取消订单
  onCancelOrderTap: function (e) {
    let that = this
    let data = {
      // orderId:e.currentTarget.dataset.id
    }
    api.newget('/rest/memberCenter/cancelDepositOrder?orderId=' + e.currentTarget.dataset.id, data, 'POST', function (e) {
      console.log(e)
      if (e.code == 200) {
        wx.showToast({
          title: e.message,
          icon: 'none'
        })
        that.getOrderLists()
      }

    })

  },

    // 导出我的下定订单的清单
  async exporOrder(e){
    let orderId = e.currentTarget.dataset.id
    api.newget('/rest/memberCenter/getDepositOrderProductListExport?orderId='+orderId,{},'POST',async (res)=>{
      if(res.code==500){
        wx.showToast({
          title: e.message,
          icon:'none'
        })
      }else if(res.code==200){
      let lookFile = await this.lookFile(res)
      if(lookFile){
        this.setData({
          isShowLoding:false
        })
      }else{
        this.setData({
          isShowLoding:false
        })
        wx.showToast({
          title: '导出失败',
          icon:'none'
        })
      }
      }
    })
    //   let params={
    //     orderId:e.currentTarget.dataset.id
    //   }
    // let exportOrder = await requestCenter.getDepositOrderProductListExport(params)
    // app.log('导出我的下定订单的清单 exportOrder',exportOrder)
    // let lookFile = await this.lookFile(res)
    //   if(!lookFile){
    //     wx.showToast({
    //       title: '导出失败',
    //       icon:'none'
    //     })
    //   }

  },
   //下载文件并查看
   lookFile(res){
    return new Promise((resove,reject)=>{
      // const fileExtName = ".pdf";
      // const randfile = this.randomString(32) + new Date().getTime() + fileExtName;
      // const newPath = `${wx.env.USER_DATA_PATH}/${randfile}`;
      var newPath = wx.env.USER_DATA_PATH + new Date().getTime()+ '.xls'
      wx.downloadFile({
        url: app.globalData.upurl+'/'+res.message, //仅为示例，并非真实的资源
        filePath: wx.env.USER_DATA_PATH + '/' + new Date().valueOf() + '.xls', 
        success (res) {
          console.log(res)
          if (res.statusCode === 200) {
            resove('true')
            wx.openDocument({
              // filePath: res.tempFilePath,
              filePath:res.filePath,
              showMenu:true,
              fileType:'xls',
              success: function (res) {
                console.log('打开文档成功')
              },fail(){
                wx.showToast({
                  title: '导出失败',
                  icon:'none'
                })
              }
            })
          }else{
            resove(false)
          }
        }
      })
    })
   
  },
  onChangeTab: function (event) {
    console.log(12)
    let that = this
    let index = event.currentTarget.dataset.index;
    that.setData({
      current: index,
      orderStatus: event.currentTarget.dataset.orderstatus,
      scrollTop:0
    })
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
    // that.getOrderLists()
  },

  /**
   * 
   * 去付款
   * 
   * 
   */
  gouby: function (e) {
    var ordernum = e.currentTarget.dataset.ordernum
    var prices = e.currentTarget.dataset.prices
    // wx.showLoading({
    //   title: '加载中',
    // })
    let that = this;
    //判断
    let header = {
      'content-type': 'application/json',
      'X-AUTH-TOKEN': app.globalData.token
    }

    console.log(e)

    let data1 = {

    }
    let data11 = JSON.stringify(data1)
    wx.login({
      success(res) {
        var codes = res.code
        //微信支付接口返回的数据
        api.xpost('/rest/payApi/xcxPay?code=' + codes + '&orderNum=' + ordernum, data11, 'POST', header, function (e) {
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
                success: (res) => {},
              })
              if (res.errMsg == "requestPayment:ok") {
               wx.showToast({
                 title: '支付成功',
                 icon:'none'
               })
              
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
                success: (res) => {},
              })

            }
          })
        })
      }
    })



  },

  //长按复制订单号
  longcopy: function (e) {
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
    console.log(that.data.total/((start-1)*12))
    console.log((start*12))
    if(that.data.total/((start-1)*12)<1){
      wx.showToast({
        title: '暂无数据',
        icon:'none'
      })
      return false;
    }
    api.newget('/rest/memberCenter/getDepositOrderList?page='+start+'&rows='+12, {}, 'POST', function (e) {
      if (e.code == 200) {
        that.setData({
          orderlist: that.data.orderlist.concat(e.data.results),
          imgurl: app.globalData.imgur,
          PageStart:start
        })
      }

    })
  },

  commot:function(e){
    let index = e.currentTarget.dataset.index
    let orderlist = this.data.orderlist[index]
    wx.navigateTo({
      url: orderlist.xcxViewPage+'?newsClassId='+orderlist.newsclassId+'&objectId='+orderlist.orderDepositId,
    })
  }


})