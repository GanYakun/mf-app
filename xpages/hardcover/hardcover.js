var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    customization:[],
    xarr:'',
    maskindex:-1,
    extendData:{},
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
  chiocetext: '精装房',
  LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
  },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.toptext,
    })
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
          newsClassId: options.id
        })
      }
    })
    this.setData({
      newsClassId:options.id,
      imgur:app.globalData.imgur,
      tabIndexHeight:app.globalData.tabIndexHeight
    })
    if(options.extendData==undefined){
      var extendData = {}
    }else{
      var extendData = options.extendData
      if(options.index == 1){
        var customizationchioce = 'customization[1]'
      }else{
        var customizationchioce = 'customization[0]'
      }
      this.setData({
        [customizationchioce]: JSON.parse(options.extendData).searchOption
      })
    }
    var data={
      start:1,
      pageSize:12,
      newsClassId:options.id,
      extendData:extendData
    }
    //获取精装房列表
    api.request('/rest/newsClass/getPageModel', data, 'GET',this.getPageModel)
    let getRootByNewsClassIdData = {
      newsClassId: options.id
    }
    api.request('/rest/tWebSearchOptionControllerApi/getRootByNewsClassId', getRootByNewsClassIdData, 'GET', this.getRootByNewsClassId)

  },


  /**
   * 
   * 头部选项的回调函数
   * 
   */
getRootByNewsClassId: function (e) {
  this.setData({
    sublists: e.data
  })
  console.log(e)

},

  //  获取毛坯房列表回调
  getPageModel:function(e){
    this.setData({
      exlist:e.data,
      TopTitle:e.data.newsClass.name
    })
      },


  chiocetext:function(e){
    console.log(e)
    let index = this.data.tabindex
    console.log(index)
    let text = e.currentTarget.dataset.chtext
let arr = this.data.choice
console.log(arr)
arr[index].select=text
arr[index].flag=false
this.setData({
  choice:arr
})
    },


  showInput: function () {
    this.setData({
        inputShowed: true
    });
    console.log('666')
},
hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
    });
    console.log('666')
},
clearInput: function () {
    this.setData({
        inputVal: ""
    });
},
inputTyping: function (e) {
    this.setData({
        inputVal: e.detail.value
    });
},

  onReady:function(){
this.drawer = this.selectComponent("#drawer")
  },

  powerDrawer:function(){
    this.drawer.powerDrawerzujian();
  },
  


  //跳转到详情页面
  checklist:function(e){
    console.log(e)
    let pagetitle = e.currentTarget.dataset.hometitle
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + this.data.newsClassId + '&objectId=' + id + "&type=1",
    })

  },


  /**
 * 
 *头部几个选项的点击事件
 * 
 */
screenEd: function (e) {
  console.log(e)
    let that = this
    if (e.currentTarget.dataset.index == that.data.maskindex) {
      that.setData({
        mask: false,
        maskindex: -1
      })

    } else {
      that.setData({
        mask: false,
        maskindex: e.currentTarget.dataset.index
      })
    }


  let styles = e.currentTarget.dataset.searchoptionrootcode
  that.setData({
    type: e.currentTarget.dataset.type,
    styles: ''
  })

  //判断tabname为啥，为设计师的话调用设计师的接口，反之则调用其他接口
  if (e.currentTarget.dataset.tabname == '设计师') {
    let getDesingerSearchOptionData = {}
    api.request('/rest/tWebSearchOptionControllerApi/getDesingerSearchOption', 'GET', getDesingerSearchOptionData, function (e) {
      console.log(e.data.length % 3)
      if (e.data.length % 3 == 0 || e.data.length % 3 == 1) {
        var arrlen = (e.data.length / 3).toFixed(0) - 1 + 2
      }
      else {
        var arrlen = (e.data.length / 3).toFixed(0)
      }
      console.log(arrlen)
      that.setData({
        topheight: arrlen * 80
      })
      // 如果为设计师时，则加入到地4个数组
      e.data.unshift({
        name: '全部'
      })
      that.setData({
        selectedval4: e.data,
      })
     
        wx.hideLoading({
          success: (res) => { },
        })
        that.setData({
          styles: ''
        })

    })
  }
  else {
    let getSrarchOptionsBySearchCodeData = {
      searchCode: e.currentTarget.dataset.searchoptionrootcode
    }
    api.request('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode', getSrarchOptionsBySearchCodeData, 'GET', function (e) {
      if (e.data.length % 3 == 0 || e.data.length % 3 == 1) {
        var arrlen = (e.data.length / 3).toFixed(0) - 1 + 2
      }
      else {
        var arrlen = (e.data.length / 3).toFixed(0)
      }
      that.setData({
        topheight: arrlen * 80
      })
      //在他返回的数组中加入  全部  这个数组 unshift是把元素加在数组的开头，
      e.data.unshift({
        searchName: '全部',
        id:null
      })
      console.log(styles)
      // 如果为楼盘位置时  把数据加入到数组1中
      if (styles == 'successBuild') {
        that.setData({
          selectedval1: e.data
        })
     
      }
      //如果为风格时 就把数据加入到数组二中
      else if (styles == 'pop_style') {
        that.setData({
          selectedval2: e.data
        })
      }
      else if (styles == 'kongjian') {
        that.setData({
          selectedval3: e.data,
        })
        that.setData({
          styles: styles
        })
      }
    })
  }
},

