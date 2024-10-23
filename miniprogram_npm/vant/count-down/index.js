import { VantComponent } from '../common/component';
import { isSameSecond, parseFormat, parseTimeData, parseTimeDatashop,parseTimeDatachecklist } from './utils';

function simpleTick(fn) {
    return setTimeout(fn, 30);
}
VantComponent({
    props: {
        useSlot: Boolean,
        millisecond: Boolean,
        time: {
            type: Number,
            observer: 'reset'
        },
        format: {
            type: String,
            value: 'HH:mm:ss'
        },
        autoStart: {
            type: Boolean,
            value: true
        },
        isshoptime:{
            type: Boolean,
            value: false
        },
        ischecklist:{           //是否是精装房列表的显示
            type:Boolean,
            value:false
        },

        // 一元下定的时间和案例详情的时间是否显示
        isShowSecond:{
            type:Boolean,
            value:false
        },
        downStyle:{
            type:String,
            value:''
        }
    },
    data: {
        timeData: parseTimeData(0),
        formattedTime: '0'
    },
    methods: {
        // 开始
        start() {
            if (this.counting) {
                return;
            }
            this.counting = true;
            this.endTime = Date.now() + this.remain;
            this.tick();
        },
        // 暂停
        pause() {
            this.counting = false;
            clearTimeout(this.tid);
        },
        // 重置
        reset() {
            this.pause();
            this.remain = this.data.time;
            this.setRemain(this.remain);
            if (this.data.autoStart) {
                this.start();
            }
        },
        tick() {
            if (this.data.millisecond) {
                this.microTick();
            }
            else {
                this.macroTick();
            }
        },
        microTick() {
            this.tid = simpleTick(() => {
                this.setRemain(this.getRemain());
                if (this.remain !== 0) {
                    this.microTick();
                }
            });
        },
        macroTick() {
            this.tid = simpleTick(() => {
                const remain = this.getRemain();
                if (!isSameSecond(remain, this.remain) || remain === 0) {
                    this.setRemain(remain);
                }
                if (this.remain !== 0) {
                    this.macroTick();
                }
            });
        },
        getRemain() {
            return Math.max(this.endTime - Date.now(), 0);
        },
        setRemain(remain) {
            this.remain = remain;
            const timeData = parseTimeData(remain);
            const shoptime = parseTimeDatashop(remain);
            const checkTime = parseTimeDatachecklist(remain)
            this.setData({
                xtimedata: timeData,
                checkTime:checkTime
            });
            this.triggerEvent("getTime",{time:checkTime})
            if (this.data.useSlot) {
                this.$emit('change', shoptime);
            }
            this.setData({
                formattedTime: parseFormat(this.data.format, shoptime)
            });
            if (remain === 0) {
                this.pause();
                this.$emit('finish');
            }
        },
        testsss:function(e){
            let that = this
    console.log(that.data.xtimedata)
    console.log(that.data.formattedTime)
    console.log('年月日秒',that.data.checkTime)
        },
        catchTouchMove:function(){
            return false
        }
    },
  
});
