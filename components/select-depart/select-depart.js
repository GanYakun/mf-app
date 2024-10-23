// components/select-depart/select-depart.js
const app = getApp()
import requestCenter from '../../http/request-center'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    departData: {
      type: Array
    },
    pickerShow: {
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, 
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    getDepartmentList: [],
    firstindex: 0,
    secondindex: 0,
    thirdlyindex: 0
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () {
      
    },
    ready: function(){
      if(this.data.departData){
        this.setData({
          getDepartmentList: this.data.departData
        })
      }else{
        this.getDepartmentList()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //查询部门列表
    async getDepartmentList() {
      let params = {
        typegroupCode: 'designer_department'
      }
      let getDepartmentList = await requestCenter.getDepartmentList(params)
      this.setData({
        getDepartmentList: getDepartmentList[0].children,
      })
    },

    //一级选择
    pickercarend1(e) {
      let index = e.detail.value[0]
      this.setData({
        firstindex: index
      })
    },

    //二级选择
    pickercarend2(e) {
      let index = e.detail.value[0]
      this.setData({
        secondindex: index
      })
    },

    //三级选择
    pickercarend3(e) {
      let index = e.detail.value[0]
      this.setData({
        thirdlyindex: index
      })
    },

    //项目点击
    clickItem(e) {
      this.triggerEvent('depart', {
        deptName: departName,
        orgTypeid: orgTypeid,
      })
      this.setData({
        pickerShow: false
      })
    },

    //点击取消
    clickCancel() {
      this.setData({
        pickerShow: false
      })
    },

    //点击确定
    clickSure() {
      let firstindex = this.data.firstindex;
      let secondindex = this.data.secondindex;
      let thirdlyindex = this.data.thirdlyindex;
      let list = this.data.getDepartmentList;
      let orgTypeid = list[firstindex].id;
      let departName = list[firstindex].departName;
      if (list[firstindex].children != null && list[firstindex].children[secondindex]) {
        //第二级
        orgTypeid = list[firstindex].children[secondindex].id;
        departName = list[firstindex].children[secondindex].departName;
        if (list[firstindex].children[secondindex].children != null && list[firstindex].children[secondindex].children[thirdlyindex]) {
          //第三级
          orgTypeid = list[firstindex].children[secondindex].children[thirdlyindex].id;
          departName = list[firstindex].children[secondindex].children[thirdlyindex].departName;
        }
      }
      this.triggerEvent('depart', {
        deptName: departName,
        orgTypeid: orgTypeid,
      })
      this.setData({
        pickerShow: false
      })
    }
  },

})