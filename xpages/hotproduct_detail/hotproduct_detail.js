// xpages/classification/classification.js
var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from "../../http/request-center"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
    productlists: [], 
    prolists: '',
    isallshopfenlei: 1,
    extendData:{},
    imgurl: app.globalData.imgur
  },

  // 商品详情
  details: function (e) {
    console.log("pppp", e)
    // wx.navigateTo({
    //   url: '../shop/shop',
    // })
  },


  //确认事件
  _success(e) {
    console.log('组件传到页面的参数',e)
    let that = this
    that.setData({
      typeId:e.detail.cid ? e.detail.cid : e.detail.extendData.cid,           //分页处理用到
      tapId:e.detail.extendData.firstid ? e.detail.extendData.firstid : (e.detail.cid ? e.detail.cid : e.detail.extendData.cid),
      xl:false,
      jg:false,
      extendData: {
        searchClass: e.detail.extendData.searchClass,
        brandId: e.detail.extendData.brandId
      }
      // extendData:e.detail.extendData
    })
    let getChildLists = that.data.getChildLists
    let scrollChildIndex = 0
    for(let i=0; i<getChildLists.length; i++) {
      if(getChildLists[i].id == that.data.typeId) {
        scrollChildIndex = i
        break
      }
    }
    that.setData({
      scrollChildIndex: scrollChildIndex,
      scrollTop: 0
    })
    that.getXsqgListByPromotionsType()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('页面参数',options)
    let that = this
    var cname = options.cname
    that.setData({
      choice: [{
          searchOptionRootName: '产品分类'
        },
        {
          searchOptionRootName: options.cname
        }
      ],
      cname: cname
    })

    var cid = options.id?options.id:options.objectId
    that.setData({
      typeId: cid?cid:options.categoryId
    })
    var id = that.data.id

    var catItemStr = options.catItem ? options.catItem:""
    var catItem = null
    if(catItemStr) {
      catItem = JSON.parse(decodeURIComponent(catItemStr))
    }
    console.log('catItem',catItem)
    // else if(options.objectId){
    //   catItem = {id:options.objectId}
    // }
    console.log('页面参数catItem',catItem)
    that.setData({
      catItem: catItem,
      tapId: catItem.pid ? catItem.pid : catItem.id,
      searchId: catItem.pid ? catItem.pid : catItem.id,
    })
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        console.log(pageWindowHeight)
        that.setData({
          pageWindowHeight: pageWindowHeight,
          tabIndexHeight:app.globalData.tabIndexHeight,
          toptext: options.cname
        })
      }
    })
   that.getXsqgListByPromotionsType()
   let getChildListsId = options.id?options.id:options.categoryId
   let getChildListFather = await requestCenter.getChildList({parentId:0})
   let findIndex = getChildListFather.findIndex(obj => obj.id==getChildListsId)
   let params = {
      parentId:findIndex==-1?0:(getChildListsId?getChildListsId:0)
   }
  let  getChildLists = await requestCenter.getChildList(params)
  if(!getChildLists) {
    getChildLists = []
  }
  getChildLists.unshift({
    cname:'全部',
    id:0,
    imagePath:app.globalData.ftpurl+'/plug-in/aykjmobile/images/all_hot.png',
  })
  {
    
  }
  let scrollChildIndex = 0
  for(let i=0; i<getChildLists.length; i++) {
    if(getChildLists[i].id == that.data.typeId) {
      scrollChildIndex = i
      break
    }
  }
  this.setData({
    getChildLists:getChildLists,
    scrollChildIndex: scrollChildIndex
  })
    // that.getHotDetailsList()
  },

  //查询本月爆款的列表
  getXsqgListByPromotionsType: function (e) {
    let that = this
    console.log('传的extendData的值', that.data.extendData)
    let data = {
      start: 1,
      pageSize: 12,
      cid: that.data.typeId,
      extendData:that.data.extendData
    }
    // /getHotDetailsList
    api.newget('/rest/tWebPromotionsControllerApi/storeRecommendList', data, 'GET', function(e){
    that.setData({
      productlists: e.data.list,
      productmessage: e.data
    })
  })
  },


  //向右滑动的点击事件
  async shutDown(e) {
    let index = e.currentTarget.dataset.index
    let getChildLists = this.data.getChildLists
    let id = getChildLists[index].id
    let extendData = {}
    let that = this
    // var query = wx.createSelectorQuery().in(this);//创建节点查询器
    // query.select('#item' + getChildLists[index].id).boundingClientRect();//选择id='#item' + selectedId的节点，获取节点位置信息的查询请求
    // query.select('#scroll-view').boundingClientRect();//获取滑块的位置信息
    // query.select('#scroll-view').scrollOffset();//获取页面滑动位置的查询请求
    // query.exec(function (res) {
    //   console.log(res)
    //   that.setData({
    //     scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
    //   });
    // });
    //查询本月爆款的列表 使用了新的接口封装方法
    let params = {
      start: 1,
      pageSize: 12,
      cid: id,
      extendData:extendData
    }
    let getHotDetailsList = await requestCenter.getStoreRecommendList(params)
    console.log('传过去的项：', getChildLists)
    that.setData({
      productlists: getHotDetailsList.list,
      productmessage: getHotDetailsList,
      typeId:id,
      tapId:id,
      searchId: id,
      isConfirm: false,
      catItem:getChildLists[index],
      scrollChildIndex: index,
      xl:false,
      jg:false,
      scrollTop: 0
    })
    
  },

  getHotDetailsList: function (e) {
    let that = this
    var lists = e.data
    lists.forEach(function (v, k) {
      var itemId = v.productId
      that.setData({
        itemId: itemId
      })
      console.log("productId", v.productId)
      // var id =this.data.id
      let productDetailData = {
        promotionsId: that.data.id,
        itemId: itemId
      }
      console.log("productDetailData", productDetailData)
      api.request('/rest/tWebMallItemSkuControllerApi/productDetail', productDetailData, 'GET', that.productDetail)

      // var prolists= that.data.prolists
      // prolists['itemId']=v.productId
      // that.setData({
      //   prolists:prolists
      // })
      // var productlists= that.data.productlists
      // let itemId = v.productId

      // productlists.push(itemId)
      // that.setData({
      //   productlists:productlists
      // })
    })
    // return

    // var id=e.data.id
    // this.setData({
    //   id: id
    // })
  },
  productDetail: function (e) {
    let that = this
    console.log(e, "11111111")
    var minOnePrice = e.data.minOnePrice
    var picUrl = e.data.picUrl
    var productName = e.data.productName
    var itemName = e.data.itemName
    console.log(productName, itemName, minOnePrice)
    that.setData({
      picUrl: picUrl,
      productName: productName,
      itemName: itemName,
      imgurl: app.globalData.imgur,
      minOnePrice: minOnePrice
    })

    var productlists = that.data.productlists
    let prolists = {
      itemName: e.data.itemName,
      minOnePrice: e.data.minOnePrice,
      productName: e.data.productName,
      picUrl: e.data.picUrl,
      itemId: that.data.itemId
    }
    productlists.push(prolists)
    that.setData({
      productlists: productlists,
      prolists: prolists
    })
    console.log(productlists, "009988776655443322")
    console.log(prolists, "009988776655443322")


  },


  /**
   * 
   * 筛选功能
   * 
   * 
   */
  powerDrawer: function (e) {
    this.hot.open()
    // this.drawer.powerDrawerzujian();
  },
  test:function(){
    this.drawer.powerDrawerzujian();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得drawer组件
    this.drawer = this.selectComponent("#drawer");
    this.hot = this.selectComponent("#hot")
  },

  getSelf: function (e) {
    console.log(e)
    this.setData({
      cname: e.data.cname,
      name: e.data.name
    })
  },


  /**
   * 
   * scroll-view滑动到底部触发的事件  分页
   *
   **/
  nextpage: function () {
   
    var that = this
    let productmessage = that.data.productmessage
    let nextstart = productmessage.start + 1
    let maxstart = productmessage.maxStart
    if (nextstart > maxstart) {
      console.log("本月爆款已经最后一页")
      wx.hideLoading({})
      wx.showToast({
        title: '已经是最后一页了',
        icon: 'none'
      })
    } else {
      var arr = that.data.productlists
      if(that.data.newcid){
        var cid = that.data.newcid
      }else{
        var cid = that.data.typeId
      }
      let data = {
        start: nextstart,
        pageSize: 12,
        cid: cid,
        extendData: !that.data.jg && !that.data.xl ? {} : that.data.extendData
      }
      api.newget('/rest/tWebPromotionsControllerApi/storeRecommendList', data, 'GET', function (e) {
       
        that.setData({
          productlists: arr.concat(e.data.list),
          productmessage: e.data
        })
      })
    }


  },

  //综合排序
  ComprehensiveSorting:function(){
    let that = this
    that.setData({
      sortIndex:0,
      xl:false,
      jg:false,
      extendData:{}
    })
    that.getXsqgListByPromotionsType()
  },
  
  //销量排序
  xl:function(e){
    let that = this
    var extendData ={}
    let parity = e.currentTarget.dataset.parity
    that.setData({
      xl:true,
      jg:false
    })
    if(parity){
      extendData['orderBy'] = " order by p.sales_count asc ";
      extendData['orderValue'] = "asc";
      that.setData({
        xlasc:true,
        xldesc:false,
        parity:false,
        extendData:extendData
      })
    }else{
      extendData['orderBy'] = " order by p.sales_count desc ";
      extendData['orderValue'] = "desc";
      that.setData({
        xlasc:false,
        xldesc:true,
        parity:true,
        extendData:extendData
      })
    }
   that.getXsqgListByPromotionsType()
    
  },
  
  //价格排序
  jg:function(e){
    let that = this
    var extendData ={}
    let parity = e.currentTarget.dataset.parity
    that.setData({
      jg:true,
      xl:false
    })
    if(parity){
      extendData['orderBy'] = " order by sku.one_price asc ";
        extendData['orderValue'] = "asc";
      that.setData({
        jgasc:true,
        jgdesc:false,
        parityjg:false,
        extendData:extendData
      })
    }else{
      extendData['orderBy'] = " order by sku.one_price desc ";
      extendData['orderValue'] = "desc";
      that.setData({
        jgasc:false,
        jgdesc:true,
        parityjg:true,
        extendData:extendData
      })
    }
   that.getXsqgListByPromotionsType()
    
  }


})