// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodeExcel = require('excel-export');
const path = require('path');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event参数',event)
  // var tableMap = event.dataHeader
  // var tableHead = event.dataList
  var tableMap = {
    styleXmlFile: path.join(__dirname, "styles.xml"),
    name: Date.now() + "-export",
    cols: [],
    rows: [],
  }
  var tableHead = event.dataHeader;
  //添加表头
  for (var i = 0; i < tableHead.length; i++) {
    tableMap.cols[tableMap.cols.length] = {
      caption: tableHead[i],
      type: 'string'
    }
  }
  //表体：伪数据
  const tableList = event.dataList
  //添加每一行数据
  for (var i = 0; i < tableList.length; i++) {
    tableMap.rows[tableMap.rows.length] = [
      tableList[i].num,
      tableList[i].shop,
      tableList[i].color,
      tableList[i].price
    ]
  }


  //保存excelResult到相应位置
  console.log('表',tableMap)
  var excelResult = nodeExcel.execute(tableMap);
  console.log('excelResult输出',excelResult)
  var filePath = "outputExcels";
  var fileName = cloud.getWXContext().OPENID + "-" + Date.now() / 1000 + '.xlsx';
  //图片上传到云存储
  return await cloud.uploadFile({
    cloudPath: path.join(filePath, fileName),
    fileContent: new Buffer(excelResult, 'binary')
  }).then(res => {
    console.log(res.fileID);
    return res;
  }).catch(err => {

  });

}