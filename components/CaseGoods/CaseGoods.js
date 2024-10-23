// components/CaseGoods/CaseGoods.js
var app = getApp()
var api = require('../../utils/api.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopArr: {
      type: Array,
      value: ''
    },
    allprice:{
      type:Number,
      value:0
    },
    shoplist:{
      type:Array,
      value:''
    },
    hiddenProduct:{  
      //用来区分汇家严选 
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgur: app.globalData.imgur,
    shoplist:[],  //预览的商品集合
    istc:false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击选中  并加入预览
    updatebyclick: function (e) {
      if(this.data.hiddenProduct){
        wx.navigateTo({
          url: '/xpages/shop/shop' + '?newsClassId=' + 155 + '&NeworderType=' + 0 + '&objectId=' + e.currentTarget.dataset.spuid + '&categoryId=' + 155
          //categoryId只限产品部分，筛选时候用得倒，可能是cid
        })
        return false
      }
      console.log(e)
      let that = this
      let topsku = e.currentTarget.dataset.topsku
      let chicknum = e.currentTarget.dataset.chicknum
      let indexs = e.currentTarget.dataset.index
      let arr = that.data.pagedata
      let isSpecial = e.currentTarget.dataset.isspecial
      // 如果judge为null，则改变updateby为true，弹出预览框
      if (isSpecial == 0) {
        let setvalue = 'shopArr.[' + indexs + '].isSpecial'
        let datadata = {
          kongjianid: that.data.kongjianid,
          image: e.currentTarget.dataset.imagesrc,
          goodsnum: e.currentTarget.dataset.goodsnum,
          price: e.currentTarget.dataset.price,
          skuid: topsku,
          spuid: e.currentTarget.dataset.spuid
        }
        let jisuanprice = e.currentTarget.dataset.goodsnum * e.currentTarget.dataset.price
        console.log(that.data.allprice)
        that.data.shoplist.push(datadata)
        that.setData({
          shoplist: that.data.shoplist,
          pagedata: arr,
          allprice: that.data.allprice + jisuanprice,
          [setvalue]: 1
        })
      } else {
        let shoplist = that.data.shopArr
        let Isthereany = that.data.shoplist.findIndex(obj => obj.skuid == topsku)
        that.data.shoplist.splice(Isthereany,1) 
         let setvalue = 'shopArr.[' + indexs + '].isSpecial'
        that.setData({
          allprice: that.data.allprice - (shoplist[indexs].onePrice * shoplist[indexs].goodsNum),
          [setvalue]: 0,
          shoplist:this.data.shoplist
        })
       
        // that.data.shoplist.splice(Isthereany, 1)
        // that.setData({
        //   shoplist: that.data.shoplist,
        //   istc: that.data.shoplist.length == 0 ? true : that.data.istc
        // })
      }



    },

     //数量减
  plusLowjian: function (e) {
    let that = this;
    let shopnum = e.currentTarget.dataset.goodsnum
    let index = e.currentTarget.dataset.index
    let onePrice = e.currentTarget.dataset.price

    if (shopnum == 1) {

    } else {
      let setValue = 'shopArr['+index+'].goodsNum'
      that.setData({
        [setValue]:shopnum-1,
        allprice:that.data.allprice - onePrice
      })
    }

  },

  //数量加
  plusLowjia: function (e) {
    let that = this;
    let shopnum = parseInt(e.currentTarget.dataset.goodsnum)
    let arr = that.data.shoplist
    let index = e.currentTarget.dataset.index
    let onePrice = e.currentTarget.dataset.price
    let setValue = 'shopArr['+index+'].goodsNum'
      that.setData({
        [setValue]:shopnum-1+2,
        allprice:that.data.allprice + onePrice
      })
  },
     // 收起预览
  shouqitc: function () {
    console.log(this.data.istc)
    this.setData({
      istc: !this.data.istc
    })
  },

  // 预览中删除点击的商品
  deleteshop: function (e) {
    let that = this;
    let shoplist = that.data.shoplist
    let index = e.currentTarget.dataset.index
    let IsThereAnyIndex = that.data.shopArr.findIndex(obj => obj.skuId == shoplist[index].skuid)
    console.log(IsThereAnyIndex)
   if(IsThereAnyIndex!=-1){
     let setvalue = 'shopArr['+IsThereAnyIndex+'].isSpecial'
     that.setData({
      [setvalue]:0
     })
   }
    that.setData({
      allprice:that.data.allprice-that.data.shopArr[IsThereAnyIndex].onePrice*that.data.shopArr[IsThereAnyIndex].goodsNum
    })
    that.data.shoplist.splice(index, 1)
    that.setData({
      shoplist:that.data.shoplist,
      istc:that.data.shoplist.length==0?true:false
    })


  },

   /**
   * 
   * 加入购物车事件
   * 
   */
  joinselect: function () {

    let shoplist = this.data.shoplist
    shoplist.forEach(function (v, k) {
        let dataput = {
          skuId: v.skuid, //单品Id 
          quantity: v.goodsnum, //产品的数量
          productId: v.spuid, //产品id
          promotionId: '',
          promotionsType: 0
        }
        api.newget('/rest/memberCenter/saveOrUpdateCart', dataput, 'PUT', function (e) {
          console.log(e)
              wx.showToast({
                title: '加入购物车成功',
                icon: 'none',
                duration: 1500
              })
        })
    })
  },
  }
})