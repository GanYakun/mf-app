//导出excel
function exportFile(dataHeader, dataList) {
  return new Promise((resove, reject) => {
    wx.showLoading({
      title: '正在导出',
    });
    console.log(dataHeader);
    console.log(dataList);
    wx.cloud.callFunction({
      name: 'uploadExportfile',
      data: {
        dataHeader: dataHeader,
        dataList: dataList
      }
    }).then(res => {
      console.log(res)
      const fileID = res.result.fileID;
      console.log(fileID)
      //下载文件
      wx.cloud.downloadFile({
        fileID: fileID
      }).then(res1 => {
        console.log(res1)
        // this.saveFileToPhotosAlbum(res1);//保存文件到相册
        wx.saveFile({
          tempFilePath: res1.tempFilePath,
          success(res) {
            wx.showToast({
              title: '导出成功',
            })
            const savedFilePath = res.savedFilePath
            resove({src:savedFilePath,name:Date.now()+'.xlsx'})
          }
        })
        this.delCloudFile(fileID); //删除云存储文件


      }).catch(error => {
        // handle error
      })
    }).catch(err1 => {

    });
  })
}

//保存文件到本地相册
function saveFileToPhotosAlbum(res) {
  //授权
  this.writePhotosAlbumAuth();
  // 保存文件
  var saveTempPath = wx.env.USER_DATA_PATH + "/exportFile" + new Date().getTime() + ".jpg";

  wx.saveFile({
    tempFilePath: res.tempFilePath,
    filePath: saveTempPath,
    success: res1 => {
      //获取了相册的访问权限，使用 wx.saveImageToPhotosAlbum 将图片保存到相册中
      wx.saveImageToPhotosAlbum({
        filePath: saveTempPath,
        success: res2 => {
          //保存成功弹出提示，告知一下用户
          wx.hideLoading();
          wx.showModal({
            title: '文件已保存到手机相册',
            content: '文件位于tencent/MicroMsg/WeiXin下 \r\n将保存的文件重命名改为[ .xlsx ]后缀即可正常打开',
            confirmColor: '#0bc183',
            confirmText: '知道了',
            showCancel: false
          });
        },
        fail(err2) {
          console.log(err2)
        }
      })
    }
  });
}

//删除云存储文件
function delCloudFile(fileID) {
  console.log(fileID)
  const fileIDs = [];
  fileIDs.push(fileID);
  //删除云存储中的excel文件
  wx.cloud.deleteFile({
    fileList: fileIDs,
    success: res4 => {
      // handle success
      console.log(res4);
    },
    fail: console.error
  })
}
//上传单个文件
function uploadSingleFile(cloudPath, filePath) {
  wx.cloud.uploadFile({
    cloudPath: cloudPath, // 上传至云端的路径
    filePath: filePath, // 小程序临时文件路径
    success: res => {
      // 返回文件 ID
      console.log(res.fileID)
    },
    fail: console.error
  })
}

//微信图片保存到本地相册授权
function writePhotosAlbumAuth() {
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            console.log('授权成功')
          }
        })
      }
    }
  })
}


module.exports = {
  uploadSingleFile: uploadSingleFile,
  exportFile: exportFile,
  saveFileToPhotosAlbum: saveFileToPhotosAlbum,
  delCloudFile: delCloudFile,
  writePhotosAlbumAuth: writePhotosAlbumAuth
}