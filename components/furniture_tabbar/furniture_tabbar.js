// components/furniture_tabbar/furniture_tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    shangpin_home:function(){
      wx.navigateTo({
        url: '/xpages/shangpin_home/shangpin_home',
      })
    },
    furniture_list:function(){
      wx.navigateTo({
        url: '/commodity/furniture_list/furniture_list',
      })
    },
    furniture_activity:function(){
      wx.navigateTo({
        url: '/xpages/furniture_activity/furniture_activity',
      })
    }

  }
})
