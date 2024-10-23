var api = require("../../utils/api.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    inputShowed: false,
    inputVal: "",
    tbindex: 0,
    mask: false, //控制下滑栏
    maskindex: -1,
    topheight: 0,
    customization: [
      '', ''
    ],
    extendData: {
      extendData: ''
    }, //设置检索条件为空
    tabIndexHeight: app.globalData.tabIndexHeight //设置底部tab栏目的高度
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.chioceid) {
      let customization = 'customization[0]'
      this.setData({
        [customization]: options.chioceid
      })
    } else {}
    wx.getSystemInfo({
      success: res => {
        // 获取可使用窗口宽度、高度、比例
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let ratio = 750 / windowWidth;
        let pageWindowHeight = Math.ceil(windowHeight * ratio);
        let pageWindowwidth = Math.ceil(windowWidth * ratio);
        console.log(pageWindowHeight)
        this.setData({
          pageWindowwidth: pageWindowwidth,
          pageWindowHeight: pageWindowHeight
        })
      }
    })

    if (options.extendData == undefined) {
      var extendData = {}
    } else {
      var extendData = options.extendData
    }


    if (options.id == 'undefined' || options.id == undefined) {

      var newsclassId = options.newsClassId
    } else {

      var newsclassId = options.id
    }

    let data = {
      start: 1,
      pageSize: 12,
      newsClassId: newsclassId,
      extendData: extendData
    }
    this.setData({
      newsClassId: newsclassId,
      imgur: app.globalData.imgur
    })
   
    //获取全屋精选列表
    api.request('/rest/newsClass/getPageModel', data, 'GET', this.getPageModel)

    let getRootByNewsClassIdData = {
      newsClassId: newsclassId
    }
    api.request('/rest/tWebSearchOptionControllerApi/getRootByNewsClassId', getRootByNewsClassIdData, 'GET', this.getRootByNewsClassId)

  },

  //获取全屋精选列表回调函数
  getPageModel: function (e) {
    if (e) {
      wx.hideLoading({})
    }
    this.setData({
      list: e.data,
      TopTitle: e.data.newsClass.name
    })
  },

  /**
   * 
   * 获取头部检索选项的回调函数
   * 
   */
  getRootByNewsClassId: function (e) {
    let that = this
    this.setData({
      sublists: e.data
    })
    //查询系列
    let getSrarchOptionsBySearchCodeData = {
      searchCode: e.data[0].searchOptionRootCode
    }
    api.newget('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode', getSrarchOptionsBySearchCodeData, 'GET', (res) => {
      let setvalue = 'customization[0]'
      res.data.unshift({
        searchName: '全部',
        id: -1
      })
      that.setData({
        tabList: res.data,
        [setvalue]: that.data.customization[0]?that.data.customization[0]:-1
      })
    })
    try{
      var query = wx.createSelectorQuery().in(that);//创建节点查询器
      query.select('#item' + that.data.customization[0]).boundingClientRect();//选择id='#item' + selectedId的节点，获取节点位置信息的查询请求
      console.log(that.data.customization[0])
      query.select('#scroll-view').boundingClientRect();//获取滑块的位置信息
      query.select('#scroll-view').scrollOffset();//获取页面滑动位置的查询请求
      query.exec(function (res) {
        console.log(res)
        res[0]=res[0]||{left:0}
        that.setData({
          scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
        });
      });
    }catch{
      console.log('代码异常')
    }
   
  },






  OnTabTap: function (e) {
    console.log(e)
    let that = this
    var query = wx.createSelectorQuery().in(that);//创建节点查询器
      query.select('#item' + e.currentTarget.dataset.id).boundingClientRect();//选择id='#item' + selectedId的节点，获取节点位置信息的查询请求
      query.select('#scroll-view').boundingClientRect();//获取滑块的位置信息
      query.select('#scroll-view').scrollOffset();//获取页面滑动位置的查询请求
      query.exec(function (res) {
        console.log(res)
        that.setData({
          scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
        });
      });

    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let setvalue = 'customization[0]'
    that.setData({
      [setvalue]: id
    })
    let extendData = JSON.stringify({searchOption:id==-1?'':id,designerId:""})
    let data1 = {
      start: 1,
      pageSize: 12,
      newsClassId: this.data.newsClassId,
      extendData: extendData
    }
    api.newget('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
        that.setData({
          list: e.data,
          extendData: extendData,
          topNum:0
        })
    })
  
  },

  powerDrawer: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },


  //取消
  cancel: function () {
    this.util('close')
  },
  powerDrawerclose: function (e) {

    console.log('点击了')
    console.log(e)
    let currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 150, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：x轴不偏移；
    animation.translate(0).step();


    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：X轴偏移22px，停
      animation.translate(-300).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
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

  //跳转到全屋精选的详细页面
  allhomelist: function (e) {
    console.log(e)
    let pagetitle = e.currentTarget.dataset.hometitle
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../selectedchecklist/selectedchecklist?pagetitle=' + pagetitle + '&newsClassId=' + this.data.newsClassId + '&objectId=' + id,
    })
  },


  /**
   * 
   * 
   * 监听页面隐藏
   * 
   */
  onHide: function () {
    wx.hideLoading({})
  },


  /**
   * 
   * 显示下滑栏
   * 
   */
  screenEd: function (e) {
    var popstyleindex = e.currentTarget.dataset.index
    var that = this;
    if (that.data.maskindex == e.currentTarget.dataset.index) {
      that.setData({
        mask: false,
        maskindex: -1
      })
    } else {
      console.log(e.currentTarget.dataset.searchoptionrootcode)
      that.setData({
        mask: true,
        maskindex: e.currentTarget.dataset.index
      })

      let getSrarchOptionsBySearchCodeData = {
        searchCode: e.currentTarget.dataset.searchoptionrootcode
      }
      api.request('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode', getSrarchOptionsBySearchCodeData, 'GET', function (e) {
        if (e.data.length % 3 == 0 || e.data.length % 3 == 1) {
          var arrlen = (e.data.length / 3).toFixed(0) - 1 + 2
        } else {
          var arrlen = (e.data.length / 3).toFixed(0)
        }
        that.setData({
          topheight: arrlen * 80
        })
        //在他返回的数组中加入  全部  这个数组 unshift是把元素加在数组的开头，
        e.data.unshift({
          searchName: '全部',
          id: ''
        })
        if (popstyleindex == 0) {
          that.setData({
            selectedval: e.data
          })
        } else {
          that.setData({
            selectedval1: e.data
          })
        }

      })

    }

  },


  /**
   * 
   * 选择选项
   * 
   * 
   */
  selected: function (e) {
    let that = this
    if (e.currentTarget.dataset.curinex == 0) {
      let list = 'customization[' + 0 + ']'
      that.setData({
        [list]: e.currentTarget.dataset.id,
      })

    } else {
      let list = 'customization[' + 1 + ']'
      that.setData({
        [list]: e.currentTarget.dataset.id,
      })
    }
    let arr = that.data.customization
    console.log(arr)
    that.setData({
      xarr: ''
    })

    arr.forEach(function (v, k) {
      if (v == '') {} else {
        that.setData({
          xarr: that.data.xarr.concat(v + ',')
        })
      }

    })
    console.log(that.data.xarr)
    // let ass = arr.join(',')
    // console.log( JSON.stringify(ass) )
    let extendData = {
      searchOption: that.data.xarr,
    }
    console.log(JSON.stringify(extendData))

    let data1 = {
      start: 1,
      pageSize: 12,
      newsClassId: this.data.newsClassId,
      extendData: JSON.stringify(extendData)
    }
    api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
      if (e) {
        wx.hideLoading({
          success: (res) => {},
        })
        that.setData({
          mask: 0,
          list: e.data,
          extendData: extendData
        })
      }
    })
  },

  /**
   * 
   * 滑动到底部的事件
   * 
   */
  slideusage: function () {
    let that = this
    var arr = that.data.list
    if (arr.webNextPage) {
      var startnum = arr.start + 1
      let data = {
        start: startnum,
        pageSize: 12,
        newsClassId: this.data.newsClassId,
        extendData: that.data.extendData
      }
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        var arrlist = that.data.list.list.concat(e.data.list)
        arr.list = arrlist
        var xiugai = 'list.webNextPage'
        var xiugai1 = 'list.start'
        that.setData({
          list: arr,
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

  hide: function (event) {
    var that = this
    that.setData({
      mask: false,
      maskindex: -1
    })
  },


 

})