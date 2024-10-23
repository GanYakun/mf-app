// components/activity-floor-item/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: null,
      observer: function (newVal, oldVal) {
        console.log("floor-item-activity", newVal)
        this.setData({
          _item: newVal
        })
        

        // 计算限时抢购剩余的时间
        let endtime =newVal&&newVal.adImageList&&newVal.adImageList.promotionsEndTime
        if (endtime) {
          let end_str = (endtime).replace(/-/g, "/");
          var end_date = new Date(end_str); //将字符串转化为时间  
          var mytime = new Date();
          if (end_date < mytime) {
            this.setData({
              time: 0
            })
          } else {
            this.setData({
              time: end_date - mytime
            })


          }
        } else {
          this.setData({
            time: 0
          })
        }
      }
    },
    itemWidth: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
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
    _itemWidth: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAction: function (event) {
      var eventType = event.currentTarget.dataset.eventType
      var position = event.currentTarget.dataset.position ? event.currentTarget.dataset.position : 0
      var adListType = event.currentTarget.dataset.adlistType
      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item,
        adListType:adListType,
      }
      this.triggerEvent("action", detail)
    },

    onBannerTap: function (event) {
      console.log("onBannerTap", event)
      var eventType = event.currentTarget.dataset.eventType
      var position = event.detail.position

      var _item = this.data._item
      var detail = {
        eventType: eventType,
        position: position,
        source: _item,
        sourcesType: "bannerList2"
      }
      this.triggerEvent("action", detail)
    },


    test: function () {
      console.log(this.data._item)
    }
  }
})