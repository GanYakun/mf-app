var api = require("../../utils/api.js")
var app = getApp()
var isConsole = app.globalData.isConsole
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
    isallshopfenlei: {
      type: String,
      value: '判断是否是产品分类'
    },
    customization:{
      type:Object,
      value:'',
      observer:function(newVal,oldVal){
        if(isConsole){
          console.log("newVal",newVal)
        }
        this.setData({
          _customization:newVal
        })
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabindex: 999,
    hidindex: 0,
    showModalStatus: false,
    isscreen: false,
    zidinarr: [],
    searcharrs: '',
    shejishi: false,
    // resourcesps: '全部',
    resourcesps: '',
    groupId: '',
    typecode: '',
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
    ischanpingxilie: false      //判断是否为产品系列
  },

  /**
   * 组件的方法列表
   */


  methods: {
    powerDrawerzujian: function () {
      let scrollHeight = wx.getSystemInfoSync().windowHeight;
      console.log(scrollHeight)
      this.setData({
        scrollHeight: scrollHeight,
        toptexts: this.data.toptext,
        isscreen: false
      })
      console.log(this.data.toptext)
      this.util('open')
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
      var timer = setTimeout(function () {
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
        clearTimeout(timer)
      }.bind(this), 200)
      // 显示抽屉
      if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    },


    /**
     * 
     * 
     * 进入筛选第二级栏目
     *  
     * */
    chioce: function (e) {

      var that = this
      that.setData({
        ArrIndex:e.currentTarget.dataset.index
      })
      //如果是产品列表页
      console.log(that.data.isshop)
      if (that.data.isshop == 1) {
        //如果点击了产品分类
        console.log(that.data.isallshopfenlei)
        if (that.data.isallshopfenlei == 1) {
          if (e.currentTarget.dataset.index == 0) {
            wx.navigateBack({
              delta: 1,
            })
          }
          //点击的是瓷砖等系列
          else if (e.currentTarget.dataset.index == 1) {
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext,
              isclosetanchuang: 1,                      //用于子页点击后直接关闭弹窗
              isshowall:1                     //用于判断子栏目列表中是否显示全部这两个字
            })
            let data2 = {
              parentId: that.data.shopid
            }
            api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
              that.setData({
                canchoicemixin: e.data,
                ischanpingxilie: false
              })
            })
          }
          //点击了产品系列
          else {
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext
            })
            //传的参数
            let data2 = {
              typegroupCode: 'erp_has_discount'
            }
            //查询产品系列
            api.request('/rest/dataDictionaryApi/dataDictionary', data2, 'GET', function (e) {
              var canchoicemixinsa = []
              //为了让格式与其他的数据筛选数据一样，方便组件的使用
              e.data.forEach(function (v, k) {
                canchoicemixinsa.push({
                  id: v.typecode,
                  cname: v.typename
                })
              })

              that.setData({
                canchoicemixin: canchoicemixinsa,
                ischanpingxilie: true
              })
            })
          }
        }
        else {
       
          console.log(e)
          if(e.currentTarget.dataset.toptext=='品牌'){
            var  canchoicemixinsa = []
            that.data.pingpai.forEach(function (v, k) {
              canchoicemixinsa.push({
                id: v.pname,
                cname: v.pname
              })
            })
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext,
              canchoicemixin:canchoicemixinsa
            })
            
          }
          else if(e.currentTarget.dataset.toptext=='热推'){
            var  canchoicemixinsa = []
            that.data.pingpai.forEach(function (v, k) {
              canchoicemixinsa.push({
                id: v.id,
                cname: v.name
              })
            })
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext,
              canchoicemixin:canchoicemixinsa
            })
          }
          else{
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext
            })
            //传的参数
            let data2 = {
              typegroupCode: 'erp_has_discount'
            }
            //查询产品系列
            api.request('/rest/dataDictionaryApi/dataDictionary', data2, 'GET', function (e) {
              var canchoicemixinsa = []
              //为了让格式与其他的数据筛选数据一样，方便组件的使用
              e.data.forEach(function (v, k) {
                canchoicemixinsa.push({
                  id: v.typecode,
                  cname: v.typename
                })
              })
  
              that.setData({
                canchoicemixin: canchoicemixinsa,
                // ischanpingxilie: true
              })
            })
          }

          that.setData({
            taduofenbuqing:true
          })
          }
        

      }
      // 如果是本月爆款的产品列表页
      else if(that.data.isshop == 2){
        //如果点击了产品分类
        if (that.data.isallshopfenlei == 1) {
          if (e.currentTarget.dataset.index == 0) {
            wx.navigateBack({
              delta: 1,
            })
          }
          //点击的是瓷砖等系列
          else if (e.currentTarget.dataset.index == 1) {
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext,
              isclosetanchuang: 1,                      //用于子页点击后直接关闭弹窗
              isshowall:1                     //用于判断子栏目列表中是否显示全部这两个字
            })
            let data2 = {
              parentId: that.data.shopid
            }
            api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
              that.setData({
                canchoicemixin: e.data,
                ischanpingxilie: false
              })
            })
          }
          //点击了产品系列
          else {
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext
            })
            //传的参数
            let data2 = {
              typegroupCode: 'erp_has_discount'
            }
            //查询产品系列
            api.request('/rest/dataDictionaryApi/dataDictionary', data2, 'GET', function (e) {
              var canchoicemixinsa = []
              //为了让格式与其他的数据筛选数据一样，方便组件的使用
              e.data.forEach(function (v, k) {
                canchoicemixinsa.push({
                  id: v.typecode,
                  cname: v.typename
                })
              })

              that.setData({
                canchoicemixin: canchoicemixinsa,
                ischanpingxilie: true
              })
            })
          }
        }
        else {
       
          console.log(e)
          if(e.currentTarget.dataset.toptext=='品牌'){
            var  canchoicemixinsa = []
            that.data.pingpai.forEach(function (v, k) {
              canchoicemixinsa.push({
                id: v.pname,
                cname: v.pname
              })
            })
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext,
              canchoicemixin:canchoicemixinsa
            })
            
          }
          else if(e.currentTarget.dataset.toptext=='热推'){
            var  canchoicemixinsa = []
            that.data.pingpai.forEach(function (v, k) {
              canchoicemixinsa.push({
                id: v.id,
                cname: v.name
              })
            })
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext,
              canchoicemixin:canchoicemixinsa
            })
          }
          else{
            that.setData({
              xuanzeindex: e.currentTarget.dataset.index,
              shejishi: false,
              isscreen: true,
              toptext: e.currentTarget.dataset.toptext
            })
            //传的参数
            let data2 = {
              typegroupCode: 'erp_has_discount'
            }
            //查询产品系列
            api.request('/rest/dataDictionaryApi/dataDictionary', data2, 'GET', function (e) {
              var canchoicemixinsa = []
              //为了让格式与其他的数据筛选数据一样，方便组件的使用
              e.data.forEach(function (v, k) {
                canchoicemixinsa.push({
                  id: v.typecode,
                  cname: v.typename
                })
              })
  
              that.setData({
                canchoicemixin: canchoicemixinsa,
                // ischanpingxilie: true
              })
            })
          }

          that.setData({
            taduofenbuqing:true
          })
          }
        
      }
      else {
        that.setData({
          xuanzeindex: e.currentTarget.dataset.index,
          shejishi: false,
          isscreen: true,               //是否显示确定
          toptext: e.currentTarget.dataset.toptext
        })
        let data2 = {
          searchCode: e.currentTarget.dataset.listchioce
        }
        api.request('/rest/tWebSearchOptionControllerApi/getSrarchOptionsBySearchCode', data2, 'GET', function (e) {
          that.setData({
            canchoicemixin: e.data
          })
        })
      }
    },


    xsource: function (e) {
      var that = this
      console.log(e.currentTarget.dataset.index)
      that.setData({
        isscreen: true,
        toptext: e.currentTarget.dataset.toptext,
       
          ArrIndex:e.currentTarget.dataset.index
        
      })
      let data2 = {

      }
      api.request('/rest/tWebSearchOptionControllerApi/getDesingerSearchOption', data2, 'GET', function (e) {
        that.setData({
          shejishi: true,
          canchoicemixin: e.data
        })
      })
    },

    //返回
    isscreen: function () {

      console.log(this.data.toptexts)
      this.setData({
        isscreen: false,
        // toptext: this.data.toptexts
      })
    },

    /**
     * 
     * 选择列表里的数据
     * 
     */
    chiocetext: function (e) {
      var that = this
      that.setData({
        customization:''    //不显示页面传来的数据，显示选中的数据
      })
      console.log(that.data.ischanpingxilie)
      console.log(that.data.isclosetanchuang)
      var typeid = e.currentTarget.dataset.id
      let setvalue = 'ArrChioce['+that.data.ArrIndex+']'
      that.setData({
        [setvalue]:typeid
      })
      if(that.data.taduofenbuqing){
        
      }else{
        that.setData({
          typecid:typeid
        })
      }

      //如果是设计师
      if (that.data.shejishi) {
        console.log(e)
        that.setData({
          resourcesps: e.currentTarget.dataset.chtext,
          groupId: e.currentTarget.dataset.id,
          isscreen: false,
          toptext: this.data.toptexts
        })
      }
      //如果是产品系列
      
      else if (that.data.ischanpingxilie) {

        var index = that.data.xuanzeindex

        if (e.currentTarget.dataset.id == '') {
          that.setData({
            typecode: ''
          })
        } else {
          that.setData({
            typecode: e.currentTarget.dataset.id
          })
        }
        let text = e.currentTarget.dataset.chtext
        // 让选择的数据渲染进去
        let list = 'choice[' + index + '].select'
        that.setData({
          [list]: text,
          isscreen: false,
          toptext: this.data.toptexts
        })
      }

      // 如果点的是瓷砖系列或者其他系列

      else if (that.data.isclosetanchuang == 1) {
        wx.showLoading({
          title: '加载中',
        })
             //判断品牌和人气是否显示
             let datatypecid={
              cid:that.data.typecid
            }
            api.request('/rest/tWebMallItemCatControllerApi/getMallItemProp', datatypecid, 'GET', function (e) {
             var pingpai = e.data
             that.setData({
              pingpai:pingpai
            })
            })
            api.request('/rest/tWebMallItemCatControllerApi/getMallItemPropRx', datatypecid, 'GET', function(e){
              var retui = e.data
              that.setData({
                retui:retui
              })
            })
        that.setData({
          isshowall:0
        })
        this.util('close')
        let extenddata = { "leaf": "1" }
        let data1 = {
          start: 1,
          pageSize: 12,
          typeId: typeid,
          newsClassId: this.data.newsClassId,
          extendData: extenddata,
      
        }

        // 筛选后的数据 使其渲染
        api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
          console.log(e)
          if (e) {
            wx.hideLoading({

            })
          }
          var myEventDetail = {
            extendData: extenddata,
            typeid: typeid,
            concats: e.data.list,
            chuancon: e.data,
            isclick: 1,
            pingpai:that.data.pingpai,
            retui:that.data.retui
          }
          var myEventOption = {}
          that.triggerEvent('success', myEventDetail, myEventOption)

        })
      
         that.setData({
          isclosetanchuang:999
         })
        return false;
      }
      else {
        if (e.currentTarget.dataset.id == '') {
          var index = that.data.xuanzeindex
          var arrs = that.data.zidinarr
          console.log(arrs)
          arrs.splice(index, 1);
          that.setData({
            zidinarr: arrs
          })
        }
        else {
          var index = that.data.xuanzeindex
          var arrs = that.data.zidinarr
          console.log(arrs)
          arrs[index] = e.currentTarget.dataset.id
          that.setData({
            zidinarr: arrs
          })
        }
        let text = e.currentTarget.dataset.chtext
        // 让选择的数据渲染进去
        let list = 'choice[' + index + '].select'
        that.setData({
          [list]: text,
          isscreen: false,
          toptext: this.data.toptexts

        })
      }
    },

    //取消
    cancel: function () {
      this.util('close')
    },
    powerDrawerclose: function () {
      this.util('close')
      this.triggerEvent('close')  
    },

    // 确定
    _success(e) {
      wx.showLoading({
        title: '加载中',
      })
      var that = this
      console.log(that.data.isshop)
      // 如果组件在商品的分类列表中
      if (that.data.isshop == 1) {
        let shopid = that.data.shopid
        // 如果没有点击瓷砖
        if (that.data.zidinarr == '') {
          var searcharr = ['', shopid]
        }
        else {
          var searcharr = that.data.zidinarr
        }
        
        console.log(searcharr)
        // // 如果选择了品牌和热推
        if(that.data.taduofenbuqing){
          let extenddatatest={
            leaf:1,
            pname:searcharr[0],
            searchClass:searcharr[1]
          }
          var  extenddata=JSON.stringify(extenddatatest)
          var xtypechanpingid = that.data.typecid
          console.log()
        }else{
          var extenddata = {
            searchClass: that.data.typecode
          }
          var xtypechanpingid = searcharr[1]
        }
        
        let data1 = {
          start: 1,
          pageSize: 12,
          typeId: xtypechanpingid,
          newsClassId: this.data.newsClassId,
          extendData: extenddata,
        }

        // 筛选后的数据 使其渲染
        api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
          console.log(e)
          if (e) {
            wx.hideLoading({

            })
          }
          var myEventDetail = {
            extendData: extenddata,
            typeid: xtypechanpingid,
            concats: e.data.list,
            chuancon: e.data,
          }
          var myEventOption = {}
          that.triggerEvent('success', myEventDetail, myEventOption)
          that.setData({
            searcharrs: ''
          })
        })
        this.util('close')
      }


      else {


        var searcharr = that.data.zidinarr
        console.log(searcharr)
        console.log(that.data.searcharrs)
        searcharr.forEach(function (v, k) {
          var searcharrs = that.data.searcharrs.concat(v + ",")
          that.setData({
            searcharrs: searcharrs
          })
        })
        console.log(that.data.searcharrs)
        var extendData = {
          searchOption: that.data.searcharrs,
          designerId: that.data.groupId,
          descOrAsc: ''
        }
        let data1 = {
          start: 1,
          pageSize: 12,
          newsClassId: this.data.newsClassId,
          extendData: JSON.stringify(extendData)
        }
        console.log(data1)

        // 筛选后的数据 使其渲染
        api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
          console.log(e)
          if (e) {
            wx.hideLoading({
            })
          }
          var myEventDetail = {
            extendData: extendData,
            chuancon: e.data,
          }
          var myEventOption = {}
          that.triggerEvent('success', myEventDetail, myEventOption)
          that.setData({
            searcharrs: ''
          })
        })
        this.util('close')
      }

    },


    // 重置
    Reset:function(){
      var that = this
      let choicefor = that.data.choice
      choicefor.forEach((v,k)=>{
let list = 'choice['+k+'].select'
that.setData({
  [list]:''
})
      })
      // select
      // let list = 'choice[' + index + '].select'
      that.setData({
        // choice:'',
        zidinarr:[]
      })
    }

  }


})