/**
 * 
 * 点击遮罩层关闭弹窗
 * 
 */
screenEdclose:function(){
  this.setData({
    maskindex:-1
  })
},


 /**
  * 
  * 分类下的点击事件
  * 
  */
 selected: function (e) {
  let that = this;
  console.log(e)
  wx.showLoading({
    title: '加载中',
  })
  let arr = that.data.customization

  if(e.currentTarget.dataset.too==1){
      arr[0] = e.currentTarget.dataset.id
      that.setData({
        customization: arr
      })
  }else if(e.currentTarget.dataset.too==2){
      arr[1] = e.currentTarget.dataset.id
      that.setData({
        customization: arr
      })
  }else if(e.currentTarget.dataset.too==3){
      arr[2] = e.currentTarget.dataset.id
      that.setData({
        customization: arr
      })
  }else if(e.currentTarget.dataset.too==4){
      arr[3] = e.currentTarget.dataset.id
      that.setData({
        designerid: e.currentTarget.dataset.id,
        customization: arr
      })
  }
 

  // 查询数据
var testarr = that.data.customization
testarr.forEach(function(v,k){
  if(v == null || v ==that.data.designerid){}else{
    var xarrs = that.data.xarr.concat(v+',')
    that.setData({
      xarr:xarrs
    })
  }
})
console.log(that.data.xarr)
let extendData = {
  searchOption: that.data.xarr,
  designerId:that.data.designerid
}
console.log(JSON.stringify(extendData))

let data1 = {
  start: 1,
  pageSize: 12,
  newsClassId: this.data.newsClassId,
  extendData: JSON.stringify(extendData)
}
api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
  if(e){
    wx.hideLoading({
      success: (res) => {},
    })
    that.setData({
      maskindex: -1,
      xarr:'',
      exlist: e.data
    })
  }
})
    
  
},




  /**
   * 
   * 
   * 滑动加载数据
   * 
   * 
   */
  slideusage: function () {
    let that = this
    var arr = that.data.exlist
    if (arr.webNextPage) {
      wx.showLoading({
        title: '加载中',
      })
      var startnum = arr.start + 1
      let data = {
        start: startnum,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData: that.data.extendData
      }
      api.request('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if (e) {
          wx.hideLoading({
          })
        }
        // console.log([...arr.list,...e.data.list])
        let arrs = [...arr.list,...e.data.list]
        var xiugai = 'exlist.webNextPage'
        var xiugai1 = 'exlist.start'
        var newArr = 'exlist.list'
        that.setData({
          [newArr]: arrs,
          [xiugai]: e.data.webNextPage,
          [xiugai1]: startnum
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
  searchword: function (e) {
    console.log(e)
    console.log(e)
    this.setData({
      content: e.detail.concats,
      extendData: e.detail.extendData,
      exlist: e.detail.chuancon,
      hidindex: 0,
      judgesub: true
    })
  },
})