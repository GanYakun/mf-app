// order/order_detail/order_detail.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.imgur,
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,  //顶部导航栏的高度
    yesMore:false   //  控制显示五条的元素
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that= this
    let tokens = app.globalData.token
    that.setData({
      orderType:options.orderType,
      orderId:options.id,
    })
    let data ={
      orderId:options.id,
    }
    
  
      api.newget('/rest/memberCenter/getOrderDetailsList',data,'GET', (e)=> {
        // 判断订单状态，用来判断底部的高度
        if(e.data.orderStatus == 10){
          this.setData({
            botViewHieght:71  //71为最底部固定的高度，根据设计图算出的高度
          })
        }else if(e.data.orderStatus == 5 ||e.data.orderStatus == 7 || e.data.orderStatus ==8 || e.data.orderStatus == 2){
          this.setData({
            botViewHieght:0  //底部无任何按钮
          })
        }
        else{
          this.setData({
            botViewHieght:100  //100为最底部固定的高度，根据设计图算出的高度
          })
        }
        that.setData({
          list:e.data
        })
        var PageWriteOffQuantity = 0
        var PageProductCounts = 0
        console.log(e.data.orderDetailsList)
        let arr = e.data.orderDetailsList
        arr.forEach((v,k)=>{
          if(v.writeOff){
            PageWriteOffQuantity = PageWriteOffQuantity+parseInt(v.writeOffQuantity) 
          }
          if(v.productCounts){
              PageProductCounts = PageProductCounts + parseInt(v.productCounts)

          }
          if(k+1 == e.data.orderDetailsList.length){
            that.setData({
              PageWriteOffQuantity:PageWriteOffQuantity,
              PageProductCounts:PageProductCounts
            })
          }
        })
        // if(e.code == 200){
        //  that.setData({
        //    orderlist:e.data.list
        //   })
        // }else{
        //   wx.showToast({
        //     title: e.message,
        //   })
        // }
      })

  },

  onShow(){
    let isadd = this.data.isadd
    if(isadd==1){
     this.addListFun()
    }
  },

  // 刷新列表
  Refresh:function(){
    let that = this
    let data ={
      orderId:that.data.orderId,
    }
    
  
      api.newget('/rest/memberCenter/getOrderDetailsList',data,'GET',function (e) {
        console.log(e)
        that.setData({
          list:e.data
        })
        var PageWriteOffQuantity = 0
        var PageProductCounts = 0
        console.log(e.data.orderDetailsList)
        let arr = e.data.orderDetailsList
        arr.forEach((v,k)=>{
          if(v.writeOff){
            PageWriteOffQuantity = PageWriteOffQuantity+parseInt(v.writeOffQuantity) 
          }
          if(v.productCounts){
              PageProductCounts = PageProductCounts + parseInt(v.productCounts)

          }
          if(k+1 == e.data.orderDetailsList.length){
            that.setData({
              PageWriteOffQuantity:PageWriteOffQuantity,
              PageProductCounts:PageProductCounts
            })
          }
        })
        // if(e.code == 200){
        //  that.setData({
        //    orderlist:e.data.list
        //   })
        // }else{
        //   wx.showToast({
        //     title: e.message,
        //   })
        // }
      })
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
                      }
                    },
                    "fail": function (res) {
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '支付失败',
                          icon:'none'
                        })
                        that.Refresh()
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


      //取消订单
  onCancelOrderTap: function (e) {
    let that = this
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
        that.Refresh()
      }

    })

  },

  //导出清单功能
  exportManifest(e){
    let id = e.currentTarget.dataset.id
   api.newget('/rest/memberCenter/getOrderDetailsListExport2?orderId='+id,{},'POST',async (res)=>{
    if(res.code == 200){
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
  //获取所有地址
    addListFun(){
      api.newget('/rest/memberCenter/myShippingAdress', {}, 'GET', (e)=> {
        this.setData({
          addList: e.data
        })
      })
    },
    //修改地址
  updateAddress(e){
   
    if(this.data.list.orderStatus !=1){
      return false
    }
    this.addListFun()
      
    if(e.detail.id){
      api.newget('/rest/memberCenter/updateOrderAddress?orderId='+this.data.list.id+'&addressId='+e.detail.id,{},'POST', (res)=> {
        wx.showToast({
          title: res.message,
          icon:'none',
        })
        let data ={orderId:this.data.orderId,}
          api.newget('/rest/memberCenter/getOrderDetailsList',data,'GET', (e)=> {
            this.setData({
              ['list.consignee']:e.data.consignee,
              ['list.consigneeTelephone']:e.data.consigneeTelephone,
              ['list.orderStatus']:e.data.orderStatus,
              ['list.provinceCityCounty']:e.data.provinceCityCounty,
              ['list.detailAddress']:e.data.detailAddress,
              ['list.addressAlias']:e.data.addressAlias
            })
          })
    })
  }
    this.setData({
      showAddressPoup:!this.data.showAddressPoup
    })
    return false
    
  },

    //关闭修改地址的弹窗
  close(e){
    this.setData({
      showAddressPoup:!this.data.showAddressPoup
    })
  },

  //查看更多订单
  lookMore(){
    this.setData({
      yesMore:true
    })
  },

  //跳转到商品详情页面
  toShop(e){
    wx.navigateTo({
      url: '/xpages/shop/shop' + '?newsClassId=' + 155 + '&NeworderType=' + 0 + '&objectId=' + e.currentTarget.dataset.id + '&categoryId=' + 155
      //categoryId只限产品部分，筛选时候用得倒，可能是cid
    })
  }
})