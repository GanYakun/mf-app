// pages/tab-classification/tab-classification.js
var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    TopTitle:'分类',
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    imgurl: app.globalData.imgur,
    ftpurl:app.globalData.ftpurl,
    // testImg:'',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.log('options',options)
    let ratio = 750 / wx.getSystemInfoSync().windowWidth;
    let scrollHeight = Math.ceil(wx.getSystemInfoSync().windowHeight * ratio);
    this.setData({
      scrollHeight:scrollHeight,
      tabIndexHeight:app.globalData.tabIndexHeight,
      isRecommended:options.isRecommended,
      paramsCid:options.cid
    })
    let data = {
      parentId: 0
    }
    api.newget('/rest/tWebMallItemCatControllerApi/getAllList', data, 'GET', this.getAllList)
    // this.switchRightTab()
    // 判断是否是首页更多跳过来的
    
   
  },
  switchRightTab: function (e) {
    // console.log("tab", e)
    // 获取item项的id，和数组的下标值 
    var index = e.target.dataset.index;
    console.log(index)
    if(index == 99){
      var id = 0 //类目id   首页为0
    wx.navigateTo({
      url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id
    })
    return false
    }
    if(this.data.lists[index].id == -1 || this.data.lists[index].id == -2) {
      //跳转特卖专区
      wx.navigateTo({
        url: this.data.lists[index].pagePath,
      })
      return
    }
    try{
      if(this.data.lists[index].mallItemCatEntityList[0].id != this.data.lists[index].id){
         this.data.lists[index].mallItemCatEntityList.unshift({
        cname:'全部',
         id: this.data.lists[index].id,
         imagePath:  this.data.lists[index].imagePath,
         parentCid: this.data.lists[index].id,
         pid: 0
      })
      this.setData({
        lists: this.data.lists,
      })
    }
    }catch{
      console.log('抛出异常')
      this.data.lists[index].mallItemCatEntityList.unshift({
        cname:'全部',
         id: this.data.lists[index].id,
         imagePath:  this.data.lists[index].imagePath,
         parentCid: this.data.lists[index].id,
         pid: 0
      })
      this.setData({
        lists: this.data.lists,
      })
    }
   
    this.setData({
      curIndex: index,
    })
   
    // let data = {
    //   parentId: 0
    // }
    // api.request('/rest/tWebMallItemCatControllerApi/getChildLists', data, 'GET', this.getChildLists)
  },
  //查询列表导航的回调
  getAllList: function (e) {
    let that = this
    console.log(e)
    if(e){
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(that.data.paramsCid)
      if(!that.data.paramsCid){
        e.data[0].mallItemCatEntityList.unshift({
          cname:'全部',
           id:e.data[0].id,
           imagePath: e.data[0].imagePath,
           parentCid: e.data[0].id,
           pid: 0
        })
      }
      let index = e.data.findIndex(obj => obj.id ==that.data.paramsCid )
      if(index != -1){
        e.data[index].mallItemCatEntityList.unshift({
          cname:'全部',
           id:e.data[index].id,
           imagePath: e.data[index].imagePath,
           parentCid: e.data[index].id,
           pid: 0
        })
      }
      this.setData({
        lists: e.data,
      })
      //是首页更多跳过来的
      if(this.data.isRecommended){
        this.setData({
          curIndex: e.data.length,
        })
        app.log('首页过来的e.data',e.data)
      }else if(this.data.paramsCid){
        let index = e.data.findIndex(obj => obj.id == this.data.paramsCid)
        this.setData({
          curIndex: index,
        })
      }
    }
    this.getHotProCategryList(e)
  },

  onShow: function (options) {
    // 分享结束时
    let that = this;
    that.setData({
      isPageShow: false
    })
  },

  /**
   * 
   * 监听页面隐藏
   * 
   */
  onHide(){
wx.hideLoading({
  success: (res) => {},
})
  },
  getChildLists: function (e) {
    console.log(e)
    this.setData({
      list: e.data,
      imgurl: app.globalData.imgur,
    })
  },

  //点击商品
  onGoodItemTap: async function (e) {
    // await app.obtaintoken()
    // if (!app.globalData.token) {
    //   app.UserLoginToClick()
    //   return false
    // }
    var lists = this.data.lists
    var curIndex = this.data.curIndex
    var index = e.currentTarget.dataset.position1
    var cname = e.currentTarget.dataset.cname
    var id = e.currentTarget.dataset.id
    var pid = e.currentTarget.dataset.pid
    var catItem = lists[curIndex].mallItemCatEntityList[index]
    var catItemStr = "{}"
    if(catItem) {
      catItemStr = encodeURIComponent(JSON.stringify(catItem))
    }
    if(pid == 0) {
      wx.navigateTo({
        url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id + '&catItem=' + catItemStr,
      })
    } else {
      wx.navigateTo({
        url: '../../xpages/classification/classification?id=' + id + "&cname=" + cname+'&ScreeningFloors='+1,
      })
    }
  },

  /**
   * 
   * 本月爆款的商品点击事件
   * 
   * 
   */
  hotproduct_detail:function (e) {
    var id = e.currentTarget.dataset.id
    var cname = e.currentTarget.dataset.cname
    
    wx.navigateTo({
      url: '../../xpages/hotproduct_detail/hotproduct_detail?id=' + id+ "&cname=" + cname
    })
  },
  
  /**
   * @Author gale
   * @Desc 获取本月爆款二级分类数据,并塞到一级类目中去
   */
  getHotProCategryList: function(e) {
    // if(this.data.lists[index].mallItemCatEntityList[0].id != this.data.lists[index].id){
    //   this.data.lists[index].mallItemCatEntityList.unshift({

    

    // console.log(this.data.lists[index])

    api.newget("/rest/tWebMallItemCatControllerApi/getChildLists", {parentId: 0}, "GET", (res) => {
      var mallItemCatEntityList = []
      if(res && res.data) {
        mallItemCatEntityList = res.data
      }
      for(var i=0; i<mallItemCatEntityList.length; i++) {
        mallItemCatEntityList[i].pid = mallItemCatEntityList[i].parentCid
        mallItemCatEntityList[i].parentCid = 0
      }
      mallItemCatEntityList.unshift({
        cname:'全部',
        id:0,
        parentCid:0,
        imagePath: app.globalData.ftpurl+'/plug-in/aykjmobile/images/all_hot.png',
      })
      var lists = this.data.lists || []

      lists.push({
        name:'展厅实物',
        id:0,
        imagePath: `${this.data.ftpUrl}/plug-in/aykjmobile/images/all_hot.png`,
        mallItemCatEntityList: mallItemCatEntityList
      })

      lists.push({
        id: -1,
        cname: "特卖专区",
        name: "特卖专区",
        pagePath: "/xpages/activitypage/activitypage?newsClassId=155&NeworderType=3&objectId=&categoryId=3&position=-1"
      })
      lists.push({
        id: -2,
        cname: "精选组合",
        name: "精选组合",
        pagePath: '/xpages/selected/selected?id=129&toptext=精选组合&extendData={"searchOption":"","designerId":""}&chioceid='
      })

      this.setData({
        lists: lists
      })
    },0)
  }
})