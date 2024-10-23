var api = require("../../utils/api.js")
var app = getApp()
import requestCenter from "../../http/request-center"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    isHouseScreen: false, //控制筛选组件是否显示的元素
    indexs: 9999,
    mask: 0,
    inputShowed: false,
    inputVal: "",
    sublists: [],
    // selectedval: [],
    selectedval: {},
    desingerlists: [],
    type: '',
    customization: [
      null
    ],
    xarr: '',
    designerid: '',
    extendData: '',
    maskindex: -1, //默认关闭弹窗
    extendData: {
      "searchOption": "",
      "designerId": ""
    },
    chiocetext: '毛坯房',
    componentData: {
      isShowSearch: true
    }, // 判断lefftbutton里的搜索插槽是否显示
    selectedId: {},
    imgur: app.globalData.imgur
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("上个页面穿过来的参数", options)
    console.log(options.extendData)
    // if(options.advData){
    //   let advData = JSON.parse(decodeURIComponent(options.advData))
    //   let index = options.index==1?1:0
    //   console.log(index)
    //   this.setData({
    //     [`selectedOptions[${index}]`]: {
    //       id: advData.clickId,
    //       name: advData.clickName
    //     },
    //   })
    // }
   
    if (!options.extendData) {
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: options.newsClassId
      }
      this.setData({
        newsClassId: options.newsClassId
      })
      console.log(this.data.newsClassId)
    } else {
      var data = {
        start: 1,
        pageSize: 12,
        newsClassId: options.newsClassId,
        extendData: options.extendData
      }
      this.setData({
        newsClassId: options.newsClassId,
        extendData: options.extendData,
        advOpionId: JSON.parse(options.extendData).searchOption
      })
    }
    if(options.extendData){
      var searchOption = JSON.parse(options.extendData).searchOption
      try{var searchOptionArr = searchOption.split(',')}catch{var searchOptionArr = [`${searchOption}`]}
      console.log(searchOptionArr)
    }
    
    //获取毛坯房列表
    api.newget('/rest/newsClass/getPageModel', data, 'GET', this.getPageModel)
    //查询顶部的四个筛选项
    let getRootByNewsClassId = await requestCenter.getRootByNewsClassId({newsClassId: options.newsClassId})
    this.setData({
      sublists: getRootByNewsClassId,
    })
    getRootByNewsClassId.forEach(async (v,k)=>{
      let selectedval = await requestCenter.getSrarchOptionsBySearchCode({searchCode:v.searchOptionRootCode})
      selectedval.unshift({
        searchName: '全部',
        id: null
      })
      if(searchOption){
        console.log(searchOptionArr)
        searchOptionArr.forEach((vs,ks)=>{
           let findval =  selectedval.findIndex(obj=>obj.id==vs)
           if(findval!=-1){
             console.log(findval)
            this.setData({
              [`selectedId.${v.searchOptionRootCode}.id`]:selectedval[`${findval}`].id,
              [`selectedId.${v.searchOptionRootCode}.name`]:selectedval[`${findval}`].searchName,
              [`selectedOptions[${k}].name`]:selectedval[`${findval}`].searchName,
              [`selectedOptions[${k}].id`]:selectedval[`${findval}`].id,
              [`selectedOptions[${k}].styles`]:v.searchOptionRootCode,
              isFlter:true
            })
           }
        })
      }
      this.setData({
        [`selectedval.${v.searchOptionRootCode}`]:selectedval
      })
      
    })
    // api.newget('/rest/tWebSearchOptionControllerApi/getRootByNewsClassId', getRootByNewsClassIdData, 'GET', this.getRootByNewsClassId)
  },

  
  

  // 搜索组件事件
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

  // getRootByNewsClassId: async function (e) {
  //   let params = {
  //     searchCode: e.data[0].searchOptionRootCode
  //   }
  //   let proForSale = await requestCenter.getSrarchOptionsBySearchCode(params)
  //   proForSale.unshift({
  //     searchName: '全部',
  //     id: null
  //   })
  //   // e.data.unshift({searchOptionRootName:'综合'})
  //   app.log('proForSale', proForSale)
  //   this.setData({
  //     sublists: e.data,
  //     proForSale: proForSale
  //   })
  //   console.log(e)

  // },

  /**
   * 
   * 跳转到详情页面
   * 
   */
  checklist: function (e) {
    let pagetitle = e.currentTarget.dataset.hometitle
    let id = e.currentTarget.dataset.id
    console.log('../checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + this.data.newsClassId + '&objectId=' + id + '&type=0')
    wx.navigateTo({
      url: '../checklist/checklist?pagetitle=' + pagetitle + '&newsClassId=' + this.data.newsClassId + '&objectId=' + id + '&type=0',
    })
  },
  //  获取毛坯房列表回调
  getPageModel: function (e) {
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      exlist: e.data,
      TopTitle: e.data.newsClass.name,
      newsClassModel:e.data.newsClass
    })
  },

  //筛选事件
  powerDrawer: function () {
    this.setData({
      isHouseScreen: !this.data.isHouseScreen
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });

  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
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


  /**
   * 
   *头部几个选项的点击事件
   * 
   */
  screenEd: function (e) {
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
    //设置点击后判断为楼盘  风格  还是户型等
    let styles = e.currentTarget.dataset.searchoptionrootcode
    that.setData({
      type: e.currentTarget.dataset.type,
      // styles: ''
    })
    //判断tabname为啥，为设计师的话调用设计师的接口，反之则调用其他接口
    if (e.currentTarget.dataset.tabname == '设计师') {
      let extendData = this.data.extendData
      console.log(extendData)
      if(extendData){
        try {
          var parseExtendData = JSON.parse(extendData)
        } catch (error) {
          app.log(error)
          var parseExtendData = extendData
        }
      }
      console.log(parseExtendData)
      let data ={
        newsClassId:that.data.newsClassModel.relationId,
        extendData:{searchOption:parseExtendData&&parseExtendData.searchOption?parseExtendData.searchOption:''}
      }
      api.newget('/rest/tWebSearchOptionControllerApi/getDesingerSearchOption', data,'GET', (e) => {
        console.log(e.data.length % 3)
        if (e.data.length % 3 == 0 || e.data.length % 3 == 1) {
          var arrlen = (e.data.length / 3).toFixed(0) - 1 + 2
        } else {
          var arrlen = (e.data.length / 3).toFixed(0)
        }
        console.log(arrlen)
        that.setData({
          topheight: arrlen * 80
        })
        // 如果为设计师时，则加入到地4个数组
        e.data.unshift({
          name: '全部',
          id: null
        })
        that.setData({
          selectedval4: e.data,
        })
      }, 0)
    } else {
      console.log(styles)
      let selectedval = this.data.selectedval[`${styles}`]
      console.log(selectedval)
      
        if (selectedval.length % 3 == 0 || selectedval.length % 3 == 1) {
          var arrlen = (selectedval.length / 3).toFixed(0) - 1 + 2
        } else {
          var arrlen = (selectedval.length / 3).toFixed(0)
        }
        console.log(arrlen)
        console.log(selectedval.length )
        that.setData({
          topheight: arrlen * 71 + 10
        })
        //在他返回的数组中加入  全部  这个数组 unshift是把元素加在数组的开头，
        // 如果为楼盘位置时  把数据加入到数组1中
        console.log(styles)
        that.setData({
          filterStyles: styles
        })
        // if (this.data.advOpionId) {
        //   this.finIdvId()
        // }
        return false
        if (styles == 'successBuild' || styles == 'successBuild2') {
          console.log(styles)
          that.setData({
            selectedval1: e.data
          })
          var timer = setTimeout(() => {
            that.setData({
              styles: styles
            })
            clearInterval(timer)
          }, 1000);
        }
        //如果为风格时 就把数据加入到数组二中
        else if (styles == 'pop_style' || styles == 'pop_style2') {
          that.setData({
            selectedval2: e.data
          })
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {},
            })
            that.setData({
              styles: styles
            })
          }, 1000);
        } else if (styles == 'house_type' || styles == 'house_type2') {
          that.setData({
            selectedval3: e.data,
          })
          that.setData({
            styles: styles
          })
        } else if (styles == 'kongjian') {
          that.setData({
            selectedval3: e.data,
          })
          that.setData({
            styles: styles
          })
        }
    }

  },
  finIdvId() {
    //广告图进来使其选中
    // if(this.data.advOpionId){
    let selectedval = this.data.selectedval
    for (var key in selectedval) {
      let findex = selectedval[key].findIndex(obj => obj.id == this.data.advOpionId)
      console.log(findex)
      if (findex != -1) {
        console.log(key)
        this.setData({
          [`selectedId.${key}.id`]: this.data.advOpionId,
          advOpionId: false,
          
        })
      }
    }
    // }
  },

  getDesingerSearchOption: function (e) {
    console.log(e)
    this.setData({
      desingerlists: e.data
    })
  },



  /**
   * 
   * 关闭下拉的
   * 
   * 
   */
  screenEdclose: function () {
    this.setData({
      maskindex: -1
    })
  },




  //楼盘位置分类下的点击事件
  selected: function (e) {
    let that = this;
    console.log(e)
    let index = e.currentTarget.dataset.index
    let arr = that.data.customization

    if (e.currentTarget.dataset.too == 1) {
      // var query = wx.createSelectorQuery().in(that);//创建节点查询器
      //   query.select('#item' + e.currentTarget.dataset.id).boundingClientRect();//选择id='#item' + selectedId的节点，获取节点位置信息的查询请求
      //   query.select('#scroll-view').boundingClientRect();//获取滑块的位置信息
      //   query.select('#scroll-view').scrollOffset();//获取页面滑动位置的查询请求
      //   query.exec(function (res) {
      //     console.log(res)
      //     that.setData({
      //       scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
      //     });
      //   });
      // arr[0].id = e.currentTarget.dataset.id
      // arr[0].searchName = that.data.proForSale[index].searchName
      let searchOptionRootCode = that.data.sublists[0].searchOptionRootCode
      that.setData({
        ['selectedId.' + searchOptionRootCode + '']: e.currentTarget.dataset.id,
        scrollViewId: 'item' + e.currentTarget.dataset.id

      })
    } else if (e.currentTarget.dataset.too == 10) {
      if (this.data.filterStyles == that.data.sublists[0].searchOptionRootCode) {
        this.setData({
          scrollViewId: 'item' + e.currentTarget.dataset.id
        })
      }
      if (e.currentTarget.dataset.id) {
        this.setData({
          isFlter: true
        })
      }
      this.setData({
        ['selectedId.' + this.data.filterStyles + '']: {
          id: e.currentTarget.dataset.id,
          name: e.currentTarget.dataset.name
        },
      })
    } else if (e.currentTarget.dataset.too == 4) {
      arr[3] = e.currentTarget.dataset.id
      if (e.currentTarget.dataset.id == null) {
        that.setData({
          designerid: '',
          customization: arr
        })
      } else {
        that.setData({
          designerid: e.currentTarget.dataset.id,
          customization: arr,
          designerName: e.currentTarget.dataset.name
        })
      }

    }
    let selectedOptionsIndex = -1
    console.log(that.data.filterStyles)
    for (var key in that.data.selectedId) {
      console.log(that.data.selectedId[key].id)
      if (key && that.data.selectedId[key]) {
        selectedOptionsIndex = selectedOptionsIndex + 1
        console.log(selectedOptionsIndex)
        if (that.data.selectedId[key].id) {
          var xarrs = that.data.xarr.concat(that.data.selectedId[key].id + ',')
        } else {
          var xarrs = that.data.xarr
        }
        let styles = that.data.selectedOptions ? that.data.selectedOptions[`${selectedOptionsIndex}`] : that.data.selectedOptions
        if (!styles) {
          that.setData({
            ['selectedOptions[' + selectedOptionsIndex + '].styles']: that.data.filterStyles
          })
        }
        that.setData({
          xarr: xarrs,
          ['selectedOptions[' + selectedOptionsIndex + '].name']: that.data.selectedId[key].id ? that.data.selectedId[key].name : '',
        })
      }
    }
    console.log(that.data.xarr)
    let extendData = {
      searchOption: that.data.xarr,
      designerId: that.data.designerid
    }
    that.setData({
      extendData: JSON.stringify(extendData)
    })

    console.log(JSON.stringify(extendData))

    let data1 = {
      start: 1,
      pageSize: 12,
      newsClassId: this.data.newsClassId,
      extendData: JSON.stringify(extendData)
    }
    api.newget('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
      if (e) {
        wx.hideLoading({

        })
        that.setData({
          maskindex: -1,
          xarr: '',
          exlist: e.data
        })
      }
    })

    this.setData({
      scrollTop: 0
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
      var startnum = arr.start + 1
      let data = {
        start: startnum,
        pageSize: 12,
        newsClassId: that.data.newsClassId,
        extendData: that.data.extendData
      }
      api.newget('/rest/newsClass/getPageModel', data, 'GET', function (e) {
        if (e) {
          wx.hideLoading({

          })
        }
        arr.list.concat(e.data.list)
        var xiugai = 'exlist.webNextPage'
        var xiugai1 = 'exlist.start'
        var exlist = 'exlist.list'
        that.setData({
          [exlist]: [...arr.list, ...e.data.list],
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
  assemblyClose() {
    this.setData({
      mask: false,
      maskindex: -1
    })
  },

  //页面隐藏
  onHide: function () {
    app.UserLogin()
  },

  //清除团队的筛选项
  clearDesNmae() {
    this.setData({
      ['customization[3]']: null,
      designerName: '',
      designerid: ''
    })
    this.filterList()
  },

  //  清除除团队外的筛选项
  clearOpetions(e) {
    let index = e.currentTarget.dataset.index
    console.log(this.data.selectedOptions)
    let styles = this.data.selectedOptions[`${index}`].styles
    this.setData({
      ['selectedOptions[' + index + '].name']: '',
      ['selectedId.' + styles + '.id']: null
    })
    console.log(this.data.selectedId)
    let isFilter = this.data.selectedOptions.findIndex(obj => obj?obj.name:obj)
    console.log(isFilter)
    if (isFilter == -1) {
      this.setData({
        isFlter: false
      })
    }
    this.filterList()
  },

  //改变筛选项从而筛选列表
  filterList() {
    for (var key in this.data.selectedId) {
      console.log(this.data.selectedId[key].id)
      if (key && this.data.selectedId[key].id) {
        var xarrs = this.data.xarr.concat(this.data.selectedId[key].id + ',')
        this.setData({
          xarr: xarrs,
        })
      }
    }
    let extendData = {
      searchOption: this.data.xarr,
      designerId: this.data.designerid ? this.data.designerid : ''
    }
    this.setData({
      extendData: JSON.stringify(extendData)
    })
    console.log(JSON.stringify(extendData))
    let data1 = {
      start: 1,
      pageSize: 12,
      newsClassId: this.data.newsClassId,
      extendData: JSON.stringify(extendData)
    }
    api.newget('/rest/newsClass/getPageModel', data1, 'GET', (e) => {
      if (e) {
        this.setData({
          maskindex: -1,
          xarr: '',
          exlist: e.data
        })
      }
    })
    this.setData({
      scrollTop: 0
    })
  }

})