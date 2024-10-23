var api = require("../../utils/api.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showAddressPoup:{     //控制弹窗展示的元素
      type:Boolean,
      value:false,
      observer(newVal,oldVal){
        this.setData({
            _showAddressPoup:newVal
            })
        //查询地址列表
        // if(this.data.addressList){
        //   this.setData({
        //   _showAddressPoup:newVal
        //   })
        //   return false
        // }
        // api.newget('/rest/memberCenter/myShippingAdress', {}, 'GET', (e)=> {
        //   this.setData({
        //     addressList: e.data,
        //   _showAddressPoup:newVal
        //   })
        // })
      }
    },
    addList:{
      type:Array,
      value:[],
      observer(newVal,oldVal){
        this.setData({
          addressList:newVal
        })
    },
    isShowLoding:{
      type:Boolean,
      value:false,
      observer(newVal,oldVal){
        this.setData({
          _isShowLoding:newVal
        })
      }
    }
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
    close: function () {
      this.triggerEvent('close',!this.data._showAddressPoup)
    },
    //选择地址
    onAddAddress(e){
      let id = e.currentTarget.dataset.id
      this.triggerEvent('updateAddress',{id:id})
    },
    addnewaddress: function () {
      var that = this;
      wx.navigateTo({
        url: '/member/add_address/add_address?id=' + '',
      })
    },
  }
})
