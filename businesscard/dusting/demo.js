import deviceUtil from '../../utils/device-utils'

const wxml = (srcdata) =>
  `
<view class="container">
<image class="middle" mode="aspectFit" src="${srcdata.brokerBackgroundImagePath}"></image>
<view class="bottomview">
<view class="usermessage">
<view class="usermessagebox">
<image class="hedimage" src="${srcdata.hedimg}"></image>
<view>
<text class="username">` + srcdata.name + `</text>
<text class="remask">${srcdata.remask?srcdata.remask:''}</text>
</view>
</view>
<view class="phoneandaddress">
<image class="phoneicon" src="${srcdata.phoneicon}"></image>
<text class ="phonetext">${srcdata.phone}</text>
</view>
<view class="phoneandaddress">
<image class="adressicon" src="${srcdata.addressicon}"></image>
<text class ="addresstext">${srcdata.address}</text>
</view>
</view>
<view class="qrcview">
<image class="qrcode" src="${srcdata.qrcode}"></image>
<text class="tips">${srcdata.explain}</text>
</view>
</view>
</view>
`

const style = (pagesize) => {
  console.log(pagesize)
  // pagesize.sizewidth
  let pagewidth = deviceUtil.rpx2px(750)
  let pageheight = deviceUtil.rpx2px(1340)
  return {
    container: {
      width: pagewidth,
      height: pageheight,
      backgroundColor: '#fff',
    },
    middle: {
      width: pagewidth,
      height: deviceUtil.rpx2px(985),
    },
    bottomview: {
      width: pagewidth,
      height: deviceUtil.rpx2px(365),
      // backgroundColor: '#00ff00',
      flexDirection: 'row'

    },
    usermessage: {
      width: deviceUtil.rpx2px(430),
      height: deviceUtil.rpx2px(365),
    },
    usermessagebox:{
      width: deviceUtil.rpx2px(430),
      height: deviceUtil.rpx2px(200),
      flexDirection: 'row'
    },
    hedimage: {
      width: deviceUtil.rpx2px(128),
      height: deviceUtil.rpx2px(128),
      borderRadius: deviceUtil.rpx2px(64),
      top: deviceUtil.rpx2px(39),
      left: deviceUtil.rpx2px(33)
    },
    username: {
      width: deviceUtil.rpx2px(170),
      top: deviceUtil.rpx2px(58),
      left: deviceUtil.rpx2px(67),
      height: deviceUtil.rpx2px(100),
      fontSize: deviceUtil.rpx2px(40),
      fontWeight: 'bold',
      color: '#000',
    },
    remask: {
      height: deviceUtil.rpx2px(100),
      width: deviceUtil.rpx2px(260),
      marginLeft: deviceUtil.rpx2px(67),
      marginTop: deviceUtil.rpx2px(20),
      color: '#666',
      fontSize: deviceUtil.rpx2px(28),
      lineHeight:deviceUtil.rpx2px(30)
    },
    qrcview:{
      width:deviceUtil.rpx2px(280),
      height: deviceUtil.rpx2px(365),
      justifyContent:'center',
      alignItems:'alignItems'
    },
    qrcode:{
      width:deviceUtil.rpx2px(203),
      height: deviceUtil.rpx2px(203),
    },
    tips:{
      width:deviceUtil.rpx2px(203),
      height: deviceUtil.rpx2px(60),
      textAlign:'center',
      fontSize: deviceUtil.rpx2px(20),
      marginTop:deviceUtil.rpx2px(27),
      color:'#000',
    },
    phoneandaddress:{
      width:deviceUtil.rpx2px(203),
      height: deviceUtil.rpx2px(50),
      fontSize: deviceUtil.rpx2px(26),
      marginTop:deviceUtil.rpx2px(27),
      color:'#000',
      marginLeft:deviceUtil.rpx2px(50),
      marginTop:deviceUtil.rpx2px(10),
      flexDirection: 'row'
    },
    phoneicon:{
      width:deviceUtil.rpx2px(40),
      height: deviceUtil.rpx2px(40),
    },
    adressicon:{
      width:deviceUtil.rpx2px(50),
      height: deviceUtil.rpx2px(50),
    },
    phonetext:{
      width:deviceUtil.rpx2px(260),
      height: deviceUtil.rpx2px(50),
      marginLeft:deviceUtil.rpx2px(30)
    },
    addresstext:{
      width:deviceUtil.rpx2px(335),
      height: deviceUtil.rpx2px(100),
      marginLeft:deviceUtil.rpx2px(20),
      lineHeight:deviceUtil.rpx2px(30)
    },
    brandLogPath:{
      width:deviceUtil.rpx2px(239),
      height: deviceUtil.rpx2px(98),
      top:deviceUtil.rpx2px(22),
      left:deviceUtil.rpx2px(42)
    }
    // text: {
    //   width: 80,
    //   height: 60,
    //   textAlign: 'center',
    //   verticalAlign: 'middle',
    // }
  }
}



module.exports.wxml = wxml
module.exports.style = style