// businesscard/internal-member-bro-list/internal-member-bro-list.js
// businesscard/internal-member-list/internal-member-list.js
// /rest/department/getDepartmentList
const app = getApp()
import requestCenter from '../../http/request-center' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight:app.globalData.LeftButtonnavHeight,
    qcappnoshare:true,
    newFtpUrl:app.globalData.newFtpUrl,
    firstindex:0,
    secondindex:0,
    thirdlyindex:0,
    pickerShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      this.getMemberListByIsEmployeeCountOnload()
      this.getmemberListByIsEmployeeOnload()
      // this.getDataDictionary()
      this.getDepartmentList()
    }, 1000);
    
  },

  //查询部门列表
  async getDepartmentList(){
    
    let params = {
      typegroupCode:'designer_department'
    }
    let getDepartmentList = await requestCenter.getDepartmentList(params)
    console.log('getDepartmentList',getDepartmentList)
    // getDataDictionary.unshift({typename:'',typecode:''})
    this.setData({
      getDepartmentList:getDepartmentList[0].children,
      mineDepart: getDepartmentList[0]
    })
      
  },


  //刚加载页面时访问浏览列表
  async getmemberListByIsEmployeeOnload(){
    this.setData({
      isShowLoding:true
    })
    let params = {
      departmentId:this.data.orgTypeid||'',
      employeeName:this.data.name||'',  //员工名字
      startTime:this.data.startTime||'', //开始时间
      endTime:this.data.endTime||'', //结束时间
      orderField:this.data.sort||'',  //(brokercount:经纪人,bmcount:报名,yxcount:意向)
      orderType:this.data.sortType||'' //排序方式（asc升序，desc降序）
    }
    let getMemberListByIsEmployee2 = await requestCenter.getMemberListByIsEmployee2(params)
    let num = getMemberListByIsEmployee2.map(obj=>obj.browseCount).reduce((a,b)=>a+b,0)
    this.setData({
      scrren:num,
      allStaff:getMemberListByIsEmployee2.length,
      list:getMemberListByIsEmployee2,
      isShowLoding:false
    })
  },

  //刚加载页面时访问浏览数据统计
  async getMemberListByIsEmployeeCountOnload(){
    let params={
     
    }
    let getMemberListByIsEmployeeCount2 = await requestCenter.getMemberListByIsEmployeeCount2(params)
    console.log(getMemberListByIsEmployeeCount2)
    this.setData({
      count: getMemberListByIsEmployeeCount2,
      allFrequency:getMemberListByIsEmployeeCount2.LQCOUNT
    })
  },

  //查询部门列表
  async getDataDictionary(){
    let params = {
      typegroupCode:'designer_department'
    }
    let getDataDictionary = await requestCenter.getDataDictionary(params)
    this.setData({
      getDataDictionary:getDataDictionary,
    })
    },
    

  async getMemberListByIsEmployeeCount(){
    let params={
     
    }
    let getMemberListByIsEmployeeCount2 = await requestCenter.getMemberListByIsEmployeeCount2(params)
    console.log(getMemberListByIsEmployeeCount2)
    this.setData({
      count:getMemberListByIsEmployeeCount2
    })
  },
  async getmemberListByIsEmployee(){
    this.setData({
      isShowLoding:true,
      list: []
    })
    let params = {
      // dept:this.data.dept||'',
      // name:this.data.name||'',  //员工名字
      // dateSt:this.data.startTime||'', //开始时间
      // dateEd:this.data.endTime||'', //结束时间
      // px:this.data.sort||'',  //(brokercount:经纪人,bmcount:报名,yxcount:意向)
      // pxType:this.data.sortType||'' //排序方式（asc升序，desc降序）
      departmentId:this.data.orgTypeid||'',
      employeeName:this.data.name||'',  //员工名字
      startTime:this.data.startTime||'', //开始时间
      endTime:this.data.endTime||'', //结束时间
      orderField:this.data.sort||'',  //(brokercount:经纪人,bmcount:报名,yxcount:意向)
      orderType:this.data.sortType||'' //排序方式（asc升序，desc降序）
    }
    let getMemberListByIsEmployee2 = await requestCenter.getMemberListByIsEmployee2(params)
    let num = getMemberListByIsEmployee2.map(obj=>obj.browseCount).reduce((a,b)=>a+b,0)
    console.log('pppppppppppp',num)
    this.setData({
      list:getMemberListByIsEmployee2,
      scrren:num,
      isShowLoding:false,
      scrollTop: 0
    })
  },

  //开始时间
  startTime(e){
    let startTime = e.detail.value
    if(this.data.endTime&&startTime>this.data.endTime){
      app.showToastMessage('开始时间大于结束时间,请重新选择')
      return false
    }
    this.setData({
      startTime:startTime
    })
    if(this.data.endTime){
      this.getmemberListByIsEmployee()
    }
    
  },

  //结束时间
  endTime(e){
    let endTime = e.detail.value
    if(this.data.startTime&&endTime<this.data.startTime){
      app.showToastMessage('结束时间大于开始时间,请重新选择')
      return false
    }
    this.setData({
      endTime:endTime
    })
    if(this.data.startTime){
      this.getmemberListByIsEmployee()
    }
    
  },

  //部门选择
  // depTap(e){
  //   let index = e.detail.value
  //   this.setData({
  //     dept:this.data.getDataDictionary[index].typecode,
  //     deptName:this.data.getDataDictionary[index].typename,
  //   })
  //   this.getmemberListByIsEmployee()
  // },

  //员工搜索
  search(e){
    this.setData({
      name:e.detail.value
    })
    this.getmemberListByIsEmployee()
  },


  scrrenTap(e){
    console.log(e)
   this.setData({
    sort:'browseCount',
    sortType:this.data.sortType=='asc'?'desc':'asc'
   })
    
    this.getmemberListByIsEmployee()
  },

  //内部会员点击
  listTap(e){
      let memberListByIsEmployeeCount = this.data.count || {}
      console.log("listTap", memberListByIsEmployeeCount)
      if(!memberListByIsEmployeeCount.ISLEADER) {
        return
      }

      let item = e.currentTarget.dataset.item
      let params = {
        id:item.memberId,
        decodeNick:item.memberName,
        phone:item.memberPhone,
        createDate:''
      }
      console.log("listTap", item)
      wx.navigateTo({
        url: '/businesscard/Potendetails/Potendetails?item=' + encodeURIComponent(JSON.stringify(params)),
      })
  },

  //重置所有筛选数据
  reset(){
    this.setData({
      sortType:'',
      sort:'',
      searchValue:'',
      deptName:'',
      startTime:'',
      endTime:'',
      orgTypeid:'',
      name:''
    })
    this.getmemberListByIsEmployee()
  },




  //选择弹窗
  clickdepar(){
    this.setData({
      pickerShow:true
    })
  },
  pickercarend1(e){
    // console.log(e.detail.value[0])
    let index = e.detail.value[0]
    console.log("第一项",index)
    this.setData({
      firstindex:index
    })
  },
  pickercarend2(e){
    let index = e.detail.value[0]
    console.log("第二项",index)
    this.setData({
      secondindex:index
    })
  },
  pickercarend3(e){
    let index = e.detail.value[0]
    console.log("第三项",index)
    this.setData({
      thirdlyindex:index
    })
  },
  clickcancel(){
    this.setData({
      pickerShow:false
    })
  },
  clickItem(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      deptName:e.currentTarget.dataset.departname,
      orgTypeid:e.currentTarget.dataset.id,
      pickerShow:false
    })
    console.log("departName"+e.currentTarget.dataset.departname+"orgTypeid"+e.currentTarget.dataset.id)
    this.getmemberListByIsEmployeeOnload()
  },
  clicksub(){
    console.log('确认！')
    let firstindex = this.data.firstindex;
    let secondindex = this.data.secondindex;
    let thirdlyindex = this.data.thirdlyindex;
    let list = this.data.getDepartmentList;
    let orgTypeid = list[firstindex].id;
    let departName = list[firstindex].departName;
    if (list[firstindex].children != null && list[firstindex].children[secondindex] ) {
      orgTypeid = list[firstindex].children[secondindex].id;
      departName = list[firstindex].children[secondindex].departName;
      console.log('来到第二级')
      if (list[firstindex].children[secondindex].children != null && list[firstindex].children[secondindex].children[thirdlyindex]) {
        orgTypeid = list[firstindex].children[secondindex].children[thirdlyindex].id;
        departName = list[firstindex].children[secondindex].children[thirdlyindex].departName;
        console.log('来到第三级')
      }
    }
    this.setData({
      deptName:departName,
      orgTypeid:orgTypeid,
      pickerShow:false
    })
    this.getmemberListByIsEmployeeOnload()
    console.log("departName"+departName+"orgTypeid"+orgTypeid)

  },

  onDepartChange: function(event) {
    let deptName = event.detail.deptName
    let orgTypeid = event.detail.orgTypeid
    this.setData({
      deptName:deptName,
      orgTypeid:orgTypeid,
      pickerShow:false
    })
    this.getmemberListByIsEmployeeOnload()
  }
})