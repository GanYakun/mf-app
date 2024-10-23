// xpages/server-shop/server-shop.js
import requestCenter from "../../http/request-center"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    imgUrl:app.globalData.imgur
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    let typeId = options.categoryId
    this.warmHeart(1,typeId)
  },

  //查询暖心服务列表
  async warmHeart(start=1,typeId){
    let params = {
      newsClassId: 155,
      typeId: typeId||this.data.typeId,
      start: start,
      pageSize: 100000,
    }
    let getPageModel = await requestCenter.getPageModel(params)
    console.log('extendName', getPageModel.extendName)
    this.setData({
      start:start,
      list:getPageModel.list,
      nextPage:getPageModel.webNextPage,
      extendName:getPageModel.extendName
    })
  },

  //点击单个服务
  serverDetail(e){
    let index = e.currentTarget.dataset.index
    let item = this.data.list[index]
    wx.navigateTo({
      url: '/xpages/shop/shop?objectId=' + item.itemId + "&typeId=" + item.typeId+"&productName="+item.productName+'&cid='+item.cid+'&NeworderType='+'',
    })
  }

})