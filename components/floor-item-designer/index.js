// components/floor-item-designer/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: null,
      observer: async function(newVal, oldVal) {
        var adImageList = newVal.adImageList.list ? newVal.adImageList.list:[]
        var swiperPageSize = this.data.swiperPageSize
        var totalPage = Math.ceil(adImageList.length/swiperPageSize) + (10%4 > 0 ? 1:0)
        var pageList = []
        for(var i=0; i<totalPage; i++) {
          var pageData = []
          for(var j = i*swiperPageSize; j < Math.min((i+1)*swiperPageSize, adImageList.length); j++) {
            pageData.push(adImageList[j])
          }
          if(pageData.length > 0) {
            pageList.push(pageData)
          }
        }
        newVal.pageList = pageList
        this.setData({
          _item: newVal
        })

        var pageHeightList = []
        for(var i=0; i<pageList.length; i++) {
          var pageHeight = await this.getPageHeight(i)
          pageHeightList.push(pageHeight + 2)
        }

        var maxPageHeight = 0
        for(var i=0; i<pageHeightList.length; i++) {
          maxPageHeight = Math.max(maxPageHeight, pageHeightList[i])
        }

        for(var i=0; i<pageHeightList.length-1; i++) {
          pageHeightList[i] = maxPageHeight
        }

        this.setData({
          pageHeightList: pageHeightList
        })
      }
    },
    itemWidth: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        this.setData({
          _itemWidth: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _item: null,
    imgur: app.globalData.imgur,
    _itemWidth: 0,
    swiperPageSize: 4,
    pageHeightList: [],
    currentPage: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPageChange: async function(event) {
      var current = event.detail.current
      this.setData({
        currentPage: current,
      })
    },

    getPageHeight: function(index) {
      return new Promise((resolve, reject) => {
        const query = this.createSelectorQuery()
        query.select(`#page-list-${index}`).boundingClientRect().exec((res) => {
          if(res && res[0]) {
            resolve(res[0].bottom - res[0].top)
          } else {
            resolve(0)
          }
        })
      })
    },

    onAction: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position:0
      
      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item
      }
      this.triggerEvent("action", detail)
    },

    onBannerTap: function(event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.detail.position
      var sourcesType = event.currentTarget.dataset.sourcesType
      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item,
        sourcesType:sourcesType
      }
      this.triggerEvent("action", detail)
    },

    //预约设计师
    free_design:function(e){
      wx.navigateTo({
        url: '/xpages/free_design/free_design?appointDesign='+e.currentTarget.dataset.appointdesign,
      })
    },

    //全案设计的用户评价
    Userevaluation:function(e){
      let id = e.currentTarget.dataset.id
      let newsClassId = 121
      wx.navigateTo({
        url: '/xpages/allhouse_detail/allhouse_detail?id=' + id + '&newsClassId=' + newsClassId+'&Popupornot='+1,
      })
    },
  }
})
