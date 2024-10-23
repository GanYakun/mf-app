var api = require("../../utils/api.js")
var app = getApp()
import {
  calculationfun
} from '../../utils/Heightset' //es6
var WxParse = require("../../wxParse/wxParse.js")
import tool from "../../utils/func-utils"
import pageRote from "../../utils/page-route"
import requestCenter from '../../http/request-center'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndexClick: 0,
    imgurl: app.globalData.imgur,
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    tabIndexHeight:app.globalData.tabIndexHeight,
    tabList: [],
    swiper: {
      list: [],
      current: 0,
      items: 4
    },
    currentIndex: 0,
    current: 0,
    imgur: app.globalData.imgur,
    searchOption: '',
    PageStart: 1,
    //点击下一页和上一页时才会有动画效果
    fromTap: false,
    currentStyleIndex: 0,
    IsItBefore: false, //判断是向前滑动还是向后滑动
    brandId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('页面参数', options)
    var newsClassId = options.ids ? options.ids : options.newsClassId
    var sharePageData = options.sharePageData ? JSON.parse(options.sharePageData) : ''
    // 证明是分享进来的
    if (options.status == 1) {
      this.setData({
        newsClassId: newsClassId,
        id: sharePageData.id
      })
      var objectId = sharePageData.objectId
    } else {
      this.setData({
        newsClassId: newsClassId,
        id: options.id,
        extendData: options.extendData == '{}' ? '' : (options.extendData ? options.extendData : '')
      })
      var objectId = options.objectId
    }
    this.first(objectId)
    this.tabList()
    this.shaarePageData()

  },

  //品牌检索项
  async brandScr(){
    //查询品牌搜索项
    let params = {
      searchCode:'brand4'
    }
    let getSrarchOptionsBySearchCode = await requestCenter.getSrarchOptionsBySearchCode(params)
    getSrarchOptionsBySearchCode.unshift({
      id:'',
      searchName:'全部'
    })
    
    try {
      var extendData =JSON.parse(this.data.extendData)
    } catch (error) {
      app.log('brandScr error',error)
      var extendData =this.data.extendData
    }

   
    let findCurrent
    if(extendData&&extendData.searchOption){
      let arr = extendData.searchOption.split(',')
      for (let i = 0; i < arr.length; i++) {
        findCurrent = getSrarchOptionsBySearchCode.findIndex(obj=>obj.id==arr[i])

        if(findCurrent!=-1){
          break;
        }
      }
    }
    console.log(findCurrent)
    this.setData({
      brandId:findCurrent&&findCurrent!=-1?getSrarchOptionsBySearchCode[findCurrent].id:'',
      brandArr:getSrarchOptionsBySearchCode
    })
  },

  //存入分享时需要用到参数
  shaarePageData: function () {
    this.setData({
      shaarePageData: JSON.stringify({
        id: this.data.id ? this.data.id : '',
        objectId: this.data.objectId ? this.data.objectId : ''
      })
    })
  },


  //  获取tab列表
  tabList: function () {
    var that = this
    var newsid = that.data.id
    if (!newsid) {
      try {
        var newsid = JSON.parse(that.data.extendData).searchOption
      } catch {
        console.log('抛出异常')
        var newsid = that.data.id
      }
    }
    console.log(newsid)
    newsid = newsid?newsid.split(','):undefined
    var data = {
      searchCode: 'kongjian'
    }
    api.request('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode', data, 'GET', function (e) {
      console.log(e, 'tab请求结果')
      e.data.unshift({
        searchName: '全部',
        id: null
      })
      if(newsid){
        for(let i = 0;i<newsid.length;i++){
          var curIndex = e.data.findIndex(obj => obj.id == newsid[i]) == -1 ? 0 : e.data.findIndex(obj => obj.id == newsid[i])
          if(curIndex&&curIndex!=-1){
            break;
          }
        }
      }else{
        var curIndex = 0
      }
     
      that.setData({
        tabList: e.data,
        indexs: curIndex,
        scrollToId:'item'+curIndex
      })

    })
    this.brandScr()

  },
  // 点击tab切换
  OnTabTap: function (e) {
    var that = this
      this.setData({
        scrollToId:'item'+e.currentTarget.dataset.index
      })
    var that = this
    var tabList = that.data.tabList
    var index = e.currentTarget.dataset.index
    var id = tabList[index].id
    that.setData({
      indexs: index,
      // seriesId:'series'+index,
      id: id,
      scroll_top: 0,
     
    })
    that.first()
    this.shaarePageData()
   
  },

  //tab切换方法
  OnTabTapfun: function (e) {
    console.log('非点击的切换',e)
    var that = this
    //用来自动切换一级位置
    this.setData({
      scrollToId:'item'+e
    })
    var tabList = that.data.tabList
    var index = e
    var id = tabList[e].id
    that.setData({
      indexs: index,
      // seriesId:'series'+index,
      id: id,
      scroll_top: 0
    })
    that.first()
    this.shaarePageData()
  },

  first: function (objectId) {
    objectId = objectId&&objectId!='null'?objectId:''
    var that = this
    var id = that.data.id
    if (id) {
      var extendData = {
        searchOption:this.data.brandId?(this.data.brandId+','+id):id,
      }
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData: JSON.stringify(extendData)
      }
    } else {
      let extendData = this.data.extendData||{}
      try {
        extendData = JSON.parse(extendData)
      } catch (error) {
        app.log('json转换 extendData',error)
        extendData = extendData
      }
      console.log(extendData)
      if(extendData.searchOption&&this.data.brandId){
        extendData.searchOption = extendData.searchOption+','+this.data.brandId
      }else if(!extendData.searchOption&&this.data.brandId){
        extendData.searchOption = this.data.brandId
      }
      if(objectId){
        extendData.searchOption = extendData.searchOption?extendData.searchOption+','+objectId:objectId
      }
      
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData: extendData
      }
    }
    if (JSON.stringify(data.extendData) === '{}') {
      data.extendData=''
    }
    api.newget('/rest/newsClass/getPageModel', data, 'GET', async function (e) {
        if (objectId && objectId != 'null') {
          var advcurIndex = e.data.list.findIndex(obj => obj.id == objectId)
          if (advcurIndex == -1) {
            let data = {
              newsClassId: that.data.newsClassId,
              objectId: objectId
            }
            let model = await that.DoesThisDataExist(data)
            e.data.list.unshift(model.data)
            that.setData({
              isDoesThisDataExistObjectId: objectId,
            })
            var advcurIndex = 0
          }
        } else {
          var advcurIndex = 0
        }
        let caseIndex = that.data.IsItBefore ? e.data.list.length-1 : advcurIndex
        that.setData({
          'swiper.list': e.data.list,
          TopTitle: e.data.newsClass.name,
          current: that.data.IsItBefore ? e.data.list.length-1 : advcurIndex,
          currentIndex: that.data.IsItBefore ? e.data.list.length-1 : advcurIndex,
            seriesId:'series'+0,
          webNextPage: e.data.webNextPage,
          // currentStyleIndex: that.data.IsItBefore ? (e.data.list.length-4<0?0:e.data.list.length-4): advcurIndex
          currentStyleIndex: that.data.IsItBefore ? (e.data.list.length-4<0?0:e.data.list.length-4): advcurIndex>e.data.list.length-4?(e.data.list.length-4<0?0:e.data.list.length-4):advcurIndex,
          // 用于收藏定制家具案例
          caseMessage: {
            isCollect:e.data.list.length>0?e.data.list[caseIndex].isCollect:false,  //是否收藏
            collectionId:e.data.list.length>0?e.data.list[caseIndex].id:0,      //案例id
            collectionType: 'customFurn', //收藏的类型 用于区分收藏的是案例还是效果图还是产品
            newsClassId: that.data.newsClassId,  //类目id
            caseIndex:caseIndex,   //定制家具的案例下标
            customList:e.data.list
        }
        })
        that.countDown(e.data.list)
        try {
          var article = e.data.list[that.data.current].articleText
        } catch {
          var article = ''
        }
        if (article) {
          WxParse.wxParse('article', 'html', article, that, 5);
        } else {
          that.setData({
            article: ''
          })
        }

    })
  },

  //广告图跳转时  存在该条数据不在第一页时的情况处理
  DoesThisDataExist: function (data) {
    return new Promise((reslove, reject) => {
      api.newget('/rest/newsClass/getModel', data, 'GET', function (res) {
        if (res) {
          reslove(res)
        } else {
          reject('400')
        }
      })
    })
  },


  //查询定制家具的限时倒计时
  countDown: function (e) {
    let current = this.data.current
    let list = this.data.swiper.list > 0 ? this.data.swiper.list : e
    console.log(list)
    console.log(current)
    try {
      if (list[current].endTime) {
        let endTime = list[current].endTime.replace(/-/g, '/')
        let end_str = Date.parse(endTime);
        var end_date = end_str - Date.parse(new Date())
        console.log(end_date)
        this.setData({
          time: end_date
        })
      }
      console.log('抛出异常')
    } catch {

    }
  },

  // 点击分类列表滑动切换
  onSelectTap: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      seriesId:'series'+index,
      objectId: this.data.swiper.list[index].id,
      scroll_top: 0,
      ['caseMessage.isCollect']:this.data.swiper.list[index].isCollect,
      ['caseMessage.collectionId']:this.data.swiper.list[index].id,
    })
    var article = this.data.swiper.list[index].articleText ? this.data.swiper.list[index].articleText : ''
    WxParse.wxParse('article', 'html', article, that, 5);

  },

  // 点击分类列表滑动切换 非按钮方法
  onSelectTapFun: function (e) {
    console.log(e)
    var that = this
    var index = e
    this.setData({
      currentIndex: e,
      current: index,
      objectId: that.data.swiper.list[e].id,
      scroll_top: 0,
      currentIndex:index
    })
    console.log(that.data.swiper.list[e].articleText)
    var article = that.data.swiper.list[e].articleText ? that.data.swiper.list[e].articleText : ''
    WxParse.wxParse('article', 'html', article, that, 5);
  },
  // 详情滑动切换
  tabChange: function (e) {
    let that = this
    let current = e.detail.current
    this.PageRichtext(e.detail.current)
    this.setData({
      currentIndex: current,
      current: current,
      seriesId:'series'+current
    })
    if (current == this.data.swiper.list.length - 1) {
      setTimeout(function () {
        that.setData({
          istabChangeSiton: true
        })
      }, 1000)
    }
    this.shaarePageData()

    var currentIndex = that.data.currentIndex
    var len = this.data.swiper.list.length
    that.setData({
      currentStyleIndex: currentIndex > len - 4 ? (len - 4 > 0 ? len - 4 : 0) : currentIndex
    })
  },
  // 判断是否切换下一个一级分类

  tabChangeSiton: tool.debounce(function (e) {
    console.log("tabChangeSiton", e)
    var dx = e[0].detail.dx
    app.log('pages/customized_home/customized_home 页面  indexs',this.data.indexs)
    if (this.data.indexs == 0) {
      if (dx > 0) {
        let searchOption = this.data.swiper.list[this.data.currentIndex].searchOption
        let index = this.data.tabList.findIndex(obj => obj.id == searchOption)
        app.log('pages/customized_home/customized_home 页面 tabChangeSiton的index',index)
        this.OnTabTapfun(index == -1 ? 1 : index)
        return
      }

    }
    if (this.data.distance) {
      this.setData({
        distance: false
      })
      return
    }

    if (dx == 0) {
      console.log(this.data.swiper.list.length)
      if (this.data.swiper.list.length <= 1) {

      } else {
        if (this.data.currentIndex == this.data.swiper.list.length - 1) {
          this.OnTabTapfun(this.data.indexs + 1)
          this.setData({
            IsItBefore: false
          })
        } else if (this.data.currentIndex == 0 && this.data.indexs > 0) {
          this.OnTabTapfun(this.data.indexs - 1)
          this.setData({
            IsItBefore: true
          })
        }
      }
    }

    this.setData({
      ['caseMessage.isCollect']:this.data.swiper.list[this.data.currentIndex].isCollect,
      ['caseMessage.collectionId']:this.data.swiper.list[this.data.currentIndex].id,
    })
  }),


  //  点击箭头切换上一个
  prevImg: function (e) {
    let that = this
    let current = e.currentTarget.dataset.current
    let swiperLen = e.currentTarget.dataset.swiperlen
    console.log(current)
    that.setData({
      currentIndex: current - 1 < 0 ? 0 : current - 1,
      current: current - 1 < 0 ? 0 : current - 1,
    })
    var currentIndex = that.data.currentIndex
    var len = this.data.swiper.list.length
    that.setData({
      currentStyleIndex: currentIndex > len - 4 ? (len - 4 > 0 ? len - 4 : 0) : currentIndex
    })
  },
  //  点击箭头切换下一个
  nextImg: function (e) {
    let that = this
    let current = e.currentTarget.dataset.current
    let swiperLen = e.currentTarget.dataset.swiperlen
    let len = e.currentTarget.dataset.len
    console.log(current)
    that.setData({
      currentIndex: current + 1 > swiperLen ? current : current + 1,
      current: current + 1 < len ? current + 1 : current,
      currentIndexClick: current + 1 < len ? current + 1 : current
    })
    var currentIndex = that.data.currentIndex
    var len1 = this.data.swiper.list.length
    that.setData({
      currentStyleIndex: currentIndex > len1 - 4 ? (len1 - 4 > 0 ? len1 - 4 : 0) : currentIndex
    })
  },

  //图片预览
  previewImage: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var imgurls = e.currentTarget.dataset.imgurls
    var imgurl = this.data.imgurl
    var imgarr = []
    imgurls.forEach((v, k) => {
      imgarr.push(imgurl + v)
    });
    wx.previewImage({
      current: imgarr[index], // 当前显示图片的http链接
      urls: imgarr // 所有要预览的图片的地址集合 数组形式
    })
  },


  // 富文本切换
  PageRichtext: function (e) {
    let that = this
    var article = that.data.swiper.list[e].articleText ? that.data.swiper.list[e].articleText : ''
    WxParse.wxParse('article', 'html', article, that, 5);
  },



  //一元下定功能
  async custom_btn(e) {
    await app.obtaintoken()
    //点击按钮判断是否登陆
    if (!app.globalData.token) {
      app.UserLoginToClick()
      return false
    }
    let index = e.currentTarget.dataset.index
    let swiper = this.data.swiper.list[index]
    console.log(swiper.depositPrice)
    let parameter = {
      depositPrice: swiper.depositPrice,
      CaseName: swiper.title,
      packagePrice: swiper.packagePrice,
      endTime: swiper.endTime,
      limitedNumber: swiper.limitedNumber,
      id: swiper.id,
      type: 'tWebCustomFurn',
      depositImagePath: swiper.depositImagePath,
      appointTitle: swiper.appointTitle, //案例自定义标题
    }
    wx.navigateTo({
      url: '../../xpages/byoneyuan/byoneyuan?parameter=' + encodeURIComponent(JSON.stringify(parameter)),
    })
  },

  onShareAppMessage: function () {
    console.log('分享')
    this.setData({
      test: '分享时的测试'
    })
  },


  //预览图片
  topic_preview: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var imgArr = e.currentTarget.dataset.imgarr;
    var arr = []
    imgArr.forEach((v, k) => {
      arr.push(this.data.imgur + v)
    });
    wx.previewImage({
      current: arr[index], // 当前显示图片的http链接
      urls: arr // 所有要预览的图片的地址集合 数组形式
    })
  },

  //二级分类加载其他数据
  secondLevel(e) {
    var that = this
    var currentIndex = that.data.currentIndex
    var len = this.data.swiper.list.length
    // that.setData({
    //   currentIndex: currentIndex > len - 4 ? (len-4 > 0 ? len : 0) : currentIndex
    // })
    return
    if (e.detail.current > this.data.swiper.list.length - 5 && this.data.webNextPage) {
      var data = {
        start: this.data.PageStart + 1,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
      }
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if (e.code == 200) {
          that.setData({
            'swiper.list': that.data.swiper.list.concat(e.data.list),
            // 'swiper.list': e.data.list,
            webNextPage: e.data.webNextPage,
            PageStart: that.data.PageStart + 1,
          })
          console.log(that.data.swiper.list.concat(e.data.list).length)
          console.log(e.data.list.length)
          // that.onSelectTapFun(that.data.swiper.list.length - e.data.list.length)
          // that.setData({
          //   currentIndex: that.data.swiper.list.length - e.data.list.length
          // })
        }
      })
    }
    console.log(e.detail.current)

  },
  

  secondAnimationFinish: function (e) {
    var that = this
    if(!this.data.webNextPage){
      return false
    }
      if (!this.data.webNextPage&&this.data.yesTapChange) {
        this.OnTabTapfun(this.data.indexs + 1)
        return
      }
      var data = {
        start: this.data.PageStart + 1,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData:{searchOption:this.data.id?this.data.id:''}
      }
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if (e.code == 200) {
          var isDoesThisDataExistObjectId = that.data.isDoesThisDataExistObjectId
          if (isDoesThisDataExistObjectId) {
            var index = e.data.list.findIndex(obj => obj.id == isDoesThisDataExistObjectId)
            if (index != -1) {
              e.data.list.splice(index, 1)
            }
          }
          that.setData({
            'swiper.list': that.data.swiper.list.concat(e.data.list),
            // 'swiper.list': e.data.list,
            webNextPage: e.data.webNextPage,
            PageStart: that.data.PageStart + 1,
          })
          // that.onSelectTapFun(that.data.swiper.list.length - e.data.list.length)
        }
      })
  },

  //二级分类只有一个时的判断
  touchStart: function (e) {
    this.data.touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    this.data.touchDotY = e.touches[0].pageY;
  },
 
  touchEnd: function (e) {
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - this.data.touchDotX;
    let tmY = touchMoveY - this.data.touchDotY;
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX<0){
          console.log("左滑=====")
          this.OnTabTapfun(this.data.indexs + 1)
          this.data.distance = true
        }else{
          console.log("右滑=====")
          this.OnTabTapfun(this.data.indexs - 1)
          this.data.distance = true
        }
      }
      if (absY > absX * 2 && tmY<0) {
        console.log("上滑动=====")
      }

  },
  //二级分类只有一个的时候判断结束
  SlidingJudgment: function (e) {
    console.log(e)
    this.data.clientX = e.changedTouches[0].clientX
    // this.OnTabTapfun(this.data.indexs-1)
  },
  SlidingJudgmentend: function (e) {
    console.log(e)
    console.log(this.data.clientX)
    var distance = e.changedTouches[0].clientX - this.data.clientX
    console.log(distance)
    this.data.distance = distance
    if (distance > 2) {
      this.OnTabTapfun(this.data.indexs - 1)
    } else if(distance<0){
      this.OnTabTapfun(this.data.indexs + 1)
    }
  },



  collection:function(e){
    app.log('组件绑定的收藏事件pages/index/index', e)
    this.setData({
      ['caseMessage.isCollect']: e.detail.isCollect,
      ['swiper.list['+this.data.currentIndex+'].isCollect']:e.detail.isCollect
    })
  },

  //定制家具品牌的广告轮播图
  wxBannerTap(event){
    let newPageRote = new pageRote()
    let index =event.currentTarget.dataset.index
    let list = event.currentTarget.dataset.list
    let params={
      eventType: 'brandBanner',
      position: index?index:0,
      source: list
    }
    newPageRote.onAction(params)
  },

  //品牌筛选点击事件
  brandItemTap(event){
    let index = event.currentTarget.dataset.index
    let brandArr = this.data.brandArr
    let item = brandArr[index]
    this.setData({
      brandId:item.id
    })
    this.first()
  },
  
  newGetPageModel(){
    let params={

    }
    let getPageModel = requestCenter.getPageModel(params)
  }

})