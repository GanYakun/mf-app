var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from '../../http/request-center'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
    sampletabsindex:-1,
    optionSearchId:-1,
    intoindex:'Vt'
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.log('活动详情页参数 activeOptions',options)
    
    
    
    ///////
    // options = {newsClassId: "155", NeworderType: "3", objectId: "undefined", categoryId: "3"}
    //////
    var that = this
    that.setData({
      pageStyle:options.NeworderType?options.NeworderType:options.categoryId,
      NeworderType:parseInt(options.NeworderType)
    })
    if(options.orderType){
      console.log('样品特卖的订单类型为',options.orderType)
      that.setData({
        NeworderType:parseInt(options.orderType),
      })
    }else{
      console.log('没有传递订单类型过来')
    }
    that.setData({
      imgur:app.globalData.imgur
    })
    let flashmobileblog = {
      promotionsType: options.NeworderType?options.NeworderType:options.categoryId,
    }
    api.request('/rest/tWebPromotionsControllerApi/getXsqgListByPromotionsType', flashmobileblog, 'GET', function (e) {
      if(!(e&&e.data&&e.data.length>0&&e.data[0].id)){
        wx.showToast({
          title: '活动已关闭',
          icon:'none'
        })
        let timer = setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
          clearTimeout(timer)
        }, 2000);
        return false
      }
      that.setData({
        ByItemId:e.data[0].id,
        promotionsContent:e.data[0].promotionsContent
      })
      if (e.data) {
        if(e.data[0].promotionsPeriod){
          that.setData({
            TopTitle:e.data[0].promotionsPeriod,
            
          })
        }else{
          if(e.data[0].promotionsType == 3){
            that.setData({
              TopTitle:'样品特卖'
            });
            
            
          }
        }
        if (that.data.NeworderType == 3) {
          that.getSrarchOptionsBySearchCode(options)
        } else {
          that.querycommodity()
        }
        
        
      } else { }
      
    })
    
  },

 //商品点击
 shopclick: function (e) {
   var that = this
  let objectId = e.currentTarget.dataset.pid
  let typeId = 0
  let itemName = e.currentTarget.dataset.itemname
  let productName = e.currentTarget.dataset.productname
  let cid = e.currentTarget.dataset.cid
  let typeofpurchase = 'dangqi'
  let NeworderType = that.data.NeworderType
  let promotionsId = that.data.ByItemId         //促销id
  wx.navigateTo({
    url: '../../xpages/shop/shop?objectId=' + objectId + "&typeId=" + typeId + "&productName=" + productName + '&itemName=' + itemName + '&cid=' + cid + '&typeofpurchase=' + typeofpurchase+'&NeworderType='+NeworderType+'&promotionsId='+promotionsId,
  })
},
//查询特卖分类
async getSrarchOptionsBySearchCode(options){
    let params = {
        searchCode:'yptmType'
    }
    let sampletabslist = await requestCenter.getSrarchOptionsBySearchCode(params)
    console.log(sampletabslist)
    this.setData({
        sampletabslist:sampletabslist
    })
    let e = {
        currentTarget:{
            dataset:{
                index:options.position
            }
        }
    }
    // let e = e.currentTarget.dataset.index = parseInt(options.position) - 1
    this.clicksampletabsitem(e)
    console.log("444444444444444",e)
    
},
// 点击分类
clicksampletabsitem(e){
    console.log(parseInt(e.currentTarget.dataset.index))
    if (parseInt(e.currentTarget.dataset.index) == -1) {
        this.setData({
            sampletabsindex:parseInt(e.currentTarget.dataset.index),
            intoindex:'Vt'
        })
        let dangqiactivity = {
            page:1,
            rows:7,
            promotionsId: this.data.ByItemId
          }
          let that = this
          api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
            that.setData({
              list:e.data,
              startpage:1
            })
          })
    } else {
        // let id = this.data.sampletabslist[parseInt(e.currentTarget.dataset.index)].id
        if (parseInt(e.currentTarget.dataset.index) <= 1) {
          this.setData({
              optionSearchId : this.data.sampletabslist[parseInt(e.currentTarget.dataset.index)].id,
              sampletabsindex:parseInt(e.currentTarget.dataset.index),
              intoindex:'Vt'
        })
        } else {
          this.setData({
              optionSearchId : this.data.sampletabslist[parseInt(e.currentTarget.dataset.index)].id,
              sampletabsindex:parseInt(e.currentTarget.dataset.index),
              intoindex:'V' + (parseInt(e.currentTarget.dataset.index) - 2)
          })
        }
        
        // console.log(this.data.intoindex)
        let dangqiactivity = {
            page:1,
            rows:7,
            promotionsId: this.data.ByItemId,
            optionSearchId:this.data.optionSearchId
          }
          let that = this
          api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
            that.setData({
              list:e.data,
              startpage:1
            })
          })
    }
    
},
//商品信息查询
querycommodity(options){
    var that = this
    let dangqiactivity = {
        page:1,
        rows:7,
        promotionsId: that.data.ByItemId
      }
      api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
        that.setData({
          list:e.data,
          startpage:1
        })
      })
},
//滑动加载
scroll:function(){
    let that = this
    if (that.data.NeworderType == 3) {
      
      if (that.data.optionSearchId == -1) {
        let dangqiactivity = {
            page:that.data.startpage+1,
            rows:7,
            promotionsId: that.data.ByItemId
          }
          api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
            if(e.data.length>0){
              console.log(that.data.list)
              that.setData({
                list:that.data.list.concat(e.data),
                startpage:that.data.startpage+1
              })
            }else{
              wx.showToast({
                title: '已经没有数据了',
                icon:'none'
              })
            }
           
          })
    } else {
        let dangqiactivity = {
            page:that.data.startpage+1,
            rows:7,
            promotionsId: that.data.ByItemId,
            optionSearchId:that.data.optionSearchId
          }
          api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
            if(e.data.length>0){
              console.log(that.data.list)
              that.setData({
                list:that.data.list.concat(e.data),
                startpage:that.data.startpage+1
              })
            }else{
              wx.showToast({
                title: '已经没有数据了',
                icon:'none'
              })
            }
           
          })
    }
    } else {
      let dangqiactivity = {
        page:that.data.startpage+1,
        rows:7,
        promotionsId: that.data.ByItemId
      }
      api.newget('/rest/tWebPromotionsControllerApi/getDetailsListByItemId2', dangqiactivity, 'GET', function (e) {
        if(e.data.length>0){
          console.log(that.data.list)
          that.setData({
            list:that.data.list.concat(e.data),
            startpage:that.data.startpage+1
          })
        }else{
          wx.showToast({
            title: '已经没有数据了',
            icon:'none'
          })
        }
       
      })
    }
    
      
    

  console.log('触发滑动加载事件')
}


})