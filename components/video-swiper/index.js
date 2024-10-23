// components/video-swiper/index.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    duration: {
      type: Number,
      value: 500
    },
    easingFunction: {
      type: String,
      value: 'default'
    },
    loop: {
      type: Boolean,
      value: true
    },
    videoList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        console.log('newVal', newVal)
        if(!newVal || newVal.length <= 0) {
          return
        }
        let _videoList = newVal.map((item, index) => {
          let result = {
            index: index,
            objectFit: 'contain'
          }
          let sourceKey = this.data.sourceKey
          if (sourceKey) {
            result["url"] = item[sourceKey];
          } else {
            console.log('uuuuuuuu',item)
            result["url"] = item;
          }
          return result;
        })
        console.log('视频列表', _videoList)
        this.setData({
          _videoList: _videoList
        })
        this._videoListChanged();
      }
    },

    playIndex: {
      type: Number,
      value: 0
    },
    
    sourceKey: {
      type: String,
      value: ""
    },

    circular: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _videoList: [],
    curQueue: [],
    _last: 1,
    _videoContexts: [],
    showControls: true,
    _sliderChanging: false,
    currentSwiper: 1
  },

  lifetimes: {
    attached: function attached() {
      this.data._videoContexts = [wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this)];
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _videoListChanged: function () {
      // let _this = this;
      let data = this.data;
      let playIndex = data.playIndex;
      let curQueue = data.curQueue;
      let videoList = data._videoList;
      // console.log('videoList', this.data.videoList)

      if(curQueue.length <= 0) {
        if (videoList.length >= 3) {
          console.log('来这里>3')
          if (playIndex == 0) {
            curQueue[0] = videoList[videoList.length - 1]
            curQueue[1] = videoList[0]
            curQueue[2] = videoList[1]
          } else if (playIndex == videoList.length - 1) {
            curQueue[0] = videoList[videoList.length - 2]
            curQueue[1] = videoList[videoList.length - 1]
            curQueue[2] = videoList[0]
          } else {
            curQueue[0] = videoList[playIndex - 1]
            curQueue[1] = videoList[playIndex]
            curQueue[2] = videoList[playIndex + 1]
          }
          // console.log('curQueue', curQueue)
          this.setData({
            curQueue: curQueue,
            currentSwiper: 1
          }, function () {
            this.playCurrent(1);
            this.triggerEvent('change', { current: playIndex });
          })
        } else {
          // return
          console.log('来这里<3')
          curQueue = videoList;
          this.setData({
            curQueue: curQueue,
            currentSwiper: playIndex
          }, function () {
            this.playCurrent(playIndex);
            this.triggerEvent('change', { current: playIndex });
          })
        }
      }
    },

    animationfinish: function (event) {
      let _data = this.data;
      let _last = _data._last;
      let curQueue = _data.curQueue;
      let current = event.detail.current;
      let videoList = _data._videoList;

      if (videoList.length >= 3) {
        let diff = current - _last;
        if (diff === 0) return;
        this.data._last = current;
        let direction = diff === 1 || diff === -2 ? 'up' : 'down';
        /////////////////////////

        let curItem = curQueue[current]
        let realIndex = curItem.index

        if (direction == 'up') {
          let change = (current + 1) % 3
          let next = (realIndex + 1) % videoList.length
          curQueue[change] = videoList[next]
          if(realIndex == videoList.length - 3) {
            this.setData({
              circular: false
            })
            this.triggerEvent('loadmore', { current: curQueue[current].index });
          }
        } else {
          let change = (current - 1) < 0 ? 2 : current - 1
          let pre = (realIndex - 1) < 0 ? (videoList.length - 1) : (realIndex - 1)
          curQueue[change] = videoList[pre]
        }
      }
      this.triggerEvent('change', { current: curQueue[current].index });
      this.setData({
        curQueue: curQueue
      }, () => {
        this.playCurrent(current);
      }) 
    },

    playCurrent: function playCurrent(current) {
      let curQueue = this.data.curQueue
      this.data._videoContexts.forEach((ctx, index) => {
        // index !== current ? ctx.pause() : ctx.play();
        console.log(index, current)
        if(index != current) {
          ctx.pause()
          ctx.seek(0)
        } else {
          ctx.play()
        }
      });
    },

    pauseCurrent: function pauseCurrent(current) {
      let curQueue = this.data.curQueue
      this.data._videoContexts[current] && this.data._videoContexts[current].pause();
    },

    onPlay: function onPlay(e) {
      this.trigger(e, 'play');
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      curQueue[current].isPlaying = true
      this.setData({
        currentPlay: current,
        curQueue: curQueue
      })
    },

    onPause: function onPause(e) {
      this.trigger(e, 'pause');
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      curQueue[current].isPlaying = false
      this.setData({
        curQueue: curQueue
      })
    },

    onEnded: function onEnded(e) {
      this.trigger(e, 'ended');
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      curQueue[current].isPlaying = false
      this.setData({
        curQueue: curQueue
      })
    },

    onError: function onError(e) {
      this.trigger(e, 'error');
    },

    onTimeUpdate: function onTimeUpdate(e) {
      this.trigger(e, 'timeupdate');
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      let currentTime = e.detail.currentTime
      let duration = e.detail.duration

      if(this.data._sliderChanging) {
        return
      }
      curQueue[current].percent = (currentTime/duration)*100
      curQueue[current].currentTime = currentTime
      curQueue[current].currentTimeText = this.formatCurrentTime(currentTime, duration)
      this.setData({
        curQueue: curQueue
      })
    },

    onWaiting: function onWaiting(e) {
      this.trigger(e, 'wait');
    },

    onProgress: function onProgress(e) {
      this.trigger(e, 'progress');
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      let buffered = e.detail.buffered
      curQueue[current].buffered = buffered
      this.setData({
        curQueue: curQueue
      })
    },

    onLoadedMetaData: function onLoadedMetaData(e) {
      this.trigger(e, 'loadedmetadata');
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      curQueue[current].duration = e.detail.duration
      curQueue[current].durationText = this.formatDuraton(e.detail.duration)
      this.setData({
        curQueue: curQueue
      })
    },

    onFullScreenChange: function(e) {
      let current = e.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      let fullScreen = e.detail.fullScreen
      curQueue[current].isFullScreen = fullScreen
      this.setData({
        curQueue: curQueue
      })
    },

    trigger: function trigger(e, type) {
      var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var detail = e.detail;
      var activeId = e.target.dataset.id;
      this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), { activeId: activeId }), ext));
    },

    onVideoTap: function(event) {
      let showControls = this.data.showControls
      this.setData({
        showControls: !showControls
      })
    },

    onPlayOrPause: function(event) {
      let current = event.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      if(curQueue[current].isPlaying) {
        this.pauseCurrent(current)
      } else {
        this.playCurrent(current)
      }
    },

    onSwitchFullScreen: function(event) {
      let current = event.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      let ctx = this.data._videoContexts[current]
      if(curQueue[current].isFullScreen) {
        if(ctx && ctx.exitFullScreen) {
          ctx.exitFullScreen();
        }
      } else {
        if(ctx && ctx.exitFullScreen) {
          ctx.requestFullScreen({
            direction: 0
          })
        }
      }
    },

    onSliderChanging: function(event) {
      let value = event.detail.value
      let current = event.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      let ctx = this.data._videoContexts[current]
      this.data._sliderChanging = true
      let duration = curQueue[current].duration
      let currentTime = duration * (value/100)
      // curQueue[current].currentTime = currentTime
      curQueue[current].currentTimeText = this.formatCurrentTime(currentTime, duration)
      curQueue[current].percent = value
      this.setData({
        curQueue: curQueue
      })
    },

    onSliderChange: function(event) {
      let value = event.detail.value
      let current = event.currentTarget.dataset.index
      let curQueue = this.data.curQueue
      let ctx = this.data._videoContexts[current]
      ctx.seek(curQueue[current].duration * (value/100))
      if(curQueue[current].isPlaying) {
        ctx.play()
      }
      this.data._sliderChanging = false
    },

    formatCurrentTime(currentTime, duration) {
      let timeStr = ""
      if(currentTime) {
        let durationHour = Math.floor(duration/3600);
        let hour = Math.floor(currentTime/3600);
        let min = Math.floor(currentTime/60) % 60;
        let sec = Math.floor(currentTime) % 60;
        if(durationHour > 0) {
          if(hour < 10) {
            timeStr = '0'+ hour + ":";
          } else {
            timeStr = hour + ":";
          }
        } else {
          timeStr = ""
        }

        if(min < 10){
          timeStr += "0";
        }
        timeStr += min + ":";

        if(sec < 10){
          timeStr += "0";
        }
        timeStr += sec;
      } else {
        timeStr = "00:00"
      }
      return timeStr
    },

    formatDuraton: function(duration){
      let timeStr = ""
      if(duration) {
        let hour = Math.floor(duration/3600);
        let min = Math.floor(duration/60) % 60;
        let sec = Math.floor(duration) % 60;

        if(hour > 0) {
          if(hour < 10) {
            timeStr = '0'+ hour + ":";
          } else {
            timeStr = hour + ":";
          }
        } else {
          timeStr = ""
        }

        if(min < 10){
          timeStr += "0";
        }
        timeStr += min + ":";

        if(sec < 10){
          timeStr += "0";
        }
        timeStr += sec;
      } else {
        timeStr = "00:00"
      }
      return timeStr;
    }
  }
})
