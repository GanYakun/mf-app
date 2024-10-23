// import exportExcel from "../../utils/downloadExcel"
var exportExcel = require ("../../utils/downloadExcel.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async exportExcelTap () {
    var tableHead = ["编号","产品", "规格", "价格"];
    //表体：伪数据
  const tableList = [{
    num:"1",
    shop: "双人床",
    color: "绿色",
    price: "500",
  },
  {
    num:'2',
    shop: '棒棒糖',
    color: '红色',
    price: '1000',
  },
  {
    num:'3',
    shop: '门',
    color: '蓝色',
    price: '1000',
  },
  {
    num:4,
    shop: '门',
    color: '蓝色',
    price: '1000',
  }
]
wx.cloud.init()
  var excel =  await exportExcel.exportFile(tableHead,tableList)
  console.log(excel)
  this.setData({
    excel:excel
  })
  },
  open(e){
    wx.openDocument({
      filePath: e.currentTarget.dataset.src,
      success: function (res) {
        console.log('打开文档成功')
      }
    })
  },

 

  // wx.getSavedFileList({
  //   success(res) {
  //     console.log(res.fileList)
  //   }
  // })
})