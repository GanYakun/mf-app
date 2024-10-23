// member/into_send/into_sent.js //豪送列表
const app = getApp()
import requestCenter from '../../http/request-center' 
import Poster from '../../components/wxa-plugin-canvas/poster/poster';
const canvasWidth = 375
const pixelRatio = 3
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftButtonnavHeight: app.globalData.LeftButtonnavHeight,
    haoSongList: [],
    ftpurl:app.globalData.ftpurl,
    imgurl:app.globalData.imgur,
    hostUrl: app.globalData.hostUrl,
    postConfig: null,
    showPoster: false,
    posterImage: "",
    start: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let haoSongListResult = await requestCenter.getHaoSongList({start: this.data.start})
    console.log("haoSongListResult", haoSongListResult)
    this.setData({
      haoSongList: haoSongListResult && haoSongListResult.results ? haoSongListResult.results:[],
      totalPage: haoSongListResult && haoSongListResult.pages ? haoSongListResult.pages:1
    })
  },

  onPosterSuccess: function(event) {
    console.log("onPosterSuccess", event)
    this.setData({
      posterImage: event.detail,
      showPoster: true
    })
  },

  onPosterFail: function(event) {
    console.log("onPosterFail", event)
  },

  onCreatePoster: async function(event) {
    let index = event.currentTarget.dataset.index
    let haoSongList = this.data.haoSongList

    let generateHaoSongCodeResult = await requestCenter.generateHaoSongCode({
      haosongId: haoSongList[index].id
    })
    let qrcode = this.data.hostUrl + generateHaoSongCodeResult.employeeCode
    console.log("onCreatePoster", qrcode)
    let postConfig = this.getPostConfig(haoSongList[index], qrcode)
    this.setData({
      postConfig: postConfig
    }, () => {
      Poster.create(true, this);
    })
  },

  getPostConfig: function(haosongItem, haosongQrCode) {
    if(haosongItem.imagePath) {
      return {
        width: canvasWidth,
        debug: false,
        pixelRatio: pixelRatio,
        backgroundColor: "white",
        images:[
          {
            x: 0,
            y: 0,
            width: 375,
            height: 277,
            url: this.data.imgurl + "/" + haosongItem.imagePath,
            zIndex: 3
          },
          {
            x: 280,
            y: 303,
            width: 73,
            height: 73,
            url: haosongQrCode,
            zIndex: 3
          }
        ],
        blocks: [
          {
            x: 0,
            y: 0,
            width: 375,
            height: 277,
            backgroundColor: "#f2f2f2"
          },
          {
            x: 23,
            y: 423,
            width: 331,
            height: 29
          }
        ],
        texts: [
          {
            x: 23,
            y: 303,
            width: 230*pixelRatio,
            height: 19,
            text: haosongItem.name.replace(/\r\n/g, ""),
            fontSize: 17,
            fontWeight: "bold",
            color: "#333333",
            lineHeight: 19,
            textAlign: "left",
            baseLine: "top",
            lineNum: 1,
            zIndex: 3
          },
          {
            x: 23,
            y: 338,
            width: 230*pixelRatio,
            height: 57,
            text: haosongItem.introduction.replace(/\r\n/g, ""),
            fontSize: 12,
            color: "#777777",
            lineHeight: 19,
            textAlign: "left",
            baseLine: "top",
            lineNum: 3,
            zIndex: 3
          },
          {
            x: 277,
            y: 382,
            width: 80*pixelRatio,
            height: 14,
            text: "长按扫码领取",
            fontSize: 13,
            color: "#7B7B7B",
            lineHeight: 14,
            textAlign: "left",
            baseLine: "top",
            lineNum: 1,
            zIndex: 3
          },
          {
            x: 23,
            y: 412,
            width: 331 * pixelRatio,
            height: 11,
            text: `领取时间：${haosongItem.receiveStartTime}~${haosongItem.receiveEndTime}`,
            fontSize: 11,
            color: "#666666",
            lineHeight: 12,
            textAlign: "left",
            baseLine: "top",
            lineNum: 1,
            zIndex: 3
          }
        ]
      }
    } else {
      return {
        width: canvasWidth,
        debug: false,
        pixelRatio: pixelRatio,
        backgroundColor: "white",
        images:[
          {
            x: 280,
            y: 303,
            width: 73,
            height: 73,
            url: haosongQrCode,
            zIndex: 3
          }
        ],
        blocks: [
          {
            x: 0,
            y: 0,
            width: 375,
            height: 277,
            backgroundColor: "#f2f2f2"
          },
          {
            x: 23,
            y: 423,
            width: 331,
            height: 29
          }
        ],
        texts: [
          {
            x: 23,
            y: 303,
            width: 230*pixelRatio,
            height: 19,
            text: haosongItem.name.replace(/\r\n/g, ""),
            fontSize: 17,
            fontWeight: "bold",
            color: "#333333",
            lineHeight: 19,
            textAlign: "left",
            baseLine: "top",
            lineNum: 1,
            zIndex: 3
          },
          {
            x: 23,
            y: 338,
            width: 230*pixelRatio,
            height: 57,
            text: haosongItem.introduction.replace(/\r\n/g, ""),
            fontSize: 12,
            color: "#777777",
            lineHeight: 19,
            textAlign: "left",
            baseLine: "top",
            lineNum: 3,
            zIndex: 3
          },
          {
            x: 277,
            y: 382,
            width: 80*pixelRatio,
            height: 14,
            text: "长按扫码领取",
            fontSize: 13,
            color: "#7B7B7B",
            lineHeight: 14,
            textAlign: "left",
            baseLine: "top",
            lineNum: 1,
            zIndex: 3
          },
          {
            x: 23,
            y: 412,
            width: 331 * pixelRatio,
            height: 11,
            text: `领取时间：${haosongItem.receiveStartTime}~${haosongItem.receiveEndTime}`,
            fontSize: 11,
            color: "#666666",
            lineHeight: 12,
            textAlign: "left",
            baseLine: "top",
            lineNum: 1,
            zIndex: 3
          }
        ]
      }
    }
  },
  onPosterDialogClose: function() {
    this.setData({
      showPoster: false
    })
  },
  toHaosongDetail: function(event) {
    let index = event.currentTarget.dataset.index
    let haoSongList = this.data.haoSongList
    let haosongId = haoSongList[index].id
    wx.navigateTo({
      url: '/member/claim_coupons/claim_coupons?haosongId=' + haosongId,
    })
  },
  loadMoreData: async function(event) {
    let start = this.data.start
    if(start >= this.data.totalPage) {
      return
    }
    start += 1
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let haoSongListResult = await requestCenter.getHaoSongList({start: start})
    let haoSongList = haoSongListResult && haoSongListResult.results ? haoSongListResult.results:[]
    this.setData({
      haoSongList: this.data.haoSongList.concat(haoSongList),
      totalPage: haoSongListResult && haoSongListResult.pages ? haoSongListResult.pages:1,
      start: start
    })
  }
})