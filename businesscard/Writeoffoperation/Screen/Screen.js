// businesscard/Writeoffoperation/Screen/Screen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**开始时间选择 */
  chioceStartTime: function (e) {
    console.log(e)
    if (this.data.EndTime) {
      if (this.data.EndTime < e.detail.value) {
        wx.showToast({
          title: '开始时间大于结束时间',
          icon: 'none'
        })
        return false
      }

    }
    this.setData({
      startTime: e.detail.value
    })

  },

  /**结束时间选择 */
  chioceEndTime: function (e) {
    console.log(e)
    if (this.data.startTime) {
      if (this.data.startTime > e.detail.value) {
        wx.showToast({
          title: '结束时间小于开始时间',
          icon: 'none'
        })
        return false
      }

    }
    this.setData({
      EndTime: e.detail.value
    })
  },


  /**确定筛选 */
  determine: function (e) {
    if (!this.data.EndTime || !this.data.startTime) {
      wx.showToast({
        title: '未选择开始时间或结束时间',
        icon: 'none'
      })
      return false
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage) {
      prevPage.setData({
        dateSt: this.data.startTime,
        dateEd: this.data.EndTime,
        SelectIndex:111
      });
      wx.navigateBack({
        delta: 1
      })
    }
  }
})