var app = getApp()
import tool from "../../utils/FunctionThrottling.js"
const api = require("../../utils/api.js")

/* 

  小程序页面底部导航
  导航分为可购买产品和非购买作品2种导航；购买导航是分享，资讯，收藏，加入购物车，立即购买；非购买导航是收藏，咨询，分享，预约设计
  isBuyShop   判断是否详情页的tab是否有有购买商品
              1为是购买导航
              2为不是购买导航也不是普通导航
              3是绝配组合案例详情页面的导航
              为其他数值时则是普通导航
  caseMessage: {
        isCollect: e.data.isCollect,  //是否收藏
        collectionId: e.data.id,      //案例id
        collectionType: 'successfulCase', //收藏的类型 用于区分收藏的是案例还是效果图还是产品
        newsClassId: that.data.newsClassId,  //类目id
        caseIndex:caseIndex               //定制家具的案例下标
    }

     clicktabType=====>   my  为我的
                          index  为首页
                          customer  为客服

    clicktab为0时选中首页

*/
Component({
  options:{
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    clicktabType: {
      type: String,
      value: ''
    },
    isBuyShop: {
      //判断是否存在分享
      type: Number,
      value: 0,
      observer:function(newVal,oldVal){
        this.setData({
          _isBuyShop:newVal
        })
        if(newVal == 2 ){
          app.globalData.tabIndexHeight = 108
        }
      }
    },
    isShare: {
      //判断是否存在分享
      type: Boolean,
      value: false,
    },
    caseMessage: {
      //用于收藏案例
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        app.log('caseMessage',newVal)
        this.setData({
          _caseMessage: newVal,
        })
        if(newVal&&newVal.type===3){
          // 3是精选组合页面
          this.setData({
            ['tabArr3[1].isCollect']:newVal.isCollect
          })
        }
        try{
          this.setData({
            ['tabArr2[1].isCollect']:newVal.isCollect
          })
        }catch{
          app.log('xpages/checklist/checklist','抛出异常')
        }
      }
    }
  },
  lifetimes:{
    attached:function(){
     
    }
},

  
  data: {
    tabArr2:[{
      name:'客服',
      selectImage:'',
      image:'/images/tab-nav-image/black_kefu.png',
      type:'customer',
    },{
      name:'收藏',
      selectImage:'/images/tab-nav-image/ic_collection.png',
      image:'/images/tab-nav-image/ic_nocollection.png',
      type:'collection2',
    }, {
      name:'分享',
      selectImage:'',
      image:'/images/tab-nav-image/share.png',
      type:'share'
    },
    {
      name:'免费设计/报价',
      selectImage:'',
      image:'/images/tab-nav-image/ic_design1.png',
      type:'design',
    }],

    tabArr:[{
      name:'首页',
      selectImage:'/images/tab_new_house_checked.png',
      image:'/images/tab_index_normal.png',
      type:'index',
      showBubble:false,
    },
    {
      name:'产品',
      selectImage:'/images/tab_new_house.png',
      image:'/images/tab_old_house.png',
      type:'classification'
    },
    // {
    //   name:'客服',
    //   selectImage:'/images/tab-nav-image/select_kefu.png',
    //   image:'/images/tab-nav-image/noselect_kefu.png',
    //   type:'customer'
    // },
  
    
    {
      name:'免费设计',
      selectImage:'',
      image:'/images/tab-nav-image/ic_design1.png',
      type:'design'
    },
    // {
    //   name:'购物车',
    //   selectImage:'/images/tab_new_cart.png',
    //   image:'/images/tab_old_cart.png',
    //   type:'cart'
    // },
     {
      name:'客服',
      selectImage:'/images/tab-nav-image/select_kefu.png',
      image:'/images/tab-nav-image/noselect_kefu.png',
      type:'customer'
    },
    
    {
      name:'我的',
      selectImage:'/images/tab_renting_house_checked.png',
      image:'/images/tab_renting_house.png',
      type:'my'
    },
   
  ],

  tabArr3:[{
    name:'客服',
    selectImage:'',
    image:'/images/tab-nav-image/black_kefu.png',
    type:'customer',
  },{
    name:'收藏',
    selectImage:'/images/tab-nav-image/ic_collection.png',
    image:'/images/tab-nav-image/ic_nocollection.png',
    type:'collection2',
  }, {
    name:'分享',
    selectImage:'',
    image:'/images/tab-nav-image/share.png',
    type:'share'
  }],
  _isBuyShop:0
  },

  
  methods: {
    setad: tool.throttle(async function (e) {
      var that = this
      let index = e[0].currentTarget.dataset.index
      let pageType = e[0].currentTarget.dataset.pageType
      let tabArr = pageType==2?this.data.tabArr2:this.data.tabArr
      let type = tabArr[index].type
      app.log('type',type)
      // if (index == that.data.chioceIndex) {
      //   return false
      // }
      if (type == 'index') {
        wx.reLaunch({
              url: '/pages/index/index',
            })
            return
      }
      //咨询
      else if(type == 'customer'){
        this.setData({
          showBubble:!this.data.showBubble
        })
      }
      //非购买页面导航
      else if(type == 'customer2'){
        wx.navigateTo({
          url: '/xpages/contact/contact',
        })
      }
      //非购买的收藏
      else if(type == 'collection2'){
      let that = this
      app.UserLogin()
      let caseMessage = this.data._caseMessage
      app.log('caseMessage', caseMessage)
      if(!caseMessage){
        wx.showToast({
          title: '功能开发中...',
          icon:'none',
        })
        return false
      }
      if (caseMessage.isCollect) {
        api.newget('/rest/memberCenter/deleteCollectionById?collectionId=' + caseMessage.isCollect, {}, 'POST', function (e) {
          if (e.code == 200) {
            wx.showToast({
              title: '取消收藏成功',
              icon: 'none'
            })
            that.triggerEvent('myevent', {
              isCollect: false
            });
          }
        },0)
      } else {
        let data = {
          collectionId: caseMessage.collectionId,
          collectionType: caseMessage.collectionType,
        }
        api.newget('/rest/memberCenter/addCollection', data, 'POST', function (e) {
          wx.showToast({
            title: e.message,
            icon: 'none',
            duration: 1500
          })
          let data1 = {
            newsClassId: caseMessage.newsClassId,
            objectId: caseMessage.collectionId
          }
          api.request('/rest/newsClass/getModel', data1, 'GET', function (res) {
            that.triggerEvent('myevent', {
              isCollect: res.data.isCollect
            });
            // that.setData({
            //   ['modelList.isCollect']: res.data.isCollect
            // })
          },0)
        },0)
      }
      }
      //预约免费设计
      else if(type == 'design'){
        wx.navigateTo({
              url: '/xpages/budgetquotation/budgetquotation?id=' + 203 + '&toptext=' + '预算报价'
            })
      }
      //我的
      else if(type == 'my'){
        // await app.obtaintoken()
        // if (!app.globalData.token) {
        //   app.UserLoginToClick()
        //   return false
        // }
        wx.reLaunch({
          url: '/businesscard/index/index',
        })
      }
      //
      else if (type == 'classification'){
       wx.reLaunch({
          url: '../../pages/tab-classification/tab-classification',
        })
      }else if(type == 'cart'){
        await app.obtaintoken()
        if (!app.globalData.token) {
          app.UserLoginToClick()
          return false
        }
        wx.navigateTo({
          url: '/pages/tab-cart/tab-cart',
        })
      }

     
      

      // else if (index == 1) {
      //   // wx.reLaunch({
      //   //   url: '../../pages/tab-classification/tab-classification',
      //   // })
      //   wx.navigateTo({
      //     url: '/xpages/contact/contact',
      //   })
      // } else if (index == 2) {
      //   wx.navigateTo({
      //     url: '/xpages/budgetquotation/budgetquotation?id=' + 203 + '&toptext=' + '预算报价'
      //   })
      //   // 如果没有登录
      //   // if (app.globalData.token) {
      //   //   wx.reLaunch({
      //   //     url: '../../pages/tab-cart/tab-cart',
      //   //   })
      //   // } else if (await app.IsLogin() == 407) {
      //   //   wx.hideLoading({
      //   //     success: (res) => {},
      //   //   })
      //   //   let userinfoss = wx.getStorageSync('xuserixnfo')
      //   //   if (userinfoss == "") {
      //   //     that.setData({
      //   //       iosDialog1: true
      //   //     })
      //   //   } else {
      //   //     that.setData({
      //   //       iosDialog2: true
      //   //     })
      //   //   }
      //   // } else {
      //   //   wx.reLaunch({
      //   //     url: '../../pages/tab-cart/tab-cart',
      //   //   })
      //   // }


      // }
      // //商品分类
      // else if (index == 3) {
      //   wx.reLaunch({
      //     url: '../../pages/tab-classification/tab-classification',
      //   })
      // } else {

      //   // 如果没有登录
      //   if (app.globalData.token) {
      //     wx.reLaunch({
      //       url: '/businesscard/index/index',
      //     })
      //   } else if (await app.IsLogin() == 407) {
      //     wx.hideLoading({
      //       success: (res) => {},
      //     })
      //     let userinfoss = wx.getStorageSync('xuserixnfo')
      //     if (userinfoss == "") {
      //       that.setData({
      //         iosDialog1: true
      //       })
      //     } else {
      //       that.setData({
      //         iosDialog2: true
      //       })
      //     }
      //   } else {
      //     wx.reLaunch({
      //       url: '/businesscard/index/index',
      //     })


      //   }

      // }
      // if (that.data.iosDialog1 || that.data.iosDialog2) {
      //   var myEventDetail = {
      //     isshouquan: true
      //   }
      // } else {
      //   var myEventDetail = {
      //     isshouquan: false
      //   }
      // }


      // that.triggerEvent('isclick', myEventDetail)
      // that.setData({
      //   chioceIndex: index
      // })
    }),

    //拨打电话
    callPhne(){
      wx.makePhoneCall({
        phoneNumber: app.globalData.callPhone,
      })
    },
    customer(){
      wx.navigateTo({
        url: '/xpages/contact/contact',
      })
    },
    //关闭授权
    close: function (e) {
      var that = this
      if (e.detail == "true") {
        var myEventDetail = {
          isshouquan: true
        }
        that.triggerEvent('isclick', myEventDetail)
      } else {
        console.log('取消')
        var myEventDetail = {
          isshouquan: false
        }
        that.triggerEvent('isclick', myEventDetail)
      }

    },

    //收藏
    Collection() {
      let that = this
      app.UserLogin()
      let caseMessage = this.data._caseMessage
      app.log('caseMessage', caseMessage)
      if (caseMessage.isCollect) {
        api.newget('/rest/memberCenter/deleteCollectionById?collectionId=' + caseMessage.isCollect, {}, 'POST', function (e) {
          if (e.code == 200) {
            wx.showToast({
              title: '取消收藏成功',
              icon: 'none'
            })
            that.triggerEvent('myevent', {
              isCollect: false
            });
          }
        },0)
      } else {
        let data = {
          collectionId: caseMessage.collectionId,
          collectionType: caseMessage.collectionType,
        }
        api.newget('/rest/memberCenter/addCollection', data, 'POST', function (e) {
          wx.showToast({
            title: e.message,
            icon: 'none',
            duration: 1500
          })
          let data1 = {
            newsClassId: caseMessage.newsClassId,
            objectId: caseMessage.collectionId
          }
          api.request('/rest/newsClass/getModel', data1, 'GET', function (res) {
            that.triggerEvent('myevent', {
              isCollect: res.data.isCollect
            });
            // that.setData({
            //   ['modelList.isCollect']: res.data.isCollect
            // })
          },0)
        },0)
      }
    }
  }
})