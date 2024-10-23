
const wxml = (url) => 
`<view class="container">
  <image class="img" mode="aspectFit" src="${url}"></image>
</view>
`

const style = {
  
  img: {
    width: 355,
    height: 355,
    position: 'absolute',
    left:10
  },
  container: {
    height: 400,
    width: 375,
    flexDirection: 'column'
  },
  title: {
    height: 20,
    width: 200,
    color: '#15c15f',
    margin: 4,

  },
  desc: {
    fontSize: 13,
    height: 40,
    width: 200,
    color: '#4c4c4c',
    margin:4,
  }
}

module.exports = {
  wxml,
  style
}
