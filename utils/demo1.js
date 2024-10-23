import deviceUtil from '../../utils/device-utils'
  // <image class="img" src="${srcdata.imgsrc}"></image>

const wxml = (srcdata) => 
`<view class="container">
<image class="img" src="${srcdata.imgsrc}"></image>
<image class="hedimage" src="${srcdata.hedimg}"></image>
<image class="qrcode" src="${srcdata.qrcode}"></image>
  <text class="name">`+srcdata.name+`</text>
  <text class="remask">${srcdata.remask}</text>
  <text class="phone">${srcdata.phone}</text>
  <text class="address">${srcdata.address}</text>

</view>`

const style=(pagesize) =>{
  let pagewidth = pagesize.sizewidth
  let pageheight = pagesize.sizeheight
  let ratio = pagewidth/375
  let ratios = pageheight/603
  console.log(ratios)
  console.log(pagesize)
  return{
    container: {
      width: pagewidth,
      height: pageheight,
      // position: "relative"
    },
    hedimage:{
      position: 'relative',
      borderRadius:78*ratios,
      width:156*ratios,
      height:156*ratios,
      top:68*ratios,
      left:33
      // zIndex:9
    },
    qrcode:{
      position: 'relative',
      width:120*ratios,
      height:120*ratios,
      top:320*ratios,
      left:30*ratio,
    },
   name:{
    position: 'absolute',
    top:265*ratios,
    left: '60',
    right: '0',
    fontSize:20*ratios,
    fontWeight: 500,
    color:'#333',
    height:'100',
    zIndex:'9'
   },
   remask:{
    position: 'absolute',
    top:288*ratios,
    left: '60',
    right: '0',
    fontSize:16*ratios,
    color:'#333',
    height:'100',
    zIndex:'9'
   },
   phone:{
    position: 'absolute',
    top:340*ratios,
    left: '60',
    right: '30',
    fontSize:16*ratios,
    fontWeight: 500,
    color:'#333',
    height:'100',
    zIndex:'9'
   },
   address:{
    position: 'absolute',
    top:385*ratios,
    left: '60',
    right: '30',
    fontSize: 16*ratios,
    color:'#333',
    height:'100',
   },
    red: {
      backgroundColor: '#ff0000'
    },
    green: {
      backgroundColor: '#00ff00'
    },
    blue: {
      backgroundColor: '#0000ff',
      alignItems: 'center',
      justifyContent: 'center',
      color:'#ffffff'
    },
    img: {
      width: pagewidth,
      height: pageheight,
      position:'absolute'
      // marginTop:-157*ratios
      // width: deviceUtil.rpx2px(750),
      // height: deviceUtil.rpx2px(1206),
      // borderRadius: 20,
    }
  }
}
  


module.exports.wxml = wxml
module.exports.style = style
