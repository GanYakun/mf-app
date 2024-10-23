// components/product-sku-dialog/produck-sku-dialog.js
import { combInArray } from './comb-utils'
const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
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
        if(newVal) {
          this.setData({
            _show: true
          })
        }
        setTimeout(() => {
          this.setData({
            _showAnimation: newVal
          })
        }, 30)
      }
    },
    skuInfo: {
      type: Object,
      value: {
        /**
         * addCart: 点击加入购物车弹出的，显示加入购物按钮
         * buyNow: 点击立即购买弹出的，如果支持预付定金，显示支付定金按钮，显示(线上/线下支付按钮)
         * skuSelect:查看sku，显示加入购物按钮和(线上/线下支付按钮)
         */
        sourceAction: "skuSelect",
        supportDeposit: false,//是否支持预付定金,
        payType: "online",//支付方式，online：线上支付，offline：线下支付
        orderType: 1,//1: 限时抢购    3: 样品特卖    取其他值按普通商品处理
        selectedSkuProperties: "",
        skuPropertiesList: [],
        Deposit: [],
        productDictionary: {}
      },
      observer: function(newVal, oldVal) {
        if(newVal == oldVal) {
          return
        }
        if(!newVal) {
          return
        }

        this.setData({
          _skuInfo: newVal
        })
        this._init()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgurl: app.globalData.imgur,
    _show: false,
    _showAnimation: false,
    _skuInfo: {
      sourceAction: "skuSelect",
      supportDeposit: false,
      payType: "online",
      orderType: 1,
      selectedSkuProperties: "",
      skuPropertiesList: [],
      Deposit: [],
      productDictionary: {}
    },
    _skuGroupResult: {},
    _skuSelectTips: "",
    _selectedProSkuInfo: {},
    _buyNum: 1,
    _fullSku: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _init: function() {
      let skuPropertiesList = this.data._skuInfo.skuPropertiesList || []
      let selectedSkuProperties = this.data._skuInfo.selectedSkuProperties || ""

      //排列组合所有情况
      let skuGroupData = JSON.parse(this.data._skuInfo.productDictionary.skuJson || "{}")
      let skuGroupResult = {}
      Object.keys(skuGroupData).forEach((key) => {
        let keySplitArr = key.split(";")
        keySplitArr.sort(function (val1, val2) {
          return parseInt(val1) - parseInt(val2);
        })
        
        let combArr = combInArray(keySplitArr)
        combArr.forEach((combItem) => {
          skuGroupResult[combItem.join(";")] = {}
        })
        skuGroupResult[keySplitArr.join(";")] = {}
      })
      this.setData({
        _skuGroupResult: skuGroupResult
      })

      //初始化默认选中状态
      let selectedPropertiesObj = {}
      selectedSkuProperties.split(";").forEach((splitItem) => {
        let splitItemArr = splitItem.split(":")
        selectedPropertiesObj[splitItemArr[0].trim()] = splitItemArr[1].trim()
      })
      
      skuPropertiesList.forEach((skuItem) => {
        let skuId = skuItem.propId || ""
        let skuPropValueList = skuItem.propValueIdList || []
        skuPropValueList.forEach((skuPropItem) => {
          let skuPropId = skuPropItem.id || ""
          skuPropItem.selected = (skuPropId == selectedPropertiesObj[skuId])
        })
      })
      this.setData({
        ["_skuInfo.skuPropertiesList"]: skuPropertiesList
      })
      this.updateSkuPropItemStatus()
    },

    onSkuPropItemTap: function(event) {
      let skuPropertiesList = this.data._skuInfo.skuPropertiesList || []
      let skuIndex = event.currentTarget.dataset.skuIndex
      let skuPropIndex = event.currentTarget.dataset.skuPropIndex
      let skuPropValueList = (skuPropertiesList[skuIndex] || {}).propValueIdList || []
      
      skuPropValueList.forEach((item, index) => {
        if(item.selected) {
          item.selected = false
        } else {
          item.selected = (index == skuPropIndex)
        }
      })
      this.setData({
        ["_skuInfo.skuPropertiesList"]: skuPropertiesList
      })

      this.updateSkuPropItemStatus()
    },

    resetSkuProps: function(event) {
      let skuPropertiesList = this.data._skuInfo.skuPropertiesList || []
      skuPropertiesList.forEach((skuItem) => {
        let skuId = skuItem.propId || ""
        let skuPropValueList = skuItem.propValueIdList || []
        skuPropValueList.forEach((skuPropItem) => {
          if(skuPropItem && skuPropItem.selected) {
            skuPropItem.selected = false
          }
          if(skuPropItem && skuPropItem.disabled) {
            skuPropItem.disabled = false
          }
        })
      })
      this.setData({
        ["_skuInfo.skuPropertiesList"]: skuPropertiesList
      })
      this.onSkuPropItemTap(event)
    },

    updateSkuPropItemStatus: function() {
      let skuPropertiesList = this.data._skuInfo.skuPropertiesList || []
      let skuGroupResult = this.data._skuGroupResult
      let skuDictList = [] 
      let orderType = this.data._skuInfo.orderType || "0"
      if(orderType == "0") {
        skuDictList = JSON.parse((this.data._skuInfo.productDictionary.sku || "[]"))
      } else {
        //限时抢购或者样品特卖的产品
        skuDictList = JSON.parse((this.data._skuInfo.productDictionary.promotionsDetails || "[]"))
      }
      let promotionsDetailsList = this.data._skuInfo.productDictionary.promotionsDetailsList || []

      let selectedSkuObjs = this.getSelectedSkuObjs()
      let selectedObjIds = selectedSkuObjs.selectedObjIds
    
      //当有sku未选中时，不显示价格，显示sku选择提示信息
      let skuSelectTips = ""
      let siblingsSelectedObj = selectedSkuObjs.siblingsSelectedObj
      if(Object.keys(siblingsSelectedObj).length < skuPropertiesList.length) {
        for(let i=0; i<skuPropertiesList.length; i++) {
          let skuItem = skuPropertiesList[i]
          let skuId = skuItem.propId || ""
          let pname = skuItem.pname || ""
          if(!siblingsSelectedObj[skuId]) {
            skuSelectTips =`请选择${pname}`
            break
          }
        }
      }
      this.setData({
        _skuSelectTips: skuSelectTips
      })
      
      //判断sku是否可选
      skuPropertiesList.forEach((skuItem) => {
        let skuId = skuItem.propId || ""
        let skuPropValueList = (skuItem.propValueIdList || []).filter((skuPropItem) => !skuPropItem.selected)
        
        skuPropValueList.forEach((skuPropItem) => {
          let skuPropId = skuPropItem.id || ""
          let siblingsSelectedObjId = siblingsSelectedObj[skuId] ? `${skuId}${siblingsSelectedObj[skuId]}`:""
          
          let testAttrIds = [];
          if(siblingsSelectedObjId) {
            testAttrIds = selectedObjIds.filter((selectedObjId) => selectedObjId != siblingsSelectedObjId)
          } else {
            testAttrIds = selectedObjIds.filter((selectedObjId) => true)
          }
          
          testAttrIds.push(`${skuId}${skuPropId}`)

          testAttrIds.sort(function (val1, val2) {
            return parseInt(val1) - parseInt(val2);
          });
          
          if(skuGroupResult[testAttrIds.join(";")]) {
            skuPropItem.disabled = false
          } else {
            skuPropItem.disabled = true
          }
        })
      })
      this.setData({
        ["_skuInfo.skuPropertiesList"]: skuPropertiesList
      })

      let siblingsSelectedObjKVArr = []
      for(let key in siblingsSelectedObj) {
        siblingsSelectedObjKVArr.push(`${key}:${siblingsSelectedObj[key]}`)
      }
      siblingsSelectedObjKVArr.sort((val1, val2) => {
        let val1KvArr = val1.split(":")
        let val2KvArr = val2.split(":")
        let value1 = (`${val1KvArr[0] || ""}${val1KvArr[1] || ""}` || "0").trim()
        let value2 = (`${val2KvArr[0] || ""}${val2KvArr[1] || ""}` || "0").trim()
        return parseInt(value1) - parseInt(value2)
      })
      
      let selectedSkuProperties = siblingsSelectedObjKVArr.join(";")

      //更新产品sku信息
      if(Object.keys(siblingsSelectedObj).length >= skuPropertiesList.length) {
        let selectedSkuArr = skuDictList.filter((skuDictItem) => {
          let properties = this.formartProperties(skuDictItem.properties || "")
          return properties == selectedSkuProperties
        }) || []
        
        console.log("updateSkuPropItemStatus", selectedSkuArr)
        
        //sku选中值改变，购买数量重置为1
        // let preProperties = this.data._selectedProSkuInfo.properties || ""
        // if(preProperties != selectedSkuProperties) {
        //   this.setData({
        //     _buyNum: 1
        //   })
        // }

        let selectedProSkuInfo = this.calcPrice(selectedSkuArr[0] || {})
        this.setData({
          _selectedProSkuInfo: selectedProSkuInfo,
        })
      }

      //是否有预付订金
      let selectedProSkuInfo = this.data._selectedProSkuInfo
      let depositList = promotionsDetailsList.filter((item) => item.productSku == (selectedProSkuInfo.product_sku || selectedProSkuInfo.id)) || []
      this.setData({
        ["_skuInfo.supportDeposit"]: depositList.length > 0,
      })

      //预付定金倒计时
      let depositCountdownList = []
      promotionsDetailsList.forEach((item) => {
        let endtime = item.promotionsEndTime
        let end_str = (endtime).replace(/-/g, "/");
        var end_date = new Date(end_str); //将字符串转化为时间  
        var mytime = new Date();

        depositCountdownList.push({
          promotionsEndTime: ((end_date < mytime) ? 0 : (end_date - mytime)),
          salePrice: item.salePrice || 0,
          offsetAmount: item.offsetAmount || 0,
          productSku: item.productSku || ""
        })
      })
      depositCountdownList = depositCountdownList.filter((item) => item.productSku == (selectedProSkuInfo.product_sku || selectedProSkuInfo.id))
      this.setData({
        ["_skuInfo.Deposit"]: depositCountdownList || [],
      })

      this.triggerEvent("change", {
        supportDeposit: depositList.length > 0,
        depositModel: depositList[0],
        skuProInfo: selectedProSkuInfo,
        selectedSkuProperties: selectedSkuProperties,
        skuSelectTips: skuSelectTips
      })
    },

    /**
     * 购买数量减
     */
    toReduceNum: function(event) {
      let num = Number(this.data._buyNum || 1)
      let nums = num - 1
      if (nums == 0) {
        this.setData({
          _buyNum: 1
        })
      } else {
        this.setData({
          _buyNum: nums
        })
      }
    },

    checkStock: function() {
      let selectedProSkuInfo = this.data._selectedProSkuInfo || {}
      let productDictionary = this.data._skuInfo.productDictionary || {}

      let limitCounts = selectedProSkuInfo.limit_counts || 0 //活动限购
      let surplus_stock = selectedProSkuInfo.surplus_stock || 0 //活动库存
      let saleCounts = selectedProSkuInfo.sale_counts || 0 //活动限量
      let ordinaryLimitCounts = productDictionary.limitCounts || 0 //普通限购
      let limitQuantity = productDictionary.limitQuantity || 0 //普通限量
      let stock = selectedProSkuInfo.stock || 0 //普通库存

      let buyNum = this.data._buyNum

      if(limitCounts && buyNum > limitCounts) {
        app.showToastMessage('限购：' + limitCounts)
        return false
      }

      if(ordinaryLimitCounts && buyNum > ordinaryLimitCounts) {
        app.showToastMessage('限购：' + ordinaryLimitCounts)
        return false
      }

      if(surplus_stock && buyNum > surplus_stock) {
        app.showToastMessage('库存：' + surplus_stock)
        return false
      }

      if(stock && buyNum > stock) {
        app.showToastMessage('库存：' + stock)
        return false
      }

      if(saleCounts && buyNum > saleCounts) {
        app.showToastMessage('限量：' + saleCounts)
        return false
      }

      if(limitQuantity && buyNum > limitQuantity) {
        app.showToastMessage('限量：' + limitQuantity)
        return false
      }

      return true
    },

    /**
     * 加入购物车 
     */
    toAddCart: function(event) {
      //sku未选全的情况，不能改变购物车数量
      let skuSelectTips = this.data._skuSelectTips || ""
      if(skuSelectTips) {
        app.showToastMessage(skuSelectTips)
        return
      }
      if(!this.checkStock()) {
        return
      }
      this.triggerEvent("confirm", {
        type: "addCart",
        buyNum: this.data._buyNum
      })
    },

    /**
     * 立即购买
     */
    toBuyNow: function(event) {
      //sku未选全的情况，不能改变购物车数量
      let skuSelectTips = this.data._skuSelectTips || ""
      if(skuSelectTips) {
        app.showToastMessage(skuSelectTips)
        return
      }
      if(!this.checkStock()) {
        return
      }
      let payType = ((this.data._skuInfo || {}).payType) || "online"
      this.triggerEvent("confirm", {
        type: payType == "online" ? "buyNowWithOnline":"buyNowWithOffline",
        buyNum: this.data._buyNum
      })
    },

    /**
     * 支付订金
     */
    toPayDeposit: function(event) {
      //sku未选全的情况，不能改变购物车数量
      let skuSelectTips = this.data._skuSelectTips || ""
      if(skuSelectTips) {
        app.showToastMessage(skuSelectTips)
        return
      }
      if(!this.checkStock()) {
        return
      }
      this.triggerEvent("confirm", {
        type: "payDeposit",
        buyNum: this.data._buyNum
      })
    },

    /**
     * 购买数量加
     */
    toAddBuyNum: function(event) {
      let num = Number(this.data._buyNum || 1)

      //sku未选全的情况，不能改变购物车数量
      let skuSelectTips = this.data._skuSelectTips || ""
      if(skuSelectTips) {
        app.showToastMessage(skuSelectTips)
        return
      }

      let selectedProSkuInfo = this.data._selectedProSkuInfo || {}
      let productDictionary = this.data._skuInfo.productDictionary || {}

      let limitCounts = selectedProSkuInfo.limit_counts || 0 //活动限购
      let surplus_stock = selectedProSkuInfo.surplus_stock || 0 //活动库存
      let saleCounts = selectedProSkuInfo.sale_counts || 0 //活动限量
      let ordinaryLimitCounts = productDictionary.limitCounts || 0 //普通限购
      let limitQuantity = productDictionary.limitQuantity || 0 //普通限量
      let stock = selectedProSkuInfo.stock || 0 //普通库存
      let nums = ++num

      if(limitCounts && nums > limitCounts) {
        app.showToastMessage('限购：' + limitCounts)
        return
      }

      if(ordinaryLimitCounts && nums > ordinaryLimitCounts) {
        app.showToastMessage('限购：' + ordinaryLimitCounts)
        return
      }

      if(surplus_stock && nums > surplus_stock) {
        app.showToastMessage('库存：' + surplus_stock)
        return
      }

      if(stock && nums > stock) {
        app.showToastMessage('库存：' + stock)
        return
      }

      if(saleCounts && nums > saleCounts) {
        app.showToastMessage('限量：' + saleCounts)
        return
      }

      if(limitQuantity && nums > limitQuantity) {
        app.showToastMessage('限量：' + limitQuantity)
        return
      }

      this.setData({
        _buyNum: nums
      })
    },

    calcPrice(proSkuInfo) {
      let orderType = this.data._skuInfo.orderType || "0"
      let displayPrice = 0
      if(orderType == "3") {
        //样品特卖
        displayPrice = Number(proSkuInfo.specialprice || 0)
      } else if(orderType == "1") {
        //限时抢购
        displayPrice = Number(proSkuInfo.sale_price || 0)
      } else {
        //其他
        displayPrice = Number(proSkuInfo.one_price || 0)
      }
      proSkuInfo["$displayPrice"] = displayPrice.toFixed(2)
      return proSkuInfo
    },

    formartProperties: function(properties = "") {
      let propertiesKVArr = properties.split(";")
      let result = []
      propertiesKVArr.sort((val1, val2) => {
        let val1KvArr = val1.split(":")
        let val2KvArr = val2.split(":")
        let value1 = (`${val1KvArr[0] || ""}${val1KvArr[1] || ""}` || "0").trim()
        let value2 = (`${val2KvArr[0] || ""}${val2KvArr[1] || ""}` || "0").trim()
        return parseInt(value1) - parseInt(value2)
      })
      propertiesKVArr.forEach((propertiesKVItem) => {
        let kvArr = propertiesKVItem.split(":")
        let key = (kvArr[0] || "").trim()
        let val = (kvArr[1] || "").trim()

        result.push(`${key}:${val}`)
      })
      return result.join(";")
    },

    /**
     * 获取所有选中的sku，
     * {
     *    selectedObjIds: [`${skuId}${skuPropId}`, ....],
     *    siblingsSelectedObj: {
     *      skuId: `${skuPropId}`,...
     *    }
     * }
     * selectedObjIds中的元素升序排列
     */
    getSelectedSkuObjs() {
      let skuPropertiesList = this.data._skuInfo.skuPropertiesList || []
      let selectedObjIds = []
      let siblingsSelectedObj = {}
      skuPropertiesList.forEach((skuItem) => {
        let skuId = skuItem.propId || ""
        let skuPropValueList = skuItem.propValueIdList || []
        skuPropValueList.forEach((skuPropItem) => {
          let skuPropId = skuPropItem.id || ""
          if(skuPropItem.selected) {
            selectedObjIds.push(`${skuId}${skuPropId}`)
            siblingsSelectedObj[`${skuId}`] = `${skuPropId}`
          }
        })
      })
      selectedObjIds.sort((val1, val2) => {
        return parseInt(val1) - parseInt(val2);
      })
      return {
        selectedObjIds,
        siblingsSelectedObj
      }
    },

    closeDialog: function(event) {
      this.setData({
        _showAnimation: false
      })
    },

    onAnimationEnd: function(event) {
      let _showAnimation = this.data._showAnimation
      this.setData({
        _show: _showAnimation,
        show: _showAnimation
      })
    }
  }
})
