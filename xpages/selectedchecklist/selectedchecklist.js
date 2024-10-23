// xpages/checklist/checklist.js
var api = require("../../utils/api.js")
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
import requestCenter from '../../http/request-center'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chioceindex: 0,
    chiocelist: [],
    combinedmoney: 0.00,  //加入购物车后的金额
    numberpatternre: 0,
    istc: true,
    shoplist: [],
    testarr: [],
    allprice:0,
    photoindex:0,
    istop:true,
    isshowguanggao:false,
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this
    that.setData({
      type:options.type
    })
    console.log('页面参数信息',options)
    this.setData({
      newsClassId:options.newsClassId
    })
if(options.newsClassId==129){
  that.setData({
    istop:false
  })
}else{
  that.setData({
    istop:true
  })
}
    if(options.pagetitle==''||options.pagetitle==null){

    }else{
      wx.setNavigationBarTitle({
        title: options.pagetitle,
      })
    }
    
    that.setData({
      imgur: app.globalData.imgur
    })
    //查询点击毛坯房的数据
    let data = {
      newsClassId: options.newsClassId,
      objectId: options.objectId,
    }
    api.newget('/rest/newsClass/getModel', data, 'GET', that.getModel)
    // 广告图
    let getWxBannerByRootIdKeyData = {
      rootId: 3,
      SearchRowNum:1
    }
    api.request('/rest/tWebWxBannerControllerApi/getWxBannerByRootIdKey', getWxBannerByRootIdKeyData, 'GET', function(e){
      that.setData({
      getWxBannerByRootIdKey:e.data
     })
    })
  },

  //回调
  async getModel(e) {
    if (e) {
      console.log(e)
      this.setData({
        caseMessage: {
          isCollect: e.data.isCollect,  //是否收藏
          collectionId: e.data.id,      //案例id
          collectionType: 'perfectHome', 
          newsClassId: this.data.newsClassId,
          type:3
        },
      })


    }
    let endtime = e.data&&e.data.endTime?e.data.endTime:''
    if (endtime) {
      let end_str = (endtime).replace(/-/g, "/");
      var end_date = new Date(end_str); //将字符串转化为时间  
      var mytime = new Date();
      if (end_date < mytime) {
        this.setData({
          time: 0
        })
      } else {
        this.setData({
          time: end_date - mytime
        })
      }
    }
    var that = this;
    that.setData({
      pagedata: e.data,
      shareTitle:e.data.homeTitle
    })
    let arr = e.data.perfectHomeSpaceList
    let price = await that.CalculateSelected(arr)
    if(price){
      that.setData({
        allprice:price,
      })
    }
    
   
   
    arr.forEach(function (v, k) {
      //跳出条件
      if (v.isRecommend == 0) {
        console.log(k)
        let arr = that.data.testarr
        arr.push(v.id)
        that.setData({
          testarr: arr,
        })
      }
      else {

      }
    });
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
          console.log("123")
        }
      });
    } catch (e) {
      // console.log(e)
      if (e.message !== "LoopTerminates") throw e;
    };
    let article = e.data.articleTextMainPhone
    app.log('article xpages/selectedchecklist/selectedchecklist页面',article)
    if(article){
      WxParse.wxParse('article', 'html', article, that, 25);
    }
   

  },

  //计算选中的价格和加入预览商品
  CalculateSelected(arr){
    return new Promise((resove,reject)=>{
      let num = 0
     try{
      arr[0].bandGoodsList.forEach((v,k)=>{
        if(v.isSpecial == 1){
          this.data.allprice = this.data.allprice+(v.goodsNum*v.onePrice)
          this.data.shoplist.push({
            image:v.picVo.imagePath,
            goodsnum: v.goodsNum,
            price: v.onePrice,
            skuid: v.skuId,
            spuid: v.spuId
          })
        }
        num = num +1
      })
      if(num == arr[0].bandGoodsList.length){
      resove(this.data.allprice)
      this.setData({
        shoplist:this.data.shoplist
      })
      }
     }catch{
console.log('!!!!!!!!!!!!,抛出异常')
resove('')
     }
     
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
    that.setData({
      chicknum: e.currentTarget.dataset.index,
      kongjianid: e.currentTarget.dataset.kongjianid
    })
  },


  

  

  


  

  

  // 关闭弹窗
  closeloding:function(){
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
  leftbtn:function(e){
    this.setData({
      photoindex:e.currentTarget.dataset.index
    })
  },


 
  onHide:function(){
  wx.hideLoading({
    success: (res) => {},
  })
  },
 // 预约
 allhouse_detail: function (e) {
  let id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '../allhouse_detail/allhouse_detail?id=' + id + "&newsClassId=121"+'&Popupornot='+e.currentTarget.dataset.popupornot,
  })
},

  /**
   * 
   * 页面渲染完成
   * 
   */
  onReady:function(){
    var that = this
    var timer = setTimeout(function () {
      that.setData({
        isshowguanggao:true
      })
      clearTimeout(timer)
     }, 1000) //延迟时间 这里是1秒

  },

  //跳转到H5
  vrh5page: function (e) {
    wx.navigateTo({
      url: '../h5page/h5page?url=' + e.currentTarget.dataset.vrurl,
    })
  },

  //1元下定
  btn1: function (e) {
    let pagedata = this.data.pagedata
if(!pagedata.depositPrice){
  wx.showToast({
    title: '未设置下定价格',
  })
  return false
}
    let parameter = {
      depositPrice:pagedata.depositPrice,   //  案例价格
      CaseName:pagedata.homeTitle,        //案例标题
      packagePrice:pagedata.costMoneyTotal,     //拎包价
      endTime:pagedata.endTime,           // 结束时间
      limitedNumber:pagedata.limitedNumber,   //限量几套
      id:pagedata.id,           // 案例id
      type:'tWebPerfectHome',     //案例类型
      subtitle:pagedata.homeIdea,    //案例描述
      appointTitle:pagedata.appointTitle, //案例自定义标题
    }
wx.navigateTo({
  url: '../../xpages/byoneyuan/byoneyuan?parameter='+encodeURIComponent(JSON.stringify(parameter)),
})
  },

//  加入购物车
  addToCart(){
    this.setData({
      isShowLoding:true
    })
    let perfectHomeSpaceList = this.data.pagedata.perfectHomeSpaceList
    if(perfectHomeSpaceList&&perfectHomeSpaceList.length>0){
      perfectHomeSpaceList.forEach((vs,ks)=>{
        if(vs.bandGoodsList&&vs.bandGoodsList.length>0){
          vs.bandGoodsList.forEach(async (v,k)=>{
            console.log(v)
            let params={
              skuId: v.skuId, //单品Id 
              quantity: v.goodsNum, //产品的数量
              productId: v.spuId, //产品id
              promotionId: '',
              promotionsType: 0
            }
            let putSaveOrUpdateCart = await requestCenter.putSaveOrUpdateCart(params)
            if(k==vs.bandGoodsList.length-1){
              wx.showToast({
                title: '加入购物车成功',
                icon: 'none',
                duration: 1500
              })
              this.setData({
                isShowLoding:false
              })
            }
            
          })
        }
      })
      
    }
  },
  collection(e) {
    app.log('组件绑定的收藏事件xpages/land/land', e)
    this.setData({
      ['caseMessage.isCollect']: e.detail.isCollect
    })
  },

  //立即购买
  async nowBuy(){
    let perfectHomeSpaceList = this.data.pagedata.perfectHomeSpaceList
   
    let bandGoodFun = function(){
      return new Promise((resove,reject)=>{
        let skuIds = ''
        perfectHomeSpaceList.forEach((v,k)=>{
          (v.bandGoodsList).forEach((vs,ks)=>{
            if(skuIds){
              skuIds=skuIds+','+(vs.skuId+':'+vs.goodsNum)
            }else{
              skuIds=skuIds+(vs.skuId+':'+vs.goodsNum)
            }
          })
        })
        resove (skuIds)
      })
    }
    let skuIds= await bandGoodFun()
    let params={
      ids:{skuIds:skuIds},
      orderClassification: 1,
      type:4
    }
    console.log(params)
    let nowBuy = await requestCenter.getNowBuy(params)
    let arr = JSON.stringify(nowBuy)
    wx.navigateTo({
      url: '../../xpages/orderattribute/orderattribute?data=' + encodeURIComponent(arr),
    })
    // bandGoodsList
  }
  


})