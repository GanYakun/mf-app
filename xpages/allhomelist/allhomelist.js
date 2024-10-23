// xpages/checklist/checklist.js
var api = require("../../utils/api.js")
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
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
    allprice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取页面的高度
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        console.log(pageWindowHeight)
        this.setData({
          pageWindowHeight: pageWindowHeight
        })
      }
    })

    wx.showLoading({
      title: '加载中......',
    })
    wx.setNavigationBarTitle({
      title: options.pagetitle,
    })
    this.setData({
      imgur: app.globalData.imgur
    })
    //查询点击毛坯房的数据
    let data = {
      newsClassId: options.newsClassId,
      objectId: options.objectId
    }
    api.request('/rest/newsClass/getModel', data, 'GET', this.getModel)
  },

  //回调
  getModel(e) {
    if (e) {
      wx.hideLoading({
        success: (res) => { },
      })
    }
    var that = this;
    that.setData({
      pagedata: e.data
    })
    if (e.data.videoVo.imagePath == null && e.data.vrUrlMain == null) {
      that.setData({
        chiocelist: ["图片"]
      })
    }
    else if (e.data.videoVo.imagePath == null && e.data.vrUrlMain != null) {
      that.setData({
        chiocelist: ["图片", "VR"]
      })
    }
    else if (e.data.videoVo.imagePath != null && e.data.vrUrlMain == null) {
      that.setData({
        chiocelist: ["视频", "图片"]
      })
    }
    else {
      that.setData({
        chiocelist: ["视频", "VR", "图片"]
      })
    }

    let arr = e.data.perfectHomeSpaceList
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
    let article = e.data.articleTextMain
    WxParse.wxParse('article', 'html', article, that, 25);

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


  // 点击选中  并加入预览
  updatebyclick: function (e) {
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true
    // })
    console.log(e)
    let that = this
    let judge = e.currentTarget.dataset.updateby
    console.log(e.currentTarget.dataset.updateby)
    let topsku = e.currentTarget.dataset.topsku
    console.log(judge)
    let chicknum = e.currentTarget.dataset.chicknum
    let index = e.currentTarget.dataset.index
    let arr = that.data.pagedata

    // 如果judge为null，则改变updateby为true，弹出预览框
    if (judge == null) {
      arr.perfectHomeSpaceList[chicknum].bandGoodsList[index].updateBy = "true"
      let datadata =
      {
        kongjianid: that.data.kongjianid,
        image: e.currentTarget.dataset.imagesrc,
        goodsnum: e.currentTarget.dataset.goodsnum,
        price: e.currentTarget.dataset.price,
        skuid: topsku
      }
      let jisuanprice = e.currentTarget.dataset.goodsnum*e.currentTarget.dataset.price
      console.log(jisuanprice)
      let allprices = that.data.allprice+jisuanprice
      let shoplistarr = that.data.shoplist
      shoplistarr.push(datadata)
      that.setData({
        shoplist: shoplistarr,
        pagedata: arr,
        allprice:allprices,
        allprice:allprices
      })
    } else {
      arr.perfectHomeSpaceList[chicknum].bandGoodsList[index].updateBy = null
      let jisuanprice = e.currentTarget.dataset.goodsnum*e.currentTarget.dataset.price
      let allprices = that.data.allprice-jisuanprice
      that.setData({
        pagedata: arr,
        allprice:allprices
      })
      let shoplistarr = that.data.shoplist
      let kongid = that.data.kongjianid
        shoplistarr.forEach(function (v, k) {
          if (v.kongjianid == kongid) {
            if (v.skuid == topsku) {
              console.log(k)
              shoplistarr.splice(k, 1)
              console.log(shoplistarr)
              if (shoplistarr == "") {
                that.setData({
                  istc: true
                })
              }
              that.setData({
                shoplist: shoplistarr
              })
            }
          }
        
        })
    }
    // 弹出预览
    if (that.data.istc) {
      if(that.data.shoplist==""){  
      }else{
        that.setData({
          istc: false
        })
      }
    }


  },

  // 收起预览
  shouqitc: function () {
    this.setData({
      istc: true
    })
  },

  // 预览中删除点击的商品
  deleteshop:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index
    let konjianid = e.currentTarget.dataset.konjian
    let skuid = e.currentTarget.dataset.skuid
    let arr = that.data.shoplist
    console.log(e.currentTarget.dataset.goodsshopnum)
    console.log(e)
    let jisuanprice = e.currentTarget.dataset.goodsshopnum*e.currentTarget.dataset.price
    console.log(jisuanprice)
      let allprices = that.data.allprice-jisuanprice
      that.setData({
        allprice:allprices
      })
      arr.splice(index,1)
      if(arr==""){
  that.setData({
    istc:true
  })
      }
      let pagearr = that.data.pagedata
      pagearr.perfectHomeSpaceList.forEach(function(v,k){
        if(v.id==konjianid){
  // let pagearrss = pagearr.bandGoodsList
  v.bandGoodsList.forEach(function(vs,ks){
    if(vs.skuId==skuid){
      pagearr.perfectHomeSpaceList[k].bandGoodsList[ks].updateBy = null
      that.setData({
        pagedata:pagearr
      })
    }
  })
        }
      })
      that.setData({
        shoplist:arr
      })
    
   
  },


  //数量减
  plusLowjian:function(e){
    let that = this;
    let shopnum = e.currentTarget.dataset.goodsnum
    let arr = that.data.shoplist
    let index = e.currentTarget.dataset.index
    let kongjianid = that.data.kongjianid
    let pagearr = that.data.pagedata
  
    if(shopnum==1){

    }else{
      arr.forEach(function(v,k){
        if(v.kongjianid==kongjianid){
          arr[k].goodsnum = parseInt(shopnum-1)
          that.setData({
            shoplist:arr
          })
        }
      })
      pagearr.perfectHomeSpaceList.forEach(function(v,k){
        if(v.id==kongjianid){
          pagearr.perfectHomeSpaceList[k].bandGoodsList[index].goodsNum=parseInt(shopnum-1)
          that.setData({
            pagedata:pagearr, 
          })
        }
  
      })
      let allprices = that.data.allprice-parseInt(e.currentTarget.dataset.price)
      that.setData({
        allprice:allprices
      })
    }
  
  },

  //数量加
  plusLowjia:function(e){
    let that = this;
    let shopnum = e.currentTarget.dataset.goodsnum
    let arr = that.data.shoplist
    let index = e.currentTarget.dataset.index
    let kongjianid = that.data.kongjianid
    let pagearr = that.data.pagedata
    arr.forEach(function(v,k){
      if(v.kongjianid==kongjianid){
        arr[k].goodsnum = parseInt(shopnum+1)
        that.setData({
          shoplist:arr
        })
      }
    })
      pagearr.perfectHomeSpaceList.forEach(function(v,k){
        if(v.id==kongjianid){
          pagearr.perfectHomeSpaceList[k].bandGoodsList[index].goodsNum= parseInt(shopnum)+1
          that.setData({
            pagedata:pagearr
          })
        }
      })
      let allprices = that.data.allprice+parseInt(e.currentTarget.dataset.price)
      that.setData({
        allprice:allprices
      }) 
  },

  // 关闭弹窗
  closeloding:function(){
    console.log("000")
    wx.hideLoading({
      success: (res) => {},
    })
  }


})