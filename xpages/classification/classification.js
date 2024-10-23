// xpages/classification/classification.js
var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from '../../http/request-center'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isallshopfenlei: 1, //判断筛选是否有产品分类
    hidindex: 0,
    isShop: false,
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    tabIndexHeight: app.globalData.tabIndexHeight, //  底部tab栏的高度
    heade: [{
      name: '综合'
    }, {
      name: '销量'
    }, {
      name: '价格'
    }, {
      name: '最新'
    }, {
      name: '筛选'
    }],
    extendData: {
      
    }, //设置检索条件为空

    //搜索组件
    saveoptions: [{
        name: "产品",
        newsClassId: 155
      },
      {
        name: "效果图",
        newsClassId: 147
      },
      {
        name: "毛坯房",
        newsClassId: 127
      },
      {
        name: "精装房",
        newsClassId: 128
      },
      {
        name: "全屋精选",
        newsClassId: 129
      }
    ],


    judgesub: true, //默认从大到小顺序排列
    chiocetext: '产品',
    componentData: {
      isShowSearch: true
    },
  },

  // 商品详情
  details: function (e) {
    app.log("商品详情", e)
  },





  //新版本组件绑定的确定
  _success: function (e) {
    var that = this
    that.setData({
      isRightClick:false
    })
    console.log('组件页面传过来的数据', e)
    if (!e.detail.typeid) {
      return false
    }
    let typeId = e.detail.typeid
    let topId = e.detail.shopid
    let isShop = e.detail.isShop
    console.log('组建传过来的id', typeId)
    let getChildList = that.data.getChildList
    let scrollChildIndex = 0
    for(let i=0; i<getChildList.length; i++) {
      if(typeId == getChildList[i].id) {
        scrollChildIndex = i
        break
      }
    }

    console.log('缓存extendData', that.data.extendData)
    
    var extendData = JSON.parse(e.detail.extendData || {})

    console.log(extendData)
    //如果有搜索的关键字
    if (that.data.extendData) {
      extendData.productName = that.data.extendData.productName
    }
    that.setData({
      shopids: typeId, //分页的时候用到
      topid: topId,
      isShop: isShop,
      extendData: extendData,
      searchid:typeId,
      scrollChildIndex: scrollChildIndex
    })

    let data = {
      start: 1,
      pageSize: 12,
      typeId: typeId,
      newsClassId: this.data.newsClassId,
      extendData: extendData,
    }
    api.newget('/rest/newsClass/getPageModel', data, 'GET', function (e) {
      if (!e.data) {
        wx.showToast({
          title: '内容数据出错',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
            success: function () {}
          })
        }, 1500)
        return false
      }
      that.setData({
        lists: e.data.list,
        list: e.data,
        nextStart: 1,
        scrollTop: 0
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    app.log('页面onload参数', options)

    //判断页面布局类型
    this.setData({
      type:options.type
    })
    //判断这个参数，为true则表示页面不可分享
    if(options.noShare){
      this.setData({
        qcappnoshare:true
      })
    }
    //如果有搜索关键字的话 搜索栏显示关键字
    if(options.extendData){
      this.setData({
        productName:JSON.parse(options.extendData).productName
      })
    }
    //设置分享标题
    if(options.cname&&options.cname!='全部'){
      this.setData({
        shareTitle:options.cname
      })
    }
    let scene = options.scene
    if (scene) {
      options.id = scene
    }
    let ScreeningFloors = options.ScreeningFloors
    let chioce = [{
        searchOptionRootName: '产品分类'
      },
      {
        searchOptionRootName: options.cname
      },
      {
        searchOptionRootName: '产品系列'
      }
    ]
    this.setData({
      choice: chioce,
      ScreeningFloors: ScreeningFloors //筛选需要显示的楼层
    })
    if (options.newsClassId == undefined) {
      var extendData = {
        extendData: ''
      }
      var id = options.id ? options.id : 0
    }
     else {
      console.log('搜索页面进来的或者广告图进来')
      var extendData = options.extendData ? options.extendData : {}
      // var id = 0
      var advObjectId = options.objectId&&options.objectId!='null'?options.objectId:''
      this.setData({
        isadvObjectId: advObjectId ? true : false
      })
      if (advObjectId) {
        var id = advObjectId
      } else {
        var id = options.orderType ? options.orderType : (options.NeworderType ? options.NeworderType : options.categoryId)
        if (id == 'undefined') {
          var id = options.categoryId
        }
      }
      this.setData({
        // extendData: extendData,
        searchWord:extendData,
        
      })
    }

    this.setData({
      shopids: id,
      imgurl: app.globalData.imgur,
      newsClassId: 155,
      searchid: id,
      typeId: id
    })
    let data = {
      newsClassId: 155,
      typeId: id,
      start: 1,
      pageSize: 12,
      extendData: extendData
    }
    app.log('所以说id是多少', id)
    api.newget('/rest/newsClass/getPageModel', data, 'GET', this.getPageModels)
    //顶部向右滑动的二级分类数据
    let params = {
      parentId: id
    }
    let locationList = await requestCenter.locationList(params)
    let getAllData = {
      parentId: 0
    }
    let getAllList = await requestCenter.getAllList(getAllData)
    locationList = locationList||[]
    for (var i = 0; i < locationList.length; i++) {
      let locaListFidId = locationList[i]
      if (locaListFidId) {
        var isGetAll = getAllList.find(obj => obj.id == locaListFidId.id)
        if (isGetAll ||id==638 ||id==698) {
          var getAll = isGetAll||id
          let getChildList = await requestCenter.getChildList({
            parentId: getAll.id||id
          })
          getChildList.unshift({
            cname: '全部',
            imagePath: getAll.imagePath,
            id: getAll.id||id
          })
          this.setData({
            getChildList: getChildList,
          })
        }else{
          //是一线主材等 栏目
          var isGetAll = getAllList.find(obj => obj.id == id)
          if(isGetAll){
            let getChildList = await requestCenter.getChildList({
              parentId: id
            })
            getChildList.unshift({
              cname: '全部',
              imagePath: isGetAll.imagePath,
              id:id
            })
            this.setData({
              getChildList: getChildList,
              shareTitle:isGetAll.name?isGetAll.name:isGetAll.cname
            })
            console.log(this.data.getChildList)
          }else{
            var getChildList = await requestCenter.getChildList({
              parentId: 0
            })
            getChildList.unshift({
              cname: '全部',
              imagePath: locaListFidId.imagePath,
              id: locaListFidId.id
            })
            this.setData({
              getChildList: getChildList
            })
          }
          
        }
        break;
      }
    }

   
    let fixedGetChildList = this.data.getChildList
    console.log(fixedGetChildList)
    if(!fixedGetChildList){
      return false
    }
    let fixedGetChildListIndex = fixedGetChildList.findIndex(obj =>obj.id == id)
    if(fixedGetChildListIndex != -1 &&fixedGetChildListIndex!=0 ){
       let fixedlist = fixedGetChildList[fixedGetChildListIndex]
       let fixedlistAll = fixedGetChildList[0]
     this.data.getChildList.splice(fixedGetChildListIndex, 1)
     this.data.getChildList.splice(0,1)
     this.data.getChildList.unshift(fixedlist)
     this.data.getChildList.unshift(fixedlistAll)
      // this.data.getChildList.splice(2,0,fixedGetChildList[fixedGetChildListIndex]);
      this.setData({
        getChildList:this.data.getChildList
      })
      return false
    }
    
    // api.newget('/rest/newsClass/getPageModel', data, 'GET', this.getPageModels)
    // //顶部向右滑动的二级分类数据
    // let locationList = await requestCenter.locationList({parentId: id})
    // app.log('locationList',locationList)
    // let getAllList = await requestCenter.getAllList({parentId: id})
    // app.log('getAllList',getAllList)
    // for (var i = 0 ;i <locationList.length; i++ ){
    //     // var isGetAll =locationList.find(obj => obj.id == id)
    //     // app.log('isGetAll',isGetAll)
    //   if(locationList[i].id == id){

    //   }else{
    //     let getAllList = await requestCenter.getAllList({parentId:0 })
    //       var imagePathData = getAllList.find(obj =>obj.id == id)
    //     if(locationList[i].id == 0){
    //       var getAll = locationList[i+1]
    //       break;
    //     }else{
    //       var getAll = locationList[i]
    //     }
    //     break;

    //   }
    // }
    // getAll=getAll?getAll:locationList[1]
    // app.log('getAll',getAll)
    // let getChildList = await requestCenter.getChildList({parentId:getAll.id})
    // getChildList.unshift({
    //   cname:'全部',
    //   imagePath:imagePathData.imagePath,
    //   id:getAll.id
    // })
    // this.setData({
    //   getChildList: getChildList
    // })
    // console.log('商品分类数据', getChildList)
  },

  //向右滑动的点击事件
  async shutDown(e) {
    this.setData({
      isRightClick:true,
      isShop: false,
      nextStart: 1,
      hidindex: 0
    })
    let index = e.currentTarget.dataset.index
    console.log(index)
    let getChildList = this.data.getChildList
    let id = getChildList[index].id
    let shareTitle = getChildList[index].name?getChildList[index].name:getChildList[index].cname
    let extendData = this.data.searchWord ? this.data.searchWord : {}
    app.log('xpages/classification/classification 页面 shutDown',extendData)
    let that = this
    let prarms = {
      newsClassId: 155,
      typeId: id,
      start: 1,
      pageSize: 12,
      extendData: extendData,
      
    }
    let getPageModel = await requestCenter.getPageModel(prarms)
    console.log('页面模型接口返回的数据', getPageModel)
    this.setData({
      lists: getPageModel.list,
      list: getPageModel,
      liston: getPageModel
    })

    this.setData({
      shopids: id,
      searchid:id,
      scrollChildIndex: index,
      scrollTop:0,
      shareTitle:shareTitle
    })
  },

  getPageModel: function (e) {
    if (e.data) {
      wx.hideLoading({})
    } else {
      wx.showToast({
        title: '内容数据出错',
        icon: 'none',
        duration: 1500
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
          success: function () {}
        })
      }, 1500)
      return false
    }
    var id = this.data.id
    // console.log('`````', e)
    this.setData({
      lists: e.data.list,
      list: e.data,
      id: id,
    })
  },
  getPageModels(e) {
    var id = this.data.id
    console.log(e)
    if (!e.data) {
      wx.showToast({
        title: '内容数据出错',
        icon: 'none',
        duration: 1500
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
          success: function () {}
        })
      }, 1500)
      return false
    }
    this.setData({
      lists: e.data.list,
      list: e.data,
      liston: e.data,
    })
  },

  /**
   * 
   * 点击头部排序和筛选
   * 
   * 
   */
  powerDrawer: function (e) {
    var that = this;
    // 处理点击销量和价格是否存在其他的筛选条件
    var PageExtendData = that.data.extendData
    try {
      PageExtendData = JSON.parse(PageExtendData)
    } catch {
      console.log('!!!抛出异常')
      PageExtendData = PageExtendData
    }
    let num = e.currentTarget.dataset.index
    if (num == 4) {
      // that.drawer.powerDrawerzujian();
      that.newscrren.open()
    } else {
      if (num == that.data.hidindex) {
        that.setData({
          judgesub: !that.data.judgesub
        })
      } else {
        that.setData({
          hidindex: num,
          judgesub: true
        })
      }
      that.setData({
        hidindex: num,

      })
      // successCaseOrederBy:''
      // 销量
      if (num == 1) {
        PageExtendData["opt"] = 'xl'
        if (that.data.judgesub) {
          PageExtendData["orderBy"] = 'order by sales_count desc'
          PageExtendData["orderValue"] = 'desc'
        } else {
          PageExtendData["orderBy"] = 'order by sales_count asc'
          PageExtendData["orderValue"] = 'asc'
        }
      }
      //价格
      else if (num == 2) {
        PageExtendData["opt"] = 'jg'
        if (that.data.judgesub) {
          PageExtendData["orderBy"] = 'order by one_price asc'
          PageExtendData["orderValue"] = 'asc'
        } else {
          PageExtendData["orderBy"] = 'order by one_price desc'
          PageExtendData["orderValue"] = 'desc'
        }
      }
      // 根据最新排序 
      else if (num == 3) {
        PageExtendData["opt"] = 'zx'
        if (that.data.judgesub) {
          PageExtendData["orderBy"] = 'order by i.create_date desc'
          PageExtendData["orderValue"] = 'desc'
        } else {
          PageExtendData["orderBy"] = 'order by i.create_date asc'
          PageExtendData["orderValue"] = 'asc'
        }
      } else if (num == 0) {
        PageExtendData["opt"] = ''
        PageExtendData["orderBy"] = ''
        PageExtendData["orderValue"] = ''
      }

      let data1 = {
        start: 1,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        typeId: that.data.shopids,
        extendData: JSON.stringify(PageExtendData),
      }
      api.newget('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
        if (e) {
          that.setData({
            lists: e.data.list,
            list: e.data,
            liston: e.chuancon,
            extendData: PageExtendData
          })
        }

      })
    }
  },
  getSelf: function (e) {
    console.log(e)
    this.setData({
      cname: e.data.cname,
      name: e.data.name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得drawer组件
    // this.drawer = this.selectComponent("#drawer");
    this.newscrren = this.selectComponent("#newscrren")
  },




  /**
   * 
   * 滑动到底部的事件 分页
   * 
   */
  slideusage: async function () {
    console.log(this.data.lock)
    // if(!this.data.lock){
      // this.setData({
      //   lock:true
      // })
      // console.log('下一页', nextStart)
      let nextStart = this.data.nextStart?this.data.nextStart+1:2
      console.log('下一页', nextStart)
      this.setData({
        nextStart:nextStart
      })
      let nexPageData = await this.nexPageData(nextStart)
    // }
   
   
    
  },

  // 分页加载方法
    nexPageData(nextStart=1){
      console.log('传过来的下一页', nextStart)
      return new Promise((resove,reject)=>{
        var arr = this.data.list
        let extendData = this.data.extendData?this.data.extendData:{}  //筛选条件
        if(this.data.productName){ //查询是否有搜索关键词
          extendData.productName=this.data.productName
        }
        if (arr.webNextPage) {
          console.log('来这里--->')
          var startnum = arr.start + 1
          let data = {
            start: nextStart,
            pageSize: 12,
            typeId: this.data.shopids,
            newsClassId: this.data.newsClassId,
            extendData: this.data.extendData,
          }
          console.log("nexPageData", data)
          api.newget('/rest/newsClass/getPageModel', data, 'GET',  (e)=> {
            var arrlist = this.data.lists.concat(e.data.list)
            var xiugai = 'list.webNextPage'
            var xiugai1 = 'list.start'
            this.setData({
              lists: arrlist,
              [xiugai]: e.data.webNextPage,
              [xiugai1]: startnum,
              lock:false
            })
            resove('')
          })
        } else {
          resove('')
          this.setData({
            lock:false
          })
          wx.showToast({
            title: '已经到底了',
            icon: 'none',
            duration: 1500
          })
        }
        this.setData({
          lock:false
        })
      })
    
    },

  /**
   * 
   * 搜索事件
   * 
   */
  searchword: function (e) {
    let that = this
    let extendData = that.data.extendData
    if (extendData) {
      try {
        var DataExtendData = JSON.parse(that.data.extendData)
      } catch {
        var DataExtendData = that.data.extendData
      }
      console.log(DataExtendData)
      console.log(e.detail.extendData.productName)

      DataExtendData.productName = e.detail.extendData.productName
    } else {
      var DataExtendData = {}
      DataExtendData.productName = e.detail.extendData.productName
    }
    let data = {
      start: 1,
      pageSize: 12,
      typeId: that.data.shopids,
      newsClassId: this.data.newsClassId,
      extendData: DataExtendData
    }
    that.setData({
      productName: e.detail.extendData.productName
    })
    api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
      if (e.data) {
        wx.hideLoading({})
      } else {
        wx.showToast({
          title: '内容数据出错',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
            success: function () {}
          })
        }, 1500)
        return false
      }
      that.setData({
        lists: e.data.list,
        list: e.data,
        scrollTop:0
      })
    })
  },

  /**
   * 
   * 监听页面隐藏
   * 
   */
  onHide: function () {
    wx.hideLoading({})
    // app.UserLogin()
  },
  onShow(){
    this.setData({
      isPageShow:false
    })
  }



})