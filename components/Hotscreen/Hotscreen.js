var api = require('../../utils/api.js');
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: Object,
      value: null,
      observer: function (newVal, oldVal) {
        console.log(newVal)
        this.setData({
          _category: newVal
        })
      }
    },
    _initialParentId: {
      type: Number,
      value: 0,
    },
    isConfirm: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached: function () {
      var that = this
      let data = {
        parentId: 0
      }
      //查询根目录的id
      api.request('/rest/tWebMallItemCatControllerApi/locationList', data, 'GET', function (e) {
        if (e) {
          let data2 = {
            parentId: e.data[0] && e.data[0].id ? e.data[0].id : "0"
          }
          api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
            e.data.unshift({
              cname: '全部',
              id: '0',
              isCommendDisplay: '1'
            })
            that.setData({
              onescData: e.data,
              chioceIndex: 0,
              isFirst: true
            })
            console.log('跳转的列表数据', that.data.onescData)
            var _category = that.data._category
            var screenarr = that.data.screenarr
            if (!_category) {
              screenarr[0] = e.data && e.data[0] ? e.data[0].id : ""
              that.setData({
                screenarr: screenarr
              })
              return
            }
            e.data.forEach(function (item, index) {
              if (_category && _category.pid == item.id) {
                screenarr[0] = item.id
                that.setData({
                  screenarr: screenarr
                })
                //模拟点击
                var event = {
                  currentTarget: {
                    dataset: {
                      topname: item.cname,
                      id: item.id
                    }
                  }
                }
                that.shopcidclick(event)
              }
            })
          })
        }
      })

      // 这里注释掉以前标签列表
      // api.request("/rest/dataDictionaryApi/dataDictionary", {
      //   typegroupCode: "product_tag"
      // }, "GET", (res) => {
      //   var tagList = res && res.data ? res.data : []
      //   that.setData({
      //     tagList: tagList
      //   })
      // })

      api.request("/rest/tWebMallItemSkuControllerApi/getTagList", {}, "GET", (res) => {
        var tagList = res && res.data ? res.data : []
        console.log('标签列表', tagList)
        that.setData({
          tagList: tagList
        })
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenarr: [],
    threearr: [],
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight, //头部按钮的高度
    chioceIndex: 0, //当前在第几层,
    brandTab: 0,
    _category: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: function () {
      var that = this;
      console.log('筛选的id', that.data._initialParentId)
      that.util('open')
      console.log('isConfirm', that.data.isConfirm)
      if (that.data.isConfirm) {
        that.setData({
          searchid: ''
        })
        return
      }
      let chioceIndex = 0
      let variable = 'screenarr[' + chioceIndex + ']'
      that.setData({
        searchid: that.data._initialParentId,
        [variable]: ''
      })
      that.data.onescData.forEach((v, k) => {
        if (v.id == that.data._initialParentId) {
          var event = {
            currentTarget: {
              dataset: {
                topname: v.cname,
                id: that.data._initialParentId
              }
            }
          }
          that.shopcidclick(event)
        }
      })
    },

    //第一层的点击事件
    shopcidclick: function (e) {
      var that = this
      let id = e.currentTarget.dataset.id
      console.log(id)
      if (id == 0) {
        this.setData({
          isShow: false
        })
      } else {
        this.setData({
          isShow: true
        })
      }
      let chioceIndex = 0
      let variable = 'screenarr[' + chioceIndex + ']'
      that.setData({
        onescrTitle: e.currentTarget.dataset.topname,
        [variable]: id,
        chioceIndex: id == 0 ? 0 : 1,
        searchid: '',
        firstid: id
      })
      // that._success(id)
      let data2 = {
        parentId: id
      }
      //查询点击这个类目下的类目
      api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
        e.data.unshift({
          cname: '全部',
          id: id,
          isCommendDisplay: '1',
          isClick: true
        })
        that.setData({
          twoscData: e.data,
          ['screenarr[1]']: id,
          threescData: e.data,
          ['threescData[' + 0 + '].isclick']: true,
          brandId: '',
          brandTab: 0
        })

        var _category = that.data._category
        if (!_category) {
          return
        }
        e.data.forEach(function (item, index) {
          if (_category.id == item.id) {
            //模拟点击
            var event = {
              currentTarget: {
                dataset: {
                  index: index,
                  topname: item.cname,
                  id: item.id
                }
              }
            }
            if (index > 0) {
              that.twoshopcidclick(event)
            }
          }
        })
      })
    },

    //第二级点击事件
    twoshopcidclick: function (e) {
      var that = this
      let id = e.currentTarget.dataset.id
      let index = e.currentTarget.dataset.index
      let chioceIndex = 1
      let variable = 'screenarr[' + chioceIndex + ']'
      that.setData({
        twoscrTitle: e.currentTarget.dataset.topname,
        [variable]: id,
        chioceIndex: index == 0 ? 1 : 2,
        threearr: []
      })
      // that._success(id)
      let data2 = {
        parentId: id
      }
      that.getBrandList(id)
      //查询点击这个类目下的类目
      api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
        e.data.unshift({
          id: id,
          cname: '全部',
          isCommendDisplay: '1',
          isClick: true
        })
        that.setData({
          threescData: e.data,
          ['threescData[' + 0 + '].isclick']: true,
          brandTab: 0,
          brandId: ''
        })
        // console.log('附属分类', that.data.threescData)
      })
    },

    // 品牌点击
    BrAndQitClick: function (e) {
      let index = e.currentTarget.dataset.index
      let id = e.currentTarget.dataset.id
      this.setData({
        brandTab: index,
        brandId: id
      })
    },

    //查询品牌
    getBrandList: function (id) {
      var that = this
      let datapingpai = {
        cid: id
      }
      api.request('/rest/tWebMallItemCatControllerApi/getBrandList', datapingpai, 'GET', function (e) {
        e.data.unshift({
          name: '全部',
          id: ''
        })
        that.setData({
          BrandList: e.data, //子分类  例如瓷砖下的分类
          brandId: ''
        })
        console.log('品牌列表', that.data.BrandList)
      })
    },

    //第三层点击事件
    threeshopcidclick(e) {
      console.log('第三层')
      let index = e.currentTarget.dataset.index
      let threescData = this.data.threescData
      threescData.forEach((v, k) => {
        this.setData({
          [`threescData[${k}].isClick`]: false
        })
      })
      if (index == 0) {
        this.setData({
          [`threescData[0].isClick`]: true
        })
      } else {
        threescData[index].isClick = threescData[index].isClick ? false : true
        let findIndex = threescData.findIndex(obj => obj.isClick)
        this.setData({
          [`threescData[${index}].isClick`]: threescData[index].isClick,
          [`threescData[0].isClick`]: findIndex == -1 ? true : false,
        })
      }
    },

    threeshopcidclickff: async function (e) {
      console.log('第三层')
      var that = this
      let index = e.currentTarget.dataset.index
      let threescData = that.data.threescData
      let setvalue = 'threescData[' + index + '].isclick'
      let isclick = e.currentTarget.dataset.isclick
      let id = e.currentTarget.dataset.id
      let setvalue1 = 'threearr[' + index + ']'
      //点击的如果是全部 
      if (index == 0) {
        console.log('点击')
        that.setData({
          ['screenarr[2]']: '',
          threearr: [],
          [`threescData[0].isclick`]: true
        })
        that.setData({
          noclick: true
        })
        threescData.forEach((v, k) => {
          if (v.id == -1) {
            that.setData({
              noclick: true
            })
          } else {
            let setvalue = 'threescData[' + k + '].isclick'
            that.setData({
              [setvalue]: false
            })
          }
        })
        return false
      } else {
        let setvalue = 'threescData[0].isclick'
        that.setData({
          [setvalue]: false,
          noclick: false
        })
      }
      // threearr
      if (isclick) {
        that.setData({
          [setvalue]: false,
          // [setvalue1]: ''
        })
        let iscunzai = that.data.threearr.findIndex(obj => obj == id)
        if (iscunzai != -1) {
          that.data.threearr.splice(iscunzai, 1)
        }
      } else {
        that.setData({
          [setvalue]: true,
          // [setvalue1]: id
        })
        that.data.threearr.push(id)
      }
      //处理为字符串
      // let threearr = (await that.threearr(that.data.threearr)).join(',')
      // console.log(threearr)
      let chioceIndex = 2
      let variable = 'screenarr[' + chioceIndex + ']'
      that.setData({
        threescrTitle: e.currentTarget.dataset.topname,
        [variable]: that.data.threearr.join(','),
        chioceIndex: 3
      })
      // that._success(id)
      // let data2 = {
      //   parentId: id
      // }
      // //查询点击这个类目下的类目
      // api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
      //   that.setData({
      //     fourscData: e.data,
      //   })
      // })
    },

    // 处理为字符串
    threearr: function (e) {
      console.log(e)
      return new Promise((resove, reject) => {
        let arr = []
        let arrlength = 0
        e.forEach((v, k) => {
          console.log(arrlength + 1)
          if (v) {
            arr.push(v)
          }
        })
        resove(arr)
      })

    },

    //返回上一曾事件
    black: function (e) {
      var that = this
      let index = e.currentTarget.dataset.index
      console.log('当前页index', index)
      that.setData({
        chioceIndex: index - 1
      })

    },

    //重置数据
    reset: function () {
      var that = this
      console.log('twoscData', that.data.onescData)
      var tagList = that.data.tagList

      for (var i = 0; i < tagList.length; i++) {
        tagList[i].selected = false
      }

      that.setData({
        // screenarr: [],
        // chioceIndex: 0,
        tagList: tagList
      })

      //模拟点击
      var event = {
        currentTarget: {
          dataset: {
            topname: "全部",
            id: 0,
            isCommendDisplay: '1'
          }
        }
      }
      that.shopcidclick(event)
    },

    //筛选事件
    _success: async function (e) {
      var that = this
      var tagList = that.data.tagList
      var tagCodes = ""
      for (var i = 0; i < tagList.length; i++) {
        if (tagList[i].selected) {
          tagCodes += tagList[i].CODE + ","
        }
      }
      tagCodes = tagCodes.substring(0, tagCodes.lastIndexOf(","))

      var cid
      if (that.data.screenarr.length > 0) {
        // cid = that.data.screenarr[that.data.chioceIndex == 3 ? 2 - 1 : (that.data.chioceIndex - 1 == -1 ? 0 : that.data.chioceIndex - 1)]
        let cidMore = function () {
          return new Promise((resove, reject) => {
            let array = []
            let threescData = that.data.threescData
            console.log('threescData', threescData)
            threescData.forEach((v, k) => {
              console.log(v.id)
              if (v.isClick) {
                array.push(v.id)
              }
            })
            resove(array)
          })
        }
        cid = (await cidMore()).join(',')
        console.log('8888', await cidMore())
        console.log('9999', cid)
      } else {
        cid = that.data._category.id
      }

      var myEventDetail = {
        cid: cid,
        extendData: {
          cid: that.data.screenarr[that.data.chioceIndex - 1] || that.data._category.id,
          searchClass: tagCodes,
          firstid: that.data.firstid,
          brandId: that.data.brandId
        }
      }
      var myEventOption = {}
      that.triggerEvent('success', myEventDetail, myEventOption)
      that.setData({
        isConfirm: true
      })
      that.close()
    },

    //关闭筛选组件
    close: function () {
      this.util('close')
      let chioceIndex = 0
      let variable = 'screenarr[' + chioceIndex + ']'
      if (!this.data.isConfirm) {
        this.setData({
          [variable]: ''
        })
      }
    },

    //测试按钮
    test: function () {
      console.log(this.data.onescData)
    },

    // 创建动画开启筛选视图
    util: function (currentStatu) {
      var animation = wx.createAnimation({
        duration: 150, //动画时长
        timingFunction: "linear", //线性
        delay: 0 //0则不延迟
      });
      this.animation = animation;
      animation.translate(0).step();
      this.setData({
        animationData: animation.export()
      })
      var timer = setTimeout(function () {
        animation.translate(-300).step()
        this.setData({
          animationData: animation
        })
        //关闭抽屉
        if (currentStatu == "close") {
          this.setData({
            showModalStatus: false
          });
        }
        clearTimeout(timer)
      }.bind(this), 200)
      if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    },

    onTagTap: function (event) {
      var id = event.currentTarget.dataset.id
      var index = event.currentTarget.dataset.index

      var tagList = this.data.tagList
      tagList[index].selected = !tagList[index].selected

      this.setData({
        tagList: tagList
      })
    }
  }
})