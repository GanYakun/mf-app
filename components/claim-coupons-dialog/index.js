// components/claim-coupons-dialog/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    qrCodeUrl: {
      type: String,
      value: ""
    },
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ftpurl:app.globalData.ftpurl,
    icClaimCouponsBorderTop: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbYAAAAuCAYAAABESzzqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iNDA5RDE3NzlDMjA4NDhDOEIwMTc1MkZDMDRGNTkwRDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkVDRjk3MUQyMUYzMTFFREFBOUNCMkNFNjdBNzUxNDciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkVDRjk3MUMyMUYzMTFFREFBOUNCMkNFNjdBNzUxNDciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NGQ5MjIyY2EtZjYyMS0xYTRmLTg1M2YtN2M0MWY1OGM0YjcwIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmU2YjFjNmMtM2EwMC1mMjRlLTliZjEtMmI4ZDMwOTY2NzU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XqyUtwAABPZJREFUeNrs3W9oVXUcx/HfvXfXbQ6nrs32QNB009Qig+iPpqMyjBik+cgFYlj0xHoQJEjPouhBUGCBREVplEhUBqaOqNQyoR6UaEhYprChTETSXdfc5u3z5R5hSOyee87vzHPd+wVvtge7v26/A3459557bqZYLG5yzs1Tc9Ui1eIAAEi3M+qYOqFOq151XhUyGmx5/VKnGlS7Wqo61BLVyN4BAFLigjoYdEidUv1qQF299kc22K5/YE5NVyvUKrVSTWM/AQA3SJ/aq3ap/eri6EF2vf8bbKM1qU61Xi1TNewvAGCcDKlutU3tC87Oyio32K6xlyg3qi7VzF4DABLWo7arrcHvoYUdbMZenlwXDLg29hwAkJAjaovaqQqVPriSwWbq1Rq1WS1k7wEAnv2iXlV71HCUBbIV/r1defKZel39xf4DADyfqb2mvo461KIMNjOovgxOE/s4DgAAD+yzaG+60kUiI3EWykZ8nL3m+YnaoYocDwBADFfUh8FJ02DcxbIxHmuf8H5bfc8xAQBEZCdHu9W76pKPBbMxH2/vs70fDDkAACpll/K/p876WjDrYQ27cqWbYwMAqJC9l/aVK90iyxsfg+0f9UXwEwCAsM4G8+Ny2gab+U79wDECAFTgW/WT70V9DTa747JdRMIVkgCAMP4NTooGfS+c9bjWj87jm38AgJuafW7tcBIL+xxs9mVvRzlWAIAQfnWl71NL9WCz2239wbECAJRhb1sddzFumzVeg80+OX6S4wUAKMMG2t9ujC8LTctgsyfYw/ECAJQxkuS8yHpe7xzHCwAQ4kQosZvo+x5slzheAIAQgy2xeZFlfwEAN5Maz+tN8bFI/0evuJFzvVW3mZM7N7j8gnu9rFXY8YYb7vmz6vag/tEuN2lxx4Teg7rlq13tfY/52YPP33HDJ49O6D24vPsDN3T856rbA/v/t33wYeCbT92V3w5Ux1CZ2eYa1r4U5qRqSmLPwfN6LT4WyS+839UUqu/Wk9mmVm9r5eff43Kts6tuD3ItM9kDj885377Y5Zpundh7MOcOl21orL6zBv0D722tWbe7TE2+Ov4dnNoc6s/UDPV7Es8hUyx6uwuWPdEX1FucCAMAxjCkNqiPExmuHteapOZwvAAA5U5C1W0uoes8fC5ar+ZzvAAAZWTUAuf/7TDvg61d3cnxAgCEcLeanfbB9qBq5VgBAEKYpR5I82Cbrh4KTi8BACinTj2satM62OzJLeM4AQAq8IhaksbBNlU9GfwEACCs1mB+TE7bYHtcreT4AAAqlFNPqOVpGmxz1TPqFo4PACACu13Rs87jxYdxBpsNs+dd6aIRAACisIsOO9VzztP9I6MOtgb1lFrruBISABCP3bnqaWV3jY59lWSUwVYb/MftvpAzOB4AAA/sc20vKvtaiFychSq9nYndNmuN2uxK768BAODLXeplZXfn36OGoyxSyd397UPY69RG1cb+AwASckRtUTtVIanB1h4MtC7VzJ4DABLWo7arrcHv3gZbkytdrbLele4sUsNeAwDGiX1vW7fapvap/qiDzd60s5cdV6hVrvTh62nsLwDgBulTe9UutV9dVFfHGmz2feN2M0q7hN9eclyqOlzp/l2N7CcAICUuqINBh9Sp4CxuYPSgs8G2ST/nudJVjotUC3sHAEi5M+qYOqFOq151XhX+E2AAHwz4rE+d1IQAAAAASUVORK5CYII=",
    imageUrl: app.globalData.imgur,
    hostUrl: app.globalData.hostUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close: function(event) {
      this.setData({
        show: false
      })
      this.triggerEvent("close", {})
    }
  }
})
