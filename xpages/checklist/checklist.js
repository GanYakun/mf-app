// xpages/checklist/checklist.js
const api = require("../../utils/api.js")
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js')
import requestCenter from "../../http/request-center"
import pageRote from  "../../utils/page-route"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chioceindex: 0,
    chiocelist: [],
    combinedmoney: 0.00, //加入购物车后的金额
    numberpatternre: 0,
    istc: true,
    shoplist: [], //预览的产品数组
    testarr: [],
    allprice: 0,
    photoindex: 0,
    istop: true,
    imgheights: [],
    topImage: [],
    current: 0,
    topcurrent: '', //顶部轮播图的current
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    username: app.globalData.username, //用户昵称
    userimg: app.globalData.userimg, //用户头像
    tabIndexHeight:app.globalData.tabIndexHeight, //底部导航栏的高度
    imgur: app.globalData.imgur,
    morePicter:[
      "https://wj.100good.cn/ueditor/ueditor/jsp/upload/image/20210405/1617615745407025375.jpg",
      "https://wj.100good.cn/ueditor/ueditor/jsp/upload/image/20210405/1617615745407025375.jpg",
      "https://wj.100good.cn/ueditor/ueditor/jsp/upload/image/20210405/1617615745407025375.jpg"
    ]
  },

  onLoad: async function  (options) {
    let that = this
    console.log('页面参数', options)
    this.setData({
      newsClassId:options.newsClassId
    })
    if (options.newsClassId == 129) {
      that.setData({
        istop: false,
        type: 1
      })
    } else {
      that.setData({
        istop: true,
        type: 0
      })
    }
    //查询点击毛坯房的数据
    let data = {
      newsClassId: options.newsClassId,
      objectId: options.objectId,
    }
    api.request('/rest/newsClass/getModel', data, 'GET', that.getModel)
  
   
  },




  //回调
  async getModel(e) {
    var that = this;
    if (e) {
      if(e.data.articleTextMainPhone){
        WxParse.wxParse('article', 'html', e.data.articleTextMainPhone, that, 25);
      }
      if(e.data.brandZtContent){
        WxParse.wxParse('brandZt', 'html', e.data.brandZtContent, that, 5);
      }
      // if(e.data.brandImagesPath&&e.data.brandImagesPath.length>0){
      //   let brandImagesPath =JSON.parse(e.data.brandImagesPath)
      //   console.log(brandImagesPath, brandImagesPath.length)
      //   for(let i=0;i<brandImagesPath.length;i++){
      //     if(brandImagesPath[i].path){
      //       e.data.imageVoList.push({imagePath:brandImagesPath[i].path})
      //     }
      //   }
      //   console.log('轮播图', e.data.imageVoList)
      // }
    this.setData({
      caseMessage: {
        isCollect: e.data.isCollect,  //是否收藏
        collectionId: e.data.id,      //案例id
        collectionType: 'perfectHome', 
        newsClassId: that.data.newsClassId
      },
      articleTextMainPhone:e.data.articleTextMainPhone,
      wxBannerList:e.data.wxBannerList  //微信广告图
    })
    }
    that.setData({
      TopTitle: e.data.homeTitle,
      shareTitle:e.data.homeTitle,
    })
    that.setData({
      pagedata: e.data
    })

    // 计算限时抢购剩余的时间
    let endtime = e.data.endTime
    if (endtime) {
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
    } else {
      that.setData({
        time: 0
      })
    }

    if (e.data.videoVo.imagePath == null && e.data.vrUrlMain == null) {
      that.setData({
        chiocelist: ["图片"]
      })
    } else if (e.data.videoVo.imagePath == null && e.data.vrUrlMain != null) {
      that.setData({
        chiocelist: ["图片", "VR"]
      })
    } else if (e.data.videoVo.imagePath != null && e.data.vrUrlMain == null) {
      that.setData({
        chiocelist: ["视频", "图片"]
      })
    } else {
      that.setData({
        chiocelist: ["视频", "VR", "图片"]
      })
    }

    let arr = e.data.perfectHomeSpaceList
    try {
      arr.forEach(function (v, k) {
        //跳出条件
        if (v.isRecommend == 0) {
          console.log(k)
          that.setData({
            chicknum: k,
            kongjianid: v.id,
          })
          throw new Error("LoopTerminates");
        }
      });
    } catch (e) {
      // console.log(e)
      if (e.message !== "LoopTerminates") throw e;
    };
    let DoesItExist = await that.DoesItExist(arr)
  },

  // 判断第一个空间的商品后台有没有默认选中的方法
  DoesItExist(arr) {
    return new Promise((resove, reject) => {
      let allprice = 0
      arr.forEach((vs,ks)=>{
        console.log(vs)
        vs.bandGoodsList.forEach((v, k) => {
          if (v.isSpecial) {
            this.data.shoplist.push({
              kongjianid: v.spaceId,
              image: v.picVo.imagePath,
              goodsnum: v.goodsNum?v.goodsNum:1,
              price: v.onePrice,
              skuid: v.skuId,
              spuid: v.spuId
            })
            allprice = allprice+(v.onePrice*(v.goodsNum?v.goodsNum:1))
           
          }
        })
      
      })
      this.setData({
        allprice:allprice,
        shoplist: this.data.shoplist
      })
      resove(this.data.shoplist)
      })
      
  },

  // 多图放大预览
  previewImage(e) {
    let index = e.currentTarget.dataset.index
    var imageList = this.data.pagedata.imageVoList2.map(v => this.data.imgur + v.imagePath)
    wx.previewImage({
      current: imageList[index],
      urls: imageList
    })
  },


  //三个按钮的点击事件
  chioceshijian: function (e) {
    console.log(e)
    this.setData({
      chioceindex: e.currentTarget.dataset.index
    })
  },

  iconimage: function (e) {
    let that = this;
    let htmltext = e.currentTarget.dataset.htmltext
    let query = wx.createSelectorQuery()
    query.select('.topbox').boundingClientRect()
    query.exec((res) => {
      that.setData({
        scrollTop: res[0].height + 10
      })
    })

    that.setData({
      clickPosition: 0,
      chicknum: e.currentTarget.dataset.index,
      kongjianid: e.currentTarget.dataset.kongjianid,
      testtop: 0
    })
    if (htmltext) {
      WxParse.wxParse('htmltext', 'html', htmltext, that, 25);
    }
  },


  // 点击选中  并加入预览
  updatebyclick: function (e) {
    console.log(e)
    let that = this
    let topsku = e.currentTarget.dataset.topsku
    let chicknum = e.currentTarget.dataset.chicknum
    let indexs = e.currentTarget.dataset.index
    let arr = that.data.pagedata
    let isSpecial = e.currentTarget.dataset.isspecial
    // 如果judge为null，则改变updateby为true，弹出预览框
    if (isSpecial == 0) {
      let setvalue = 'pagedata.perfectHomeSpaceList['+chicknum+'].bandGoodsList['+indexs+'].isSpecial'
      let datadata = {
        kongjianid: that.data.kongjianid,
        image: e.currentTarget.dataset.imagesrc,
        goodsnum: e.currentTarget.dataset.goodsnum,
        price: e.currentTarget.dataset.price,
        skuid: topsku,
        spuid: e.currentTarget.dataset.spuid
      }
      let jisuanprice = e.currentTarget.dataset.goodsnum * e.currentTarget.dataset.price
      console.log(that.data.allprice)
      that.data.shoplist.push(datadata)
      that.setData({
        shoplist: that.data.shoplist,
        pagedata: arr,
        allprice: that.data.allprice + jisuanprice,
        [setvalue]:1
      })
     } else {
       let setvalue = 'pagedata.perfectHomeSpaceList['+chicknum+'].bandGoodsList['+indexs+'].isSpecial'
        let shoplist = that.data.shoplist
        let index = e.currentTarget.dataset.index
        let  Isthereany = that.data.shoplist.findIndex(obj => obj.skuid == topsku)
        console.log(Isthereany)
        that.setData({
          allprice:that.data.allprice-shoplist[Isthereany].price*shoplist[Isthereany].goodsnum,
          [setvalue]:0
        })
        that.data.shoplist.splice(Isthereany, 1)
        that.setData({
          shoplist:that.data.shoplist,
          istc:that.data.shoplist.length==0?true:that.data.istc
        })
        
    

    //   arr.perfectHomeSpaceList[chicknum].bandGoodsList[index].updateBy = null
    //   let jisuanprice = e.currentTarget.dataset.goodsnum * e.currentTarget.dataset.price
    //   let allprices = that.data.allprice - jisuanprice
    //   that.setData({
    //     pagedata: arr,
    //     allprice: allprices
    //   })
    //   let shoplistarr = that.data.shoplist
    //   let kongid = that.data.kongjianid
    //   shoplistarr.forEach(function (v, k) {
    //     if (v.kongjianid == kongid) {
    //       if (v.skuid == topsku) {
    //         console.log(k)
    //         shoplistarr.splice(k, 1)
    //         console.log(shoplistarr)
    //         if (shoplistarr == "") {
    //           that.setData({
    //             istc: true
    //           })
    //         }
    //         that.setData({
    //           shoplist: shoplistarr,
    //           numberpatternre: shoplistarr.length
    //         })
    //       }
    //     }

    //   })
    }
   


  },

  //滑动结束
   SlideEnd: function () {
    console.log('结束')
    let that = this
    let query = wx.createSelectorQuery()
    console.log(that.data.Isitfixed)
    // if (!that.data.Isitfixed) {
    //   query.select('.query').boundingClientRect()
    //   query.exec((res) => {
    //     console.log(res[0].top)
    //     if (res[0].top < 80) {
    //       that.setData({
    //         Isitfixed: true
    //       })
    //     }
    //   })
    // }
    if (!that.data.Isitfixed) {
     var timer =  setTimeout(() => {
        query.select('.query').boundingClientRect()
        query.exec((res) => {
          console.log(res[0].top)
          if (res[0].top < 80) {
            that.setData({
              Isitfixed: true
            })
          }
        })
        clearTimeout(timer)
      }, 1000)
    }

  },

  // 收起预览
  shouqitc: function () {
    console.log(this.data.istc)
    this.setData({
      istc: !this.data.istc
    })
  },

  // 预览中删除点击的商品
  deleteshop: function (e) {
    let that = this;
    let shoplist = that.data.shoplist
    let index = e.currentTarget.dataset.index
    console.log(shoplist[index].kongjianid)
    let IsThereAnyIndex = that.data.pagedata.perfectHomeSpaceList.findIndex(obj => obj.id == shoplist[index].kongjianid)
    console.log(IsThereAnyIndex)
    let IsThereAny = that.data.pagedata.perfectHomeSpaceList[IsThereAnyIndex].bandGoodsList.findIndex(obj => obj.skuId == e.currentTarget.dataset.skuid)
    console.log('寻找下标',IsThereAny)
    if(IsThereAny !=-1){
      let setValue = 'pagedata.perfectHomeSpaceList['+IsThereAnyIndex+'].bandGoodsList['+IsThereAny+'].isSpecial'
      that.setData({
        [setValue]:0
      })
    }
    that.setData({
      allprice:that.data.allprice-shoplist[index].price*shoplist[index].goodsnum
    })
    that.data.shoplist.splice(index, 1)
    that.setData({
      shoplist:that.data.shoplist,
      istc:that.data.shoplist.length==0?true:false
    })


  },


  //数量减
  plusLowjian: function (e) {
    let that = this;
    let shopnum = e.currentTarget.dataset.goodsnum
    let arr = that.data.shoplist
    let index = e.currentTarget.dataset.index
    let kongjianid = that.data.kongjianid
    let pagearr = that.data.pagedata
    let onePrice = e.currentTarget.dataset.price

    if (shopnum == 1) {

    } else {
      let setValue = 'pagedata.perfectHomeSpaceList['+that.data.chicknum+'].bandGoodsList['+index+'].goodsNum'
      that.setData({
        [setValue]:shopnum-1,
        allprice:that.data.allprice - onePrice
      })
      // arr.forEach(function (v, k) {
      //   if (v.kongjianid == kongjianid) {
      //     arr[k].goodsnum = parseInt(shopnum - 1)
      //     that.setData({
      //       shoplist: arr,
      //       numberpatternre: arr.length
      //     })
      //   }
      // })
      // pagearr.perfectHomeSpaceList.forEach(function (v, k) {
      //   if (v.id == kongjianid) {
      //     pagearr.perfectHomeSpaceList[k].bandGoodsList[index].goodsNum = parseInt(shopnum - 1)
      //     that.setData({
      //       pagedata: pagearr,
      //     })
      //   }

      // })
      // let allprices = that.data.allprice - parseInt(e.currentTarget.dataset.price)
      // that.setData({
      //   allprice: allprices
      // })
    }

  },

  //数量加
  plusLowjia: function (e) {
    let that = this;
    let shopnum = parseInt(e.currentTarget.dataset.goodsnum)
    let arr = that.data.shoplist
    let index = e.currentTarget.dataset.index
    let kongjianid = that.data.kongjianid
    let pagearr = that.data.pagedata
    let onePrice = e.currentTarget.dataset.price
    let setValue = 'pagedata.perfectHomeSpaceList['+that.data.chicknum+'].bandGoodsList['+index+'].goodsNum'
      that.setData({
        [setValue]:shopnum-1+2,
        allprice:that.data.allprice + onePrice
      })
  },

  // 关闭弹窗
  closeloding: function () {
    console.log("000")
    wx.hideLoading({
      success: (res) => {},
    })
  },


  /**
   * 
   * 左侧图片点击事件
   * 
   */
  leftbtn: function (e) {
    this.setData({
      photoindex: e.currentTarget.dataset.index
    })
  },


  /**
   * 
   * 加入购物车事件
   * 
   */
  joinselect: async function () {
    await app.obtaintoken()
    if(!app.globalData.token){
      app.UserLoginToClick()
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    let shoplist = this.data.shoplist
    that.setData({
      joincartarr: ''
    })

    shoplist.forEach(function (v, k) {
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
        let header = {
          'content-type': 'application/json',
          'X-AUTH-TOKEN': app.globalData.token
        }
        // let extendData = {}
        // extendData['cartId'] = xids;
        let dataput = {
          skuId: v.skuid, //单品Id 
          quantity: v.goodsnum, //产品的数量
          productId: v.spuid, //产品id
          promotionId: '',
          promotionsType: 0
        }
        api.xpost('/rest/memberCenter/saveOrUpdateCart', dataput, 'PUT', header, function (e) {
          console.log(e)
          if (e) {

            if (e.message == '未登录') {
              wx.showLoading({
                title: '加载中...',
                duration: 1500,
              });
              app.obtaintoken()
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
      if (k == shoplist.length - 1) {
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })




  },

  //页面隐藏
  onHide: function () {
    //app.UserLogin()
  },

  

  //一元下定
  btn1: function (e) {

    let pagedata = this.data.pagedata
if(!pagedata.depositPrice){
  wx.showToast({
    title: '未设置下定价格',
  })
  return false
}
try {
var Space = pagedata.searchOptionMap.kongjian[0]?pagedata.searchOptionMap.kongjian[0]:''
  
} catch (error) {
  console.log('Space','!!!抛出一个异常')
var Space = ''
}
//户型
try{
  try{
    var HouseTypePerhaps = pagedata.searchOptionMap.house_type[0]    //精装房户型
  }catch{
    var HouseTypePerhaps = pagedata.searchOptionMap.house_type2[0]    //毛坯房户型
  }
}catch{
    var HouseTypePerhaps = ''    //精装房户型
}

//楼盘
try{
  try{
    var propertiesForSale = pagedata.searchOptionMap.successBuild[0]    //精装房楼盘
  }catch{
    var propertiesForSale =pagedata.searchOptionMap.successBuild2[0]     //毛坯房楼盘
  }
}catch{
    var propertiesForSale = ''    //精装房户型
}

//系列

try{
  try{
    var series = pagedata.searchOptionMap.pop_style[0]   //精装房楼盘
  }catch{
    var series =pagedata.searchOptionMap.pop_style2[0]    //毛坯房楼盘
  }
}catch{
    var series = ''    //精装房户型
}



    let parameter = {
      depositPrice:pagedata.depositPrice,   //  案例价格
      CaseName:pagedata.homeTitle,        //案例标题
      packagePrice:pagedata.costMoneyTotal,     //拎包价
      endTime:pagedata.endTime,           // 结束时间
      limitedNumber:pagedata.limitedNumber,   //限量几套
      id:pagedata.id,           // 案例id
      type:'tWebPerfectHome',     //案例类型
      subtitle:pagedata.subtitle,    //案例描述
      tWebtype:'meijia',
      propertiesForSale:propertiesForSale,  //楼盘
      series:series, //系列
      theMeasureOfArea:pagedata.homeArea,       //面积
      HouseTypePerhaps:HouseTypePerhaps,    //户型
      Space:Space,
      isHouseAndSpace:this.data.type,
      depositImagePath:pagedata.depositImagePath,    //下定界面的图片
      appointTitle:pagedata.appointTitle,         //下定页面的标题
    }
wx.navigateTo({
  url: '../../xpages/byoneyuan/byoneyuan?parameter='+encodeURIComponent(JSON.stringify(parameter)),
})
    // let data = {
    //   // orderNum:timestamp,   //订单编号
    //   orderRecommendId:865,
    //   orderDepositId:pagedata.id,   //案例id
    //   orderDepositName:pagedata.homeTitle?'嘎嘎':'2',    //案例名字
    //   orderPrice:1,   //订单价格
    //   orderName:'测试',       //订单人名字
    //   orderTel:13782374153,   //订单人电话
    //   orderDepositType:'tWebPerfectHome',    //案例类型
    //   orderRemark:''        //订单备注
    // }
// api.newget('/rest/memberCenter/addDepositOrder',data,'POST',(mes)=>{
//   wx.login({
//     success(res) {
//       var codes = res.code
//       //微信支付接口返回的数据
//       api.newget('/rest/payApi/xcxPay?code=' + codes + '&orderNum=' + mes.data.orderNum, {}, 'POST', function (e) {
//         if (e.code == 500) {
//           wx.showToast({
//             title: e.message,
//             icon: 'none'
//           })
//         }
//         console.log(e)
//         wx.requestPayment({
//           'timeStamp': e.data.timeStamp,
//           'nonceStr': e.data.nonceStr,
//           'package': e.data.weixinPackage,
//           'signType': 'MD5',
//           'paySign': e.data.sign,
//           "success": function (res) {
//             console.log(res)
//             wx.hideLoading({
//               success: (res) => {},
//             })
//             if (res.errMsg == "requestPayment:ok") {
//               wx.navigateTo({
//                 url: '../../xpages/paypage/paypage?timestamp=' + timestamp + '&price=' + that.data.shopmessage.totlePrice + '&status=' + '成功',
//               })
//             }
//           },
//           "fail": function (res) {
//             if (res.errMsg == 'requestPayment:fail cancel') {
//               wx.navigateTo({
//                 url: '../../xpages/paypage/paypage?timestamp=' + timestamp + '&price=' + that.data.shopmessage.totlePrice + '&status=' + '失败',
//               })
//             }
//             wx.hideLoading({
//               success: (res) => {},
//             })

//             //  wx.showToast({
//             //   title: res,
//             //   icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
//             //   duration: 1500     
//             // })  
//           }
//         })
//       })
//     }
//   })
// })
//     wx.navigateTo({
//       url: './test/test?pageData='+encodeURIComponent(JSON.stringify(this.data.pagedata)) ,
//     })
   },

  //跳转到H5
  vrh5page: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../h5page/h5page?url=' +encodeURIComponent(e.currentTarget.dataset.vrurl),
    })
  },

  /**
   * 
   * 分享
   * 
   */
  // share: function () {
  //   wx.navigateTo({
  //     url: '../../xpages/poster/poster',
  //   })
  // },


 //计算悬浮tab的高度
  upper: function (e) {
    let that = this
    if(!that.data.pagedata.perfectHomeSpaceList.length>0){
      return false
    }
    var query = wx.createSelectorQuery()
    query.select('.query').boundingClientRect()
    query.exec((res) => {
      if (res[0].top < 70 && res[0].top > 0) {
        that.setData({
          Isitfixed: true
        })
        console.log('计算高度', res)
      } else if (res[0].top > 80) {
        if (that.data.Isitfixed) {
          console.log('已固定')
          that.setData({
            Isitfixed: false
          })
        }

      }

    })

  },

  //设计师详情
  DesignerDetails:function(e){
    wx.navigateTo({
      url: '../allhouse_detail/allhouse_detail?id=' + e.currentTarget.dataset.id + "&newsClassId=121"+'&Popupornot='+e.currentTarget.dataset.popupornot,
    })
  },
// 用户评价
allhouse_detail: async function (e) {
  await app.obtaintoken()
  //点击按钮判断是否登陆
  if(!app.globalData.token){
    app.UserLoginToClick()
    return false
  }
  let id = e.currentTarget.dataset.id
  this.setData({
    username: app.globalData.username, //用户昵称
    userimg: app.globalData.userimg, //用户头像
  })
  this.getEvaList()

  this.setData({
    isUserEvaluationShow:this.data.isUserEvaluationShow?false:true
  })

  // wx.navigateTo({
  //   url: './Evaluate/Evaluate',
  // })
  // wx.navigateTo({
  //   url: '../allhouse_detail/allhouse_detail?id=' + id + "&newsClassId=121"+'&Popupornot='+e.currentTarget.dataset.popupornot,
  // })
},

  // 输入完成，发表评价
  complete:function(e){
    console.log(e)
    let data = {
      perfectId:this.data.pagedata.id,
      commentContent:e.detail.value
    }
    api.newget('/rest/memberCenter/perfectHomeComment',data,'POST',(res)=>{
      if(res.code == 200){
        this.getEvaList()
        this.setData({
          cleardata:'',
          ListPosition:0
        })
      }
      wx.showToast({
        title: res.message,
        icon:'none'
      })
    })
  },
  //获取评价列表
  getEvaList:function(){
    let data={
      page:1,
      rows:12,
      perfectId:this.data.pagedata.id,
    }
    api.newget('/rest/memberCenter/perfectHomeCommentList',data,'GET',(res)=>{
      this.setData({
        CommentData:res.data,
        CurrentPage:1
      })
    })
  },
  // 评论列表滑动加载
  scrollLow(){
    let arrLength = this.data.CommentData.results.length
    if(arrLength == this.data.CommentData.total || arrLength > this.data.CommentData.total){
      wx.showToast({
        title: '暂无数据',
        icon:'none'
      })
      return false
    }
    let data={
      page:this.data.CurrentPage+1,
      rows:12,
      perfectId:this.data.pagedata.id,
    }
    api.newget('/rest/memberCenter/perfectHomeCommentList',data,'GET',(res)=>{
      let setValue = 'CommentData.results'
      this.data.CommentData.results.concat(res.data.results)
      this.setData({
        [setValue]:this.data.CommentData.results.concat(res.data.results),
      })
    })
  },
  //关闭评论框
  closeComplete:function(){
    this.setData({
      isUserEvaluationShow:false
    })
  },

   //组件绑定的收藏事件
   Collection(e) {
    app.log('组件绑定的收藏事件xpages/land/land', e)
    this.setData({
      ['caseMessage.isCollect']: e.detail.isCollect
    })
  },

  //毛坯精装广告图点击事件
  adImgTap(event){
    let index = event.currentTarget.dataset.index
    var newPageRote = new pageRote()
    let params={
      eventType: 'brandBanner',
      position: index?index:0,
      source: this.data.wxBannerList
    }
    newPageRote.onAction(params)
  }








})