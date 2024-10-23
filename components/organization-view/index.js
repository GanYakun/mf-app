// components/organization-view/index.js
//一组测试数据
const organizationObj = {
	"parentId": "402880f86739ddd001673a447110003c",
	"orgCode": "A01A04A01A07",
	"brand": "sp",
	"departName": "新居一部",
	"orgType": "2",
	"theOrder": null,
	"departNameEn": null,
	"departNameAbbr": null,
	"isPlan": null,
	"sfdm": "1",
	"isSellStore": "1",
	"mainStore": "1",
	"isKhb": null,
	"isPublicHk": null,
	"children": [{
		"parentId": "ff80808170808666017084909f0f003d",
		"orgCode": "A01A04A01A07A01",
		"brand": "sp",
		"departName": "新居A组",
		"orgType": "2",
		"theOrder": 0,
		"departNameEn": null,
		"departNameAbbr": null,
		"isPlan": null,
		"sfdm": "1",
		"isSellStore": "1",
		"mainStore": "1",
		"isKhb": null,
		"isPublicHk": null,
		"children": [{
			"parentId": "ff80808170808666017084924cb50043",
			"orgCode": "A01A04A01A07A01",
			"brand": "sp",
			"departName": "新居C组",
			"orgType": "2",
			"theOrder": 0,
			"departNameEn": null,
			"departNameAbbr": null,
			"isPlan": null,
			"sfdm": "1",
			"isSellStore": "1",
			"mainStore": "1",
			"isKhb": null,
			"isPublicHk": null,
			"children": [{
				"parentId": "ff80808170808666017084924cb50048",
				"orgCode": "A01A04A01A07A01",
				"brand": "sp",
				"departName": "新居D组",
				"orgType": "2",
				"theOrder": 0,
				"departNameEn": null,
				"departNameAbbr": null,
				"isPlan": null,
				"sfdm": "1",
				"isSellStore": "1",
				"mainStore": "1",
				"isKhb": null,
				"isPublicHk": null,
				"children": null,
				"id": "ff80808170808666017084924cb50049"
			}],
			"id": "ff80808170808666017084924cb50048"
		}],
		"id": "ff80808170808666017084924cb50043"
	}, {
		"parentId": "ff80808170808666017084909f0f003d",
		"orgCode": "A01A04A01A07A02",
		"brand": "sp",
		"departName": "新居B组",
		"orgType": "2",
		"theOrder": 0,
		"departNameEn": null,
		"departNameAbbr": null,
		"isPlan": null,
		"sfdm": "1",
		"isSellStore": "1",
		"mainStore": "1",
		"isKhb": null,
		"isPublicHk": null,
		"children": null,
		"id": "ff808081708086660170849270930045"
	}, {
		"parentId": "ff80808170808666017084909f0f003d",
		"orgCode": "A01A04A01A07A03",
		"brand": "sp",
		"departName": "新居E组",
		"orgType": "2",
		"theOrder": 0,
		"departNameEn": null,
		"departNameAbbr": null,
		"isPlan": null,
		"sfdm": "1",
		"isSellStore": "1",
		"mainStore": "1",
		"isKhb": null,
		"isPublicHk": null,
		"children": null,
		"id": "ff8080817080866601708492aa590047"
	}],
	"id": "ff80808170808666017084909f0f003d"
}
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    organization: {
      type: Object,
      value: null,
      observer: function(newVal, oldVal) {
        this.setData({
          _organization: newVal
        }, () => {
          this.init()
        })
      }
    },
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        this.setData({
          _show: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ftpurl:app.globalData.ftpurl,
    _show: false,
    _topBarList: [],
    _organization: null,
  },

  lifetimes: {
    attached: function() {
      this.setData({
        _organization: this.data.organization
      }, () => {
        this.init()
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init: function() {
      let organizationData = this.data._organization
      let _topBarList = []
      this.setData({
        _topBarList: _topBarList
      })
      if(!organizationData) {
        return
      }
      organizationData["selected"] = true
      _topBarList[0] = organizationData
      this.setData({
        _topBarList: _topBarList,
        _listIndex: 0
      })
    },
    closeOrganizationView: function(event) {
      this.setData({
        show: false
      })
    },
    stopTouchMove: function(event) {
      return false
    },
    onTopbarItemTap: function(event) {
      this.resetListSelected()

      let clickIndex = event.currentTarget.dataset.index
      this.setData({
        _listIndex: clickIndex
      })
      let _topBarList = this.data._topBarList ? this.data._topBarList:[]

      for(let i=0; i<_topBarList.length; i++) {
        _topBarList[i]["selected"] = (i == clickIndex)
      }

      _topBarList = _topBarList.slice(0, clickIndex + 1)

      this.setData({
        _topBarList: _topBarList
      })
    },
    changeOrganizationSelected: function(event) {
      this.resetListSelected()

      let topBarIndex = event.currentTarget.dataset.topIndex
      let index = event.currentTarget.dataset.index
      let _topBarList = this.data._topBarList ? this.data._topBarList:[]
      let clickItem = _topBarList[topBarIndex].children[index]

      if(!(clickItem.children && clickItem.children.length > 0)) {
        for(let i=0; i<_topBarList[topBarIndex].children.length; i++) {
          _topBarList[topBarIndex].children[i]["selected"] = (i == index)
        }
        this.setData({
          _topBarList: _topBarList
        })
        return
      }

      _topBarList.push(clickItem)

      for(let i=0; i<_topBarList.length; i++) {
        _topBarList[i]["selected"] = (i == (_topBarList.length - 1))
      }

      this.setData({
        _topBarList: _topBarList,
        _listIndex: _topBarList.length - 1  
      })
    },
    resetListSelected: function() {
      let listIndex = this.data._listIndex
      let _topBarList = this.data._topBarList ? this.data._topBarList:[]
      let length = _topBarList[listIndex].children ? _topBarList[listIndex].children.length:0
      for(let i=0; i<length; i++) {
        _topBarList[listIndex].children[i]["selected"] = false
      }
    },
    onListIndexChange: function(event) {
      console.log("onListIndexChange", event)
      let current = event.detail.current
    },
    onCancel: function(event) {
      this.setData({
        show: false
      })
    },
    onConfirm: function(event) {
      let _listIndex = this.data._listIndex
      let _topBarList = this.data._topBarList ? this.data._topBarList:[]

      if(_topBarList.length <= 0) {
        wx.showToast({
          title: '暂无可选部门',
          icon: "none"
        })
        return
      }

      let item = _topBarList[_listIndex]

      let childSelectedIndex = -1
      for(let i=0; i<item.children.length; i++) {
        if(item.children[i].selected) {
          childSelectedIndex = i
        }
      }

      let departName = item.departName
      let orgTypeid = item.id
      if(childSelectedIndex == -1) {
        departName = item.departName
        orgTypeid = item.id
      } else {
        departName = item.children[childSelectedIndex].departName
        orgTypeid = item.children[childSelectedIndex].id
      }

      this.triggerEvent('confirm', {
        deptName: departName,
        orgTypeid: orgTypeid,
      })

      this.setData({
        show: false
      })
    }
  }
})
