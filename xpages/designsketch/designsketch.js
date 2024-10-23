var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from "../../http/request-center"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    tabindex: 999,
    hidindex: 0,
    chuangtj: '',
    judgesub: true, //默认从大到小顺序排列
    heade: [{
      name: '综合'
    }, {
      name: '人气'
    }, {
      name: '浏览'
    }, {
      name: '最新'
    }, {
      name: '筛选'
    }],
    extendData: {
      searchOption: '',
      designerId: '',
      descOrAsc: '',
    },
    showModalStatus: false,
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
    chiocetext: '效果图',
    componentData: {
      isShowSearch: true
    },
    designerId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.newsClassId == undefined) {
      var oldclassidid = options.id
      var extendData = {
        extendData: ''
      }
    } else {
      var oldclassidid = options.newsClassId,
        extendData = options.extendData ? options.extendData : {}
    }
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        console.log(pageWindowHeight)
        this.setData({
          pageWindowHeight: pageWindowHeight,
          imgur: app.globalData.imgur,
          newsClassId: oldclassidid,
          toptext: options.toptext
        })
      }
    })

    let data1 = {
      start: 1,
      pageSize: 12,
      newsClassId: oldclassidid,
      extendData: extendData
    }
    api.newget('/rest/newsClass/getPageModel', data1, 'GET', this.getPageModel)

    let data2 = {
      newsClassId: options.id ? options.id : options.newsClassId
    }
    //筛选的数据
    api.request('/rest/tWebSearchOptionControllerApi/getRootByNewsClassId', data2, 'GET', this.getRootByNewsClassId)

  },
  //筛选的数据回调函数
  getRootByNewsClassId: function (e) {
    e.data.push({
      searchOptionRootName: '团队',
      type:'designTeam'
    })
    this.setData({
      choice: e.data
    })
  },

  //回调函数
  getPageModel(e) {
    if (e) {
      wx.hideLoading({
        success: (res) => {},
      })
    }
    this.setData({
      pagelist: e.data,
      content: e.data.list,
      // totalPageCount:e.data.totalPageCount,
      start: e.data.start,
      TopTitle: e.data.newsClass.name

    })

  },

  //跳转到装修效果图的详细信息
  cintentimg(e) {
    let id = e.currentTarget.dataset.id
    let newsClassId = this.data.newsClassId
    let caseTitle = e.currentTarget.dataset.casetitle
    wx.navigateTo({
      url: '../../xpages/land/land?newsClassId=' + newsClassId + '&objectId=' + id + '&casetitle=' + caseTitle,
    })
  },

  // 滑动到底部加载的事件
  slideusage() {
    var that = this;
    if (that.data.pagelist.maxStart > that.data.pagelist.start) {


      var extendData = that.data.extendData
      let starts = that.data.pagelist.start + 1
      let data1 = {
        start: starts,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData: JSON.stringify(extendData)
      }
      api.newget('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
        if (e) {
          wx.hideLoading()
        }
        let shuaxinstart = 'pagelist.start'
        that.setData({
          content: that.data.content.concat(e.data.list),
          [shuaxinstart]: starts
        })

      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1500
      })
    }

  },

  chioce: function (e) {
    let index = e.currentTarget.dataset.index
    let flags = e.currentTarget.dataset.flag
    let arr = this.data.choice
    arr[index].flag = !flags
    this.setData({
      choice: arr,
      tabindex: index
    })


  },


  //顶部点击事件
  powerDrawer: function (e) {
    var that = this;
    let num = e.currentTarget.dataset.index
    if (num == 4) {
      that.drawer.powerDrawerzujian();
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
      // 人气
      if (num == 1) {

        if (that.data.judgesub) {
          var extendData = {
            searchOption: that.data.extendData.searchOption,
            designerId: that.data.extendData.designerId,
            descOrAsc: 'desc',
            successCaseOrederBy: 'praise'
          }
        } else {
          var extendData = {
            searchOption: that.data.extendData.searchOption,
            designerId: that.data.extendData.designerId,
            descOrAsc: 'asc',
            successCaseOrederBy: 'praise'
          }
        }
      } else if (num == 2) {
        if (that.data.judgesub) {
          var extendData = {
            searchOption: that.data.extendData.searchOption,
            designerId: that.data.extendData.designerId,
            descOrAsc: 'desc',
            successCaseOrederBy: 'browse_num'
          }
        } else {
          var extendData = {
            searchOption: that.data.extendData.searchOption,
            designerId: that.data.extendData.designerId,
            descOrAsc: 'asc',
            successCaseOrederBy: 'browse_num'
          }
        }
      } else if (num == 3) {
        if (that.data.judgesub) {
          var extendData = {
            searchOption: that.data.extendData.searchOption,
            designerId: that.data.extendData.designerId,
            descOrAsc: 'desc',
            successCaseOrederBy: 'createDate'
          }
        } else {
          var extendData = {
            searchOption: that.data.extendData.searchOption,
            designerId: that.data.extendData.designerId,
            descOrAsc: 'asc',
            successCaseOrederBy: 'createDate'
          }
        }
      } else if (num == 0) {
        var extendData = {
          searchOption: that.data.extendData.searchOption,
          designerId: that.data.extendData.designerId,
        }
      }

      that.setData({
        extendData: extendData
      })
      let data1 = {
        start: 1,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData: JSON.stringify(extendData)
      }
      api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
        if (e) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
        that.setData({
          pagelist: e.data,
          content: e.data.list,
          // totalPageCount:e.data.totalPageCount,
          start: e.data.start
        })
      })

    }

  },





  chiocetext: function (e) {
    console.log(e)
    let index = this.data.tabindex
    console.log(index)
    let text = e.currentTarget.dataset.chtext
    let arr = this.data.choice
    console.log(arr)
    arr[index].select = text
    arr[index].flag = false
    this.setData({
      choice: arr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得drawer组件
    this.drawer = this.selectComponent("#drawer");
  },

  //筛选组件点击确定后的事件
  _success: function (e) {
    console.log(e)

    this.setData({
      content: e.detail.chuancon.list,
      extendData: e.detail.extendData,
      pagelist: e.detail.chuancon,
      hidindex: 0,
      judgesub: true
    })
  },

  // 搜索组件事件
  searchword: function (e) {
    console.log(e)
    console.log(e)
    this.setData({
      content: e.detail.concats,
      extendData: e.detail.extendData,
      pagelist: e.detail.chuancon,
      hidindex: 0,
      judgesub: true
    })
  },

  //筛选项顶部点击事件
  async screenItemTap(event) {
    let index = event.currentTarget.dataset.index
    let searchCode = this.data.choice[index].searchOptionRootCode
    if (index === this.data.currentIndex) {
      this.setData({
        codeIsList: !this.data.codeIsList,
        currentIndex: index
      })
    } else {
      this.setData({
        codeIsList: true,
        currentIndex: index
      })
    }
    let extendData = this.data.extendData
     
    let params = {
      searchCode: searchCode,
      
    }
    if(this.data.choice[index]&&this.data.choice[index].type&&this.data.choice[index].type=='designTeam'){
      delete extendData.designerId
      params.extendData = extendData
      params.newsClassId=this.data.newsClassId
      var codeList = await requestCenter.getDesingerSearchOption2(params)
      app.log('codeList',codeList)
      codeList.unshift({name:'全部',id:''})
    }else{
      var codeList = await requestCenter.getSrarchOptionsBySearchCode(params)
      codeList.unshift({searchName:'全部',id:null})
    }
    
   
    this.setData({
      codeList: codeList
    })

  },

  // 筛选项点击事件
  async codeItemTap(event) {
    let index = event.currentTarget.dataset.index
    let currentIndex = this.data.currentIndex
    let chioceItem = this.data.choice[currentIndex]
    let codeListItem = this.data.codeList[index]
    let id = codeListItem.id
    let searchName = codeListItem.searchName
    let extendData = this.data.extendData||{}
    let searchOption = this.data.searchOption ? this.data.searchOption : []
    if(chioceItem&&chioceItem.type=='designTeam'){
      extendData.designerId = id
      this.setData({
        designerId:id,
        designerName:codeListItem.name
      })
    }else{
      searchOption[currentIndex] = {
        id:id,
        searchName:searchName
      }
      let arr = searchOption.map(obj => {return obj.id})
      let newArray = arr.filter(obj=>obj)
      extendData.searchOption = newArray.join(',')
      this.setData({
        isFlter:true
      })
    }
    let params = {
      start: 1,
      pageSize: 12,
      newsClassId:this.data.newsClassId,
      extendData: JSON.stringify(extendData)
    }
    let getPageModel = await requestCenter.getPageModel(params)
    this.setData({
      pagelist: getPageModel,
      content: getPageModel.list,
      start: getPageModel.start,
      extendData:extendData,
      searchOption: searchOption,
      codeIsList:false,
      scrollTop:0
    })
  },

  //除设计师外的清除筛选
  async clearOpetions(e){
    let index = e.currentTarget.dataset.index
    console.log(index)
    let searchOption = this.data.searchOption
    this.setData({
      [`searchOption[${index}].id`]:null
    })
    searchOption[index].id = null
    let extendData = this.data.extendData
    let arr = searchOption.map(obj => {return obj.id})
    let newArray = arr.filter(obj=>obj)
    this.setData({
      isFlter:newArray.length>0?true:false
    })
    extendData.searchOption = newArray.join(',')
    let params = {
      start: 1,
      pageSize: 12,
      newsClassId:this.data.newsClassId,
      extendData: JSON.stringify(extendData)
    }
    let getPageModel = await requestCenter.getPageModel(params)
    this.setData({
      pagelist: getPageModel,
      content: getPageModel.list,
      start: getPageModel.start,
      extendData:extendData,
      codeIsList:false,
      scrollTop:0
    })
  },
  async clearDesNmae(){
    let extendData = this.data.extendData
    extendData.designerId = ''
    let params = {
      start: 1,
      pageSize: 12,
      newsClassId:this.data.newsClassId,
      extendData: JSON.stringify(extendData)
    }
    let getPageModel = await requestCenter.getPageModel(params)
    this.setData({
      pagelist: getPageModel,
      content: getPageModel.list,
      start: getPageModel.start,
      extendData:extendData,
      codeIsList:false,
      scrollTop:0,
      designerName:'',
      designerId:''
    })
  },
  //关闭筛选弹窗
  codeMark(){
    this.setData({
      codeIsList:false
    })
  }

})