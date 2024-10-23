// components/author-agreement-dialog/author-agreement-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        if(newVal == oldVal) {
          return
        }
        setTimeout(() => {
          this.setData({
            _showAnimation: newVal
          })
        }, 30)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _showAnimation: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeAuthorAgreementDialog: function(event) {
      this.setData({
        _showAnimation: false
      })
    },

    onAnimationEnd: function(event) {
      let _showAnimation = this.data._showAnimation
      this.setData({
        show: _showAnimation
      })
    },

    toAgree: function(event) {
      this.triggerEvent("confirm", {})
      this.closeAuthorAgreementDialog(event)
    },

    toServiceAgreement: function(event) {
      wx.navigateTo({
        url: '/pages/service-agreement/service-agreement',
      })
    },
  
    toPrivacyPolicies: function(event) {
      wx.navigateTo({
        url: '/pages/privacy-policies/privacy-policies',
      })
    }
  }
})
