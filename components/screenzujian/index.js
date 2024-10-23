var api = require("../../utils/api.js")
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    choice: {
      type: Array,
      value: '数据'
    },
    toptext: {
      type: String,
      value: '标题'
    },
    newsClassId: {
      type: String,
      value: "栏目id"
    },
    isshop: {
      type: String,
      value: "判断是否有设计师"
    },
    shopid: {
      type: Number,
      value: '商品分类列表的id'
    },
    isindex: {
      type: Number,
      value: '0' //判断商品列表是否是首页进来
    },
    istwo: {
      type: Boolean,
      value: false
    },
    isone: {
      type: Boolean,
      value: false
    },
    //判断是否是本月爆款的筛选
    isbaokuan: {
      type: Boolean,
      value: false
    },
    hiddeone: {
      type: Boolean,
      value: false
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    tabindex: 999,
    hidindex: 0,
    showModalStatus: false,
    zidinarr: [],
    searcharrs: '',
    shejishi: false,
    resourcesps: '全部',
    groupId: '',
    typecode: '',
    ischanpingxilie: false, //判断是否为产品系列,
    screenarr: [],
    qitaarr: [],
    lastbaokuan: false
    // istwo: false
  },

  /**
   * 组件的方法列表
   */


  methods: {
    /**
     * 
     * 点击筛选触发
     * 
     */
    powerDrawerzujian: function (parameters) {
      var that = this;
      let ratio = 750 / wx.getSystemInfoSync().windowWidth;
      let scrollHeight = Math.ceil(wx.getSystemInfoSync().windowHeight * ratio);
      this.setData({
        scrollHeight: scrollHeight,
        toptexts: this.data.toptext,
      })
      console.log(this.data.toptext)
      // if(parameters==1){}else{
        this.util('open')
      // }
      //* 查询分类  例如查询瓷砖分类
      console.log(that.data.shopid)
        if (that.data.istwo) {
          var pid = that.data.shopid
        } else {
          var pid = 0
        }
        let data = {
          parentId: pid
        }
        api.request('/rest/tWebMallItemCatControllerApi/locationList', data, 'GET', function (e) {
          that.setData({
            onetitle: e.data[1].cname
          })
        })
        var parenid = that.data.shopid
      let data2 = {
        parentId: parenid
      }
      api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
        if (that.data.isbaokuan) {
          that.setData({
            onelist: e.data, //子分类  例如瓷砖下的分类
            canchoicemixin: e.data
          })
        } else {
          that.setData({
            canchoicemixin: e.data, //子分类  例如瓷砖下的分类
          })
        }

      })


      //查询品牌
      let datapingpai = {
        cid: that.data.shopid
      }
      api.request('/rest/tWebMallItemCatControllerApi/getBrandList', datapingpai, 'GET', function (e) {
        that.setData({
          brand: e.data, //子分类  例如瓷砖下的分类
        })
      })



      //查询产品系列
      let datashopxilie = {
        typegroupCode: 'erp_has_discount'
      }
      //查询产品系列
      api.request('/rest/dataDictionaryApi/dataDictionary', datashopxilie, 'GET', function (e) {
        that.setData({
          productline: e.data
        })
      })


      //查询规格等


    },

    /**
     * 
     * 第一层的点击事件
     * 
     */
    oneclick: function (e) {
     
      console.log("第一层点击返回的事件：", e)
      let that = this
      that.setData({
        shopid: e.currentTarget.dataset.id,
        baokuanparentid: e.currentTarget.dataset.id,
        shopindex: e.currentTarget.dataset.index,
        toptext: e.currentTarget.dataset.cname //标题栏
      })
     
      if(that.data.isbaokuan){
        wx.showToast({
          title: '加载中',
          icon:'loading',
          duration:1000
        })
        var timer = setTimeout(function(){
          that._success({
            isreturn: 2
          })
          clearTimeout(timer)
        },1000)
      
       
      }
     

    },


    /**
     * 
     * 瓷砖点击事件
     * 
     */
    shopcidclick: function (e) {
      var that = this
      let id = e.currentTarget.dataset.id
      console.log(id)
      var arr = that.data.screenarr
      console.log("第一层", that.data.isone, "第二层", that.data.istwo, "第三层", that.data.thesecondfloor)
      arr[0] = id
      that.setData({
        screenarr: arr,
        baokuanparentid: id,
        istopleimu: true, //是否选择了第二层的类目
        xtoptexts: e.currentTarget.dataset.topname
      })

      //本月爆款的第三层返回上一级
      if (that.data.isbaokuan && !that.data.isone && !that.data.istwo) {
        that.setData({
          lastbaokuan: true
        })
      }
      if(that.data.isbaokuan){
        wx.showToast({
          title: '加载中',
          icon:'loading',
          duration:1000
        })
        setTimeout(function(){
          that._success({
            isreturn: 2
          })
        },1000)
      }
    },

    /**
     * 
     * 点击品牌的事件
     * 
     */
    brandclick: function (e) {
      var that = this
      if (that.data.istopleimu) {

      } else {
        wx.showToast({
          title: '请先选择' + that.data.toptext,
          icon: 'none',
          duration: 1000
        })
        return false
      }


      let id = e.currentTarget.dataset.id
      var arr = that.data.screenarr
      arr[1] = id
      that.setData({
        screenarr: arr
      })
    },
    /**
     * 
     * 系列的点击事件
     * 
     */

    seriesclick: function (e) {
      var that = this
      if (that.data.istopleimu) {

      } else {
        if (that.data.isone) {

        } else {
          wx.showToast({
            title: '请先选择' + that.data.toptext,
            icon: 'none',
            duration: 1000
          })
          return false
        }

      }
      let index = e.currentTarget.dataset.index
      let typecode = e.currentTarget.dataset.typecode
      var arr = that.data.screenarr
      arr[2] = typecode
      that.setData({
        seriesindex: index,
        screenarr: arr
      })
    },




    /**
     * 
     * 
     * 第二级筛选
     * 
     */
    otherfilters: function (e) {
      var that = this
      console.log(e)
      let fatherid = e.currentTarget.dataset.fatherid
      let sonid = e.currentTarget.dataset.sonid
      let index = e.currentTarget.dataset.index
      let arr = that.data.qitaarr
      arr[index] = fatherid + ':' + sonid
      console.log(arr)

      that.setData({
        qitaarr: arr
      })
    },

    /**
     * 
     * 创建动画
     * 
     */

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





    //返回
    isscreen: function () {
      console.log()
      var that = this;
      console.log("第一层：", that.data.isone, "第二层", that.data.istwo, "第三层", that.data.thesecondfloor)
      if (that.data.isbaokuan && that.data.lastbaokuan) {
        var data = {
          parentId: that.data.baokuanparentid
        }
      } else {
        var data = {
          parentId: that.data.shopid
        }
      }
      api.request('/rest/tWebMallItemCatControllerApi/locationList', data, 'GET', function (e) {
        console.log("类目:", e.data)
        console.log("是否在第二层", that.data.istwo)
        if (that.data.istwo) {
          console.log("第二层的返回")
          var locationList = 1
        } else if (that.data.thesecondfloor && that.data.isbaokuan) {
          console.log("第三层返回")
          var locationList = 1
        } else {
          var locationList = 0
          console.log("不是第二层的返回")
        }
        let data1 = {
          parentId: e.data[locationList].id
        }
        that.setData({
          onetitle: e.data[locationList].cname,
          xtoptexts: e.data[locationList].cname,
          baokuanparentid: e.data[locationList].id,
          // shopid:e.data[0].id
        })
        api.request('/rest/tWebMallItemCatControllerApi/getChildList', data1, 'GET', function (e) {
          //返回第一层需要渲染的数据
          that.setData({
            onelist: e.data
          })
        })
      })

      if (that.data.istwo) {
        console.log("返回到第一层")
        that.setData({
          isone: true,
          istwo: false,
          thesecondfloor: false
        })

      } else if (that.data.thesecondfloor) {
        console.log("进入")
        if (that.data.lastbaokuan) {
          console.log("静如")
          that.setData({
            isone: false,
            istwo: false,
            thesecondfloor: true,
            lastbaokuan: false
          })
        } else {
          that.setData({
            isone: false,
            istwo: true,
            thesecondfloor: false,
          })
        }

      }
      that.reset()
      that._success({
        isreturn: 1
      })

    },









    /**
     * 
     * 重置数据
     * 
     */
    reset: function (e) {
      var that = this
      that.setData({
        shopindex: -1,
        // shopid: ''
      })


      var arr = that.data.screenarr
      console.log("thesecondfloor", that.data.thesecondfloor)
      if (that.data.thesecondfloor) {
        
      } else {
        arr[0] = ''
      }

      arr[1] = '',
        arr[2] = '',
        arr[3] = '',
        that.setData({
          screenarr: arr,
          qitaarr: []
        })
      try {
        if (e.currentTarget.dataset.isone) {
          // that.setData({
          //   shopid: ''
          // })
        }
      } catch (error) {
        // 此处是负责例外处理的语句
      } finally {
        // 此处是出口语句
      }

    },

    /**
     * 
     * 
     * 确定
     * 
     * 
     */
    async _success(e) {
      var that = this
      console.log("shopid为－－－－－", that.data.shopid)
      var isclickandno = e.isreturn
      console.log(isclickandno)



      // 如果不是点返回的确定
      if (isclickandno != 1) {
        if (that.data.shopid == 0) {
          console.log(that.data.shopid)
          wx.showToast({
            title: '请选择一个分类',
            icon: 'none',
            duration: 1000
          })
          return false;
        } else if (that.data.isbaokuan) {
          if (that.data.istwo || that.data.thesecondfloor || that.data.lastbaokuan) {
            console.log("判断是否选中", that.data.screenarr[0])
            if (that.data.screenarr[0] == '' || that.data.screenarr[0] == undefined) {
              wx.showToast({
                title: '请选择一个分类',
                icon: 'none',
                duration: 1000
              })
              return false;
            }

          }
        }


        if (that.data.isone) {
          that.setData({
            isone: false,
            istwo: true
          })
        } else if (that.data.istwo) {
          that.setData({
            istwo: false,
            thesecondfloor: true
          })
        }

      } else {}
      wx.showLoading({
        title: '加载中',
      })
      var arr = []
      that.data.qitaarr.forEach(function (v, k) {
        if (v == null) {} else {
          arr.push(v)
        }
      })
      if (that.data.isbaokuan) {
        var cid = that.data.shopid

        console.log(cid)
      } else {
        var cid = that.data.screenarr[0]
      }
      var extenddata = {
        cid: cid,
        brandId: that.data.screenarr[1],
        searchClass: that.data.screenarr[2],
        propRxId: that.data.screenarr[3],
        pname: arr.join(';'),
      }
      // 筛选后的数据 使其渲染
      if (that.data.screenarr[0] != '' && that.data.screenarr[0] != undefined) {
        var typeid = that.data.screenarr[0]
      } else {
        var typeid = that.data.shopid
      }
      let data1 = {
        start: 1,
        pageSize: 12,
        typeId: typeid,
        newsClassId: that.data.newsClassId,
        extendData: extenddata,
      }
      //如果是爆款页面的筛选
      if (that.data.isone) {
        var baokuanpd = cid
      } else {
        // 点返回的刷新事件
        if (isclickandno == 1) {
          let dataclick = {
            parentId: that.data.baokuanparentid
          }
          var baokuanpd = await that.getLocationList(dataclick) //Promise { baokuanpd }
        } else {
          var baokuanpd = that.data.baokuanparentid

        }
      }
      console.log("baokuanpd", baokuanpd)
      let data2 = {
        start: 1,
        pageSize: 12,
        cid: baokuanpd
      }
      if (that.data.isbaokuan) {
        api.request('/rest/tWebPromotionsControllerApi/getHotDetailsList', data2, 'GET', function (e) {
          if (e) {
            wx.hideLoading({})
            var myEventDetail = {
              extendData: extenddata,
              typeid: that.data.shopid,
              concats: e.data.list,
              chuancon: e.data,
              Hotcid: baokuanpd,
              // toptext:that.data.toptext
            }
            var myEventOption = {}
            that.triggerEvent('success', myEventDetail, myEventOption)
          }
        })
      } else {
        api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
          if (e) {
            wx.hideLoading({})
          }
          var myEventDetail = {
            extendData: extenddata,
            typeid: that.data.shopid,
            concats: e.data.list,
            chuancon: e.data,
            toptext: that.data.toptext
          }
          var myEventOption = {}
          that.triggerEvent('success', myEventDetail, myEventOption)
          console.log(that.data.screenarr[0])
          if (that.data.screenarr[0] != '' && that.data.screenarr[0] != undefined) {
            that.setData({
              thesecondfloor: true //判断是否显示规格
            })
            let datatypecid = {
              cid: that.data.screenarr[0]
            }
            api.request('/rest/tWebMallItemCatControllerApi/getMallItemProp', datatypecid, 'GET', function (e) {
              var qitachoice = e.data
              that.setData({
                qitachoice: qitachoice
              })
            })
          } else {}

        })
      }
if (isclickandno==2 && that.data.isbaokuan){
this.powerDrawerzujian(1)
}else if(isclickandno==1 && that.data.isbaokuan){
  this.powerDrawerzujian(1)
}

else{
  this.util('close')
}
     
      if (that.data.isbaokuan) {
        var arr = that.data.screenarr
        arr[0] = ''
        that.setData({
          screenarr: arr
        })
      }

    },
    /**
     * 
     * 点击蒙层关闭弹窗
     */
    powerDrawerclose: function () {
      this.util('close')
    },

    getLocationList: function (dataclick) {
      return new Promise((resolve, reject) => {
        api.request('/rest/tWebMallItemCatControllerApi/locationList', dataclick, 'GET', function (e) {
          var baokuanpd = e.data[1].id
          resolve(baokuanpd)
        })
      })
    },

    //测试
    testa:function(e){
      var that = this
console.log(that.data.isone)
console.log(that.data.onelist)
console.log('是否在第二层',that.data.istwo)
    }


  }


})