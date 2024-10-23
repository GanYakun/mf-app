var api = require('../../utils/api.js');
var app = getApp()
import requeseCenter from '../../http/request-center'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    advObjectId:{   //用来判断是否广告图筛选的列表
      type:Boolean,
      value:false
    },
    _initialParentId: {
      type: Number,
      value: 0,
    },
    Pagetext: {
      type: String,
      value: '',
      observer:function(newVal,oldVal){
        console.log(newVal)
      }
    },
    theNumber: {
      type: Number, //组件在第几层
      value: ''
    },
    isRightClick:{
      type:Boolean,
      value:false,
      observer:function(newVal,oldVal){
        this.setData({
          _isRightClick:newVal
        })
      }
    }
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenarr: [],
    chioneId: [], //存放选中的id
    Title: [], //存放表题的数组
    chioceIndex: 0, //当前在第几层
    BrandList: [],
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    searchClass:[],
    seriesCode:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: async function () {
      var that = this;
      console.log('筛选的id', that.data._initialParentId)
      that.util('open')
      // that.getMallItemCommonIdentification(that.data._initialParentId)
      if (that.data.isThismethod == 1) {
        if(!this.data._isRightClick){
          return false
        }
        this.setData({
          searchClass:[]
        })
       
      }
    //查询产品标签
    // api.newget('/rest/dataDictionaryApi/dataDictionary?typegroupCode=product_tag',{},'GET',(res)=>{
    //   this.setData({
    //     shopLabel:res.data
    //   })
    // })
    api.request("/rest/tWebMallItemSkuControllerApi/getTagList", {}, "GET", (res) => {
      var tagList = res && res.data ? res.data : []
      console.log('标签列表', tagList)
      that.setData({
        shopLabel: tagList
      })
    })
    this.getMallItemUnProp(that.data._initialParentId)
      let theNumberHowMuchfun = await that.theNumberHowMuch()
      let data = {
        parentId: that.data._initialParentId
      }
      
      //查询刚进来的筛选栏目
      api.request('/rest/tWebMallItemCatControllerApi/getChildList', data, 'GET', function (e) {
        console.log('ggtt',data)
        if(e.data.length==0){
          // that.setData({
          //   theNumber:2
          // })
        }
        e.data.unshift({
          cname: '全部',
          id: that.data._initialParentId
        })
        let parameter = 'screenarr[' + that.data.theNumber + '].arr'
        let parameter1 = 'Title[' + that.data.theNumber + ']'
        that.setData({
          [parameter]: e.data,
          [parameter1]: that.data.Pagetext
        })
        console.log(that.data.screenarr)
      })
      that.setData({
        isThismethod: 1
      })
    },

    //判断刚开始筛选时在第几层
    theNumberHowMuch: function () {
      var that = this
      return new Promise((resove, reject) => {
        let dataloc = {
          parentId: that.data._initialParentId
        }
        api.request('/rest/tWebMallItemCatControllerApi/locationList', dataloc, 'GET', function (e) {
           //这里是为了只让全屋子套餐的显示系列筛选项
           if(e.data&&e.data[1]&&e.data[0].id!=638){
            if(e.data&&e.data[1]&&e.data[1].id!=638){
              that.setData({
                isSeries:true
              })
            }
          }
          /**
           * 这里注释掉了调用获取系列类别的接口
           */
        // that.getMallItemCommonIdentification(that.data._initialParentId)

          if(!e.data[0]){ 
            let setvalue = 'chioneId[0]'
            that.setData({
              theNumber: 0,
              [setvalue]:that.data._initialParentId
            })
          }
         else if (e.data[0].id == 0) {
            let setvalue = 'chioneId[0]'
            that.setData({
              theNumber: 0,
              [setvalue]:that.data._initialParentId
            })
          } 
          // 判断是否是广告图进来的
          else if(e.data.length>2){
            console.log('是否是广告图', e.data[1].id)
            that.black()
            let setvalue = 'chioneId[0]'
            that.setData({
              newinitialParentId: e.data[0].id,
              [setvalue]:e.data[1].id
            })
            that.getBrandList(that.data._initialParentId)
            let data2 = {
            parentId: e.data[1].id
            }
            //查询点击这个类目下的类目
            api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (res) {
              console.log('测试',res)
              e.data.unshift({
                cname: '全部',
                id: that.data._initialParentId
              })
              let screenarr = 'screenarr[1].arr'
            let setvalue1 =  'chioneId[1]'
            console.log(e.data)
              that.setData({
                [screenarr]: res.data,
                theNumber: 2,
                [setvalue1]:e.data[3].id
              })
            })
         
          }
          else{
            console.log('测试')
            that.black()
            let setvalue = 'chioneId[0]'
            that.setData({
              newinitialParentId: e.data[0].id,
              [setvalue]:that.data._initialParentId
            })

            that.getBrandList(that.data._initialParentId)
            let data2 = {
              parentId: that.data._initialParentId
            }
            //查询点击这个类目下的类目
            api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
              e.data.unshift({
                cname: '全部',
                id: that.data._initialParentId
              })
              let screenarr = 'screenarr[2].arr'
            let setvalue1 =  'chioneId[1]'
              that.setData({
                [screenarr]: e.data,
                theNumber: 1,
                [setvalue1]:that.data._initialParentId
              })
             let timer =  setTimeout(() => {
                if(e.data&&e.data.length==1){
                  that.subsidiary({id:that.data._initialParentId,topname:'全部'})
                }
                clearTimeout(timer)
              }, 1000);
              
            })
          }
          console.log(e.data[1])
          that.setData({
            Pagetext:e.data[1].name?e.data[1].name:e.data[1].cname
          })
          resove(e.data.name?e.data.name:e.data[1].cname)
        })
      })
    },



    //筛选的类目的点击事件 第零层的筛选  比较特殊
    shopcidclick: function (e) {
      console.log("shopcidclick", e)
      var that = this
      let indexs = e.currentTarget.dataset.indexs
      console.log(indexs)
      let index = 0
      let id = e.currentTarget.dataset.id
      let variable = 'chioneId[' + index + ']'
      let variable1 = 'chioneId[' + index + 1 + ']'
      let title = 'Title[' + index + 1 + ']'
      let setvalue='chioneId[2]'    //使品牌设置为空
      that.setData({
        [title]: e.currentTarget.dataset.topname,
        [variable]: id,
        [variable1]: '',
        [setvalue]:''
      })
      that.getBrandList(id)
      that.getMallItemUnProp(id)
      let data2 = {
        parentId: id
      }
      //查询点击这个类目下的类目
      api.request('/rest/tWebMallItemCatControllerApi/getChildList', data2, 'GET', function (e) {
        e.data.unshift({
          cname: '全部',
          id: id
        })
        let screenarr = 'screenarr[' + index + 1 + '].arr'
        let setvalue =  'chioneId[1]'
        that.setData({
          [screenarr]: e.data,
          theNumber: indexs == 0 ? 0 : 1,
          theNumber: indexs == 0 ? 0 : 2,
          [setvalue]:id
        })
      })
    },

    //附属分类点击事件
    subsidiary: function (e) {
      console.log("shopcidclick", e)
      var that = this
      let id = e.currentTarget&&e.currentTarget.dataset.id?e.currentTarget.dataset.id:e.id
      let variable = 'chioneId[' + 1 + ']'
      let title = 'Title[' + 2 + ']'
      that.setData({
        [title]: e.currentTarget&&e.currentTarget.dataset.topname?e.currentTarget.dataset.topname:e.topname,
        [variable]: id,
        theNumber: 2
      })
      // that.getMallItemProp(id)
      that.getMallItemUnProp(id)
    },

    //其他层的点击事件
    otherClick: function (e) {
      console.log('点击的名字为', e.currentTarget.dataset.topname)
      var that = this
      let index = e.currentTarget.dataset.index
      let indexs = index + 1
      console.log('设置下一个页面的标题用到', indexs)
      let id = e.currentTarget.dataset.id
      let variable = 'chioneId[' + index + ']'
      let title = 'Title[' + indexs + ']'
      that.getBrandList(id)
      that.setData({
        [title]: e.currentTarget.dataset.topname,
        [variable]: id,
      })
    },

    //品牌和规格点击事件
    BrAndQitClick: function (e) {
      var that = this
      let index = e.currentTarget.dataset.index
      let itemIndex = e.currentTarget.dataset.itemIndex
      let id = e.currentTarget.dataset.id
      let type = e.currentTarget.dataset.type //type=1为规格  type=0为品牌
      if(type==1){
        var SubID = 'chioneId[' + index + '].SubID[' + type + '].norms['+itemIndex+']'
      }else{
        var SubID = 'chioneId[' + index + '].SubID[' + type + ']'
      }
      
      that.setData({
        [SubID]: id||''
      })
      console.log(that.data.chioneId)
    },

    //查询品牌
    getBrandList: function (e) {
      var that = this
      let datapingpai = {
        cid: e
      }
      api.request('/rest/tWebMallItemCatControllerApi/getBrandList', datapingpai, 'GET', function (e) {
        e.data.unshift({
          name: '全部',
          id: ''
        })
        that.setData({
          BrandList: e.data, //子分类  例如瓷砖下的分类
        })
      })
    },

    //查询规格
    getMallItemProp: function (e) {
      var that = this
      let datatypecid = {
        cid: e
      }
      api.request('/rest/tWebMallItemCatControllerApi/getMallItemProp', datatypecid, 'GET', function (e) {
        e.data.forEach((v, k) => {
          let setvalue = 'qitachoice[' + k + '].propValueList'
          v.propValueList.unshift({
            vname: '全部',
            id:''
          })
          that.setData({
            [setvalue]: v.propValueList
          })
        });
        that.setData({
          qitachoice: e.data
        })
      })
    },

    //根据cId获取产品非销售属性列表接口
     getMallItemUnProp: async function(id){
      this.getMallItemProp(id)
      return false
       let params={
        cid:id
       }
      let getMallItemUnPropList =await requeseCenter.getMallItemUnProp(params)
      console.log('非销售属性列表,getMallItemUnPropList',getMallItemUnPropList)
      this.setData({
        noSalesList:getMallItemUnPropList
      })
      getMallItemUnPropList.forEach((v,k)=>{
         v.propValueList.unshift({vname:'全部',id:'',slelectId:true})
        this.setData({
          [`noSalesList[${k}].propValueList`]:v.propValueList,
          [`noSalesList[${k}].slelectId`]:''
         })
      })
      
      console.log(this.data.noSalesList)
    },
    //非销售属性点击事件
   async noSalesClick(e){
    let parentIndex = e.currentTarget.dataset.parentIndex
    let index = e.currentTarget.dataset.index
      let item = this.data.noSalesList[parentIndex].propValueList[index]
      this.setData({
        [`noSalesList[${parentIndex}].slelectId`]:item.id,
      })
    },





    //返回上一级事件
    black: function (e) {
      var that = this
      that.reset()
      // let index = e.currentTarget.dataset.index
      let index = 1
      console.log('当前页index', index)
      that.setData({
        theNumber: index - 1
      })
      if (index != 1) {
        return false
      } else {
        if (that.data.chioneId[0]) {
          return false
        }
      }
      let theNumber = index - 1
      let data = {
        parentId: that.data._initialParentId
      }
      api.request('/rest/tWebMallItemCatControllerApi/locationList', data, 'GET', function (res) {
        let data1 = {
          parentId: res.data[0].id
        }
        let title = res.data[0].name?res.data[0].name:res.data[0].cname
        api.request('/rest/tWebMallItemCatControllerApi/getChildList', data1, 'GET', function (e) {
          let parameter = 'screenarr[' + theNumber + '].arr'
          let parameter1 = 'Title[' + theNumber + ']'
          let pushdata = e.data
          pushdata.unshift({
            cname: '全部',
            id: res.data[0].id
          })
          console.log(pushdata)
          that.setData({
            [parameter]: pushdata,
            [parameter1]: title
          })
        })
      })
    },

    //重置数据
    reset: function (e) {
      var that = this
      console.log('当前页面的theNumber',that.data.theNumber)
      console.log(that.data._initialParentId)
      let chioneId = that.data.newinitialParentId
      let chioneId1 = 'chioneId[' + 1 + ']'
      let chioneId2 = 'chioneId[' + 2 + ']' //品牌规格等
      that.setData({
        ['chioneId[0]']:'',
        [chioneId]: '',
        [chioneId1]: '',
        [chioneId2]: '',
        theNumber: 0,
        noSalesId:''
      })
      if(that.data.shopLabel){
        that.data.shopLabel.forEach((v,k)=>{
          if(v.isClick){
            let setvalue = 'shopLabel['+k+'].isClick'
            that.setData({
              [setvalue]:false
            })
          }
        })
      }

    },

    //筛选事件
    _success: function (e) {
      var that = this
      console.log('存放id的数组', that.data.chioneId)
      if (that.data.chioneId[2] || that.data.chioneId.length == 3) { //品牌和规格id的处理
        var typeid = that.data.chioneId.slice(-2);
        var shopid = that.data.chioneId.slice(-3)
      } else {
        var typeid = that.data.chioneId.slice(-1);
      }
      // console.log(typeid[0], shopid[0])
      if (typeid[0]) {
        var takeoutId = typeid[0]
      } else {
        var takeoutId = that.data.chioneId[0]
      }

      //---------- 产品列表页导航选了三级后二级的选中效果没有了 ------------
      let categoryId = that.data.chioneId[0]
      //-------------------------------------------------------------

      //如果没有选择品牌的上级
      if (!takeoutId) {
        if (that.data.chioneId[0]) {
          wx.showToast({
            title: '请选择品牌的上级',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '请选择',
            icon: 'none'
          })
        }
        return false
      }
      try {
        if (that.data.chioneId[2]) {//是否选择了品牌或规格
          var extendData = {}
          let norms =that.data.chioneId[2].SubID[1]&&that.data.chioneId[2].SubID[1].norms||''
          let pName = ''
          let qitachoice = that.data.qitachoice
          if (norms&&norms.length>0) {
            for(let i=0;i<norms.length;i++){
              if(norms[i]){
                if(pName){
                  pName = pName+';'+qitachoice[i].id+':'+norms[i]
                }else{
                  pName = qitachoice[i].id+':'+norms[i]
                }
              }
            }
            if (pName) {
              extendData.pname=that.data.theNumber>1?pName:''
            }
          }
          extendData.brandId = that.data.chioneId[2].SubID[0]
        } else {
          var extendData = {}
        }
      } catch(error) {
        console.log('!!!抛出异常',error)
        var extendData = {}
      }
      console.log(extendData)
      try{
      var extendData =JSON.parse(extendData)
      }catch{
        var extendData =extendData
      }
      // extendData.searchClass:that.data.searchClass.join(',')
      extendData['searchClass']= that.data.searchClass.join(',')
      extendData['hasDiscount'] = that.data.seriesCode||that.data.seriesCode==0?that.data.seriesCode:''
      // extendData['searchClass']= that.data.seriesCode
      console.log('searchClass', that.data.searchClass)
      // that.data.searchClass.forEach((v,k)=>{
      //   let isShopLabel = that.data.shopLabel.find(obj => obj.CODE == v)
      //   if(isShopLabel){
      //     console.log('点了标签')
      //     this.setData({
      //      ['shopLabel['+k+'].isClick']:true
      //     })
      //   }
      // })
      //判断有没有选择非销售属性
      if(this.data.noSalesList&&this.data.noSalesList.length>0){
        var newArray =[]
        let noSalesList =this.data.noSalesList
        //查找符合条件值并存入新数组
    for(let i in noSalesList){
      if(noSalesList[i].slelectId){
        newArray.push(noSalesList[i].id+':'+noSalesList[i].slelectId)
    }
    }
    console.log(newArray)
      }
      if(newArray&&newArray.length>0){
        extendData.unProp = newArray.join(';')
      }
      var myEventDetail = {
        typeid: takeoutId,
        extendData: JSON.stringify(extendData),
      }

      //---------- 产品列表页导航选了三级后二级的选中效果没有了 ------------
      myEventDetail = {
        // typeid: categoryId,
        typeid: takeoutId,
        shopid: shopid ? shopid[0] : '',
        isShop: true,
        extendData: JSON.stringify(extendData),
      }
      //-------------------------------------------------------------
      this.setData({
        seriesExtendData:extendData
      })
      var myEventOption = {}
      that.triggerEvent('success', myEventDetail, myEventOption)
      let data = {
        parentId: takeoutId
      }
      //查询刚进来的筛选栏目
      // api.request('/rest/tWebMallItemCatControllerApi/getChildList', data, 'GET', function (e) {
      //   let parameter = 'screenarr[' + theNumber + '].arr'
      //   that.setData({
      //     [parameter]: e.data
      //   })
      //   console.log(that.data.screenarr)
      // })
      //查询规格
      // let cid = that.data.chioneId[1]
      // if (cid)
      //   that.getMallItemProp(cid)
      that.close()
    },


    //关闭筛选组件
    close: function () {
      this.util('close')
    },
    //查询产品系列
    async getMallItemCommonIdentification(typeId){
      console.log(this.data.seriesExtendData)
      let seriesExtendData = this.data.seriesExtendData
      let params={
        typeId:typeId
      }
      if(seriesExtendData){
        delete seriesExtendData.searchClass
        params.extendData = seriesExtendData
      }
      let getMallItemCommonIdentification =await requeseCenter.getMallItemCommonIdentification(params)
      getMallItemCommonIdentification.unshift({
        typename:'全部',
        typecode:''
      })
      this.setData({
        seriesList:getMallItemCommonIdentification,
        // seriesCode:''
      })
    },
    //测试按钮
    test: function () {
      let that = this
      console.log(that.data.theNumber)
      console.log('screenarr', that.data.screenarr)
      console.log(this.data.onescData)
      console.log('chioneId',this.data.chioneId)
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
      setTimeout(function () {
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
      }.bind(this), 150)
      if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    },


    labelClick(e){
      let index = e.currentTarget.dataset.index
      let arr = this.data.shopLabel
      let setvalue = 'shopLabel['+index+'].isClick'
      if(arr[index].isClick){
        this.setData({
          [setvalue]:false
        })
        let findIndex = this.data.searchClass.findIndex(obj => obj==this.data.shopLabel[index].CODE)
        this.data.searchClass.splice(findIndex,1)
      }else{
        this.setData({
          [setvalue]:true
        })
        this.data.searchClass.push(arr[index].CODE)
      }
     
      this.setData({
        searchClass:this.data.searchClass
      })
    },

    seriesTap(event){
      let index = event.currentTarget.dataset.index
      let seriesList = this.data.seriesList
      let item = seriesList[index]
      this.setData({
        seriesCode:item.typecode
      })
    }


  }
})