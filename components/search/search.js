var api = require("../../utils/api.js")
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '搜索框的标题'
    },
    pageWindowHeight: {
      type: Number,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '搜索框的标题'
    }, saveoptions: {
      type: Array,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '搜索的下拉数据'
    },
    chiocetext: {
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '搜索的下拉数据'
    },
    startnewsClassId: {
      type: Number,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: '搜索的下拉数据'
    },
    oldnewclassid:{
      type:Number,
      value:''
    },
    isindexpage:{
      type:Number,
      value:99
    },
    pagemenuButtontop:{
      type:Number,
      value:0                               //判断搜素框距离顶部的距离
    },
    productName:{
      type:String,
      value:'',
      observer:function(newVal,oldVal){
        this.setData({
          inputVal:newVal
        })
      }
    }

  },

  externalClasses:['prent-class'],

  /**
   * 组件的初始数据
   */
  data: {
    inputShowed: false,
    isshowInput: false,
    topsearchs: true,                   //控制显示搜索的下拉选项
    searword: '',
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,		 //头部按钮的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showInput: function () {
      // this.setData({
      //     inputShowed: true
      // });
      this.setData({
        isshowInput: !this.data.isshowInput
      })

      console.log('666')
    },
    hideInput: function () {
      this.setData({
        inputVal: "",
        inputShowed: false
      });
      console.log('666')
    },

    hiddenname: function () {
      this.setData({
        isshowInput: !this.data.isshowInput
      })

    },

    //点击显示下拉框
    topsearchs: function () {
      this.setData({
        topsearchs: !this.data.topsearchs
      })
    },
    /*
    *
    *点击使其点击的数据渲染到view中
    */
    selectedform: function (e) {
      console.log(e)
      this.setData({
        chiocetext: e.currentTarget.dataset.text,
        topsearchs: !this.data.topsearchs,
        startnewsClassId: e.currentTarget.dataset.newsclassid
      })
    },

    // 输入框失去焦点时触发

    loseTime: function (e) {
      console.log(e)
      this.setData({
        searword: e.detail.value,
        jujiao:''
      })
    },
    //搜索
    searchword: function (e) {
      var that = this;
      that.setData({
        // isshowInput: !that.data.isshowInput,
        jujiao:''
      })
      console.log(that.data.oldnewclassid)
      if(that.data.oldnewclassid == 155 || that.data.startnewsClassId == 155){
        var extendData={
          productName:that.data.searword
        }
      }else{
        var extendData = {
          searchKeyWord: that.data.searword
        }
      }
    
     
      let data1 = {
        newsClassId: that.data.startnewsClassId,
        start: 1,
        pageSize: 12,
        extendData: JSON.stringify(extendData)
      }
var toptext = '搜索结果'
      //跳转到毛坯房
      console.log(that.data.startnewsClassId)
       if(that.data.oldnewclassid==that.data.startnewsClassId) {
        api.request('/rest/newsClass/getPageModel', data1, 'GET', function (e) {
          var myEventDetail = {
            extendData: extendData,
            concats: e.data.list,
            chuancon: e.data,
          }
          var myEventOption = {}
          that.triggerEvent('dianji', myEventDetail, myEventOption)
        })
        
      }else{
        if (that.data.startnewsClassId == 127) {
         
          // wx.redirectTo({
          //   url: '../../xpages/roughhouse/roughhouse?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData)+'&toptext='+toptext,
          // })
        }
        //跳转到产品页面
        else if(that.data.startnewsClassId == 155){
          // wx.redirectTo({
          //   url: '../../xpages/classification/classification?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData)+'&toptext='+toptext,
          // })
          var myEventDetail = {
            extendData: extendData,
          }
          var myEventOption = {}
          that.triggerEvent('dianji', myEventDetail, myEventOption)
        }
        //跳转到精装房页面
        else if(that.data.startnewsClassId == 128){
          wx.redirectTo({
            url: '../../xpages/hardcover/hardcover?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData)+'&toptext='+toptext,
          })
        }
        //跳转到全屋精选
        else if(that.data.startnewsClassId == 129){
          wx.redirectTo({
            url: '../../xpages/selected/selected?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData)+'&toptext='+toptext,
          })
        }
          //跳转到效果图
          else if(that.data.startnewsClassId == 147){
            wx.redirectTo({
              url: '../../xpages/designsketch/designsketch?newsClassId=' + that.data.startnewsClassId + '&extendData=' + JSON.stringify(extendData)+'&toptext='+toptext,
            })
          }
      }


      // }
    },

    jujiao:function(){
      let that = this
      that.setData({
        jujiao:1
      })
    }




  },


})
