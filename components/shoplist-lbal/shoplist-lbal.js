// components/shoplist/shoplists.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
shoplists: {
      type: Array,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '内容'   
    },
    imgurl:{
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '内容'   
    },
    typeId:{
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '内容'
    },
    ishot:{
      type:Number,
      value:0
    },
    isbaokuan:{
      type:Number,              //判断是否是本月爆款
      value:'-1'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  // 商品详情
  details:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    var typeId = this.data.typeId
    var productName = e.currentTarget.dataset.productname
    var itemName = e.currentTarget.dataset.itemname
    var cid = e.currentTarget.dataset.cid
console.log("ftcdtysgcbdsucjd",e)

//本月爆款到商品详情
if(that.data.isbaokuan == 1){
 var orderType = 6
}else{
 var orderType = ''

}
    wx.navigateTo({
      url: '../../xpages/shop/shop?objectId=' + id + "&typeId=" + typeId+"&productName="+productName+'&itemName='+itemName+'&cid='+cid+'&NeworderType='+orderType,
    })
  }
}
})
