const IS_ERROR = {}
/**
 * @author Alwin
 * Promise重构
 * 由于原生小程序提供的Promise，微信小程序基础库2.16.0以上的版本，
 * 模拟器或者电脑版微信不会执行onUnhandledRejection回调
 * 与PromiseX的唯一区别在与，NativePromiseX保留了原生Promise的特性，而PromiseX则是完全自定义的
 */
export class NativePromiseX extends Promise {
	constructor(excutor) {
		var resolve
		var reject
		super((foreignResolve, foreignReject) => {
			resolve = foreignResolve
			reject = foreignReject
		})
		//当前promise的状态，"pending"、"fulfilled"、"rejected"
		this._state = "pending"
		this._deferred = false

		excutor((value) => {
			try {
				this.handleResolve(value, resolve, reject)
			} catch(error) {
				this.handleReject(error, reject)
			}
		}, (reason) => {
			try {
				this.handleReject(reason, reject)
			} catch(error) {
				this.handleReject(error, reject)
			}
		})
	}
	
	handleReject(reason, reject) {
		reject(reason)
		this._state = "rejected"
		if(Promise._onReject) {
			Promise._onReject(this, reason)
		}
	}
	
	handleResolve(value, resolve, reject) {
		if(value && value.then && (typeof value.then === "function")) {
			this.handleThenable(value.then, value, resolve, reject)
		} else {
			resolve(value)
			this._state = "fulfilled"
		}
	}
	
	handleThenable(then, value, resolve, reject) {
		then.call(value, (thenValue) => {
			this.handleResolve(thenValue, resolve, reject)
		}, (thenReason) => {
			this.handleReject(thenReason, reject)
		})
	}
	
	then(onFulfilled, onRejected) {
		let self = this
		
		if(Promise._onHandle) {
			Promise._onHandle(self)
		}
		
		if(self._state === "pending") {
			self._deferred = true
		}
		
		let result = super.then(onFulfilled, onRejected)
		
		return result
	}
	
	static trackRejection(options) {
		options = options || {};
		var id = 0;
		var rejections = {};
		
		Promise._onReject = function(promise, err) {
			if (!promise._deferred) { // not yet handled
				if(options.onUnhandledRejection) {
					promise.catch(() => {})
				}
				
				promise._rejectionId = id++;
				rejections[promise._rejectionId] = {
					promise: promise,
					error: err,
					timeout: setTimeout(onUnhandled.bind(this, promise._rejectionId), 0),
					handled: false
				};
			}
		}
		
		Promise._onHandle = function (promise) {
			if (promise._state === "rejected" && rejections[promise._rejectionId]) {
				if (rejections[promise._rejectionId].handled) {
					onHandled(promise._rejectionId);
				} else {
					clearTimeout(rejections[promise._rejectionId].timeout);
				}
				delete rejections[promise._rejectionId];
			}
		};
		
		function onUnhandled(id) {
			if(rejections[id] && rejections[id].error && rejections[id].promise) {
				rejections[id].handled = true;
				if(options.onUnhandledRejection) {
					options.onUnhandledRejection({
						promise: rejections[id].promise,
						reason: rejections[id].error
					})
				}
			}
		}
		
		function onHandled(id) {
			if (rejections[id] && rejections[id].handled && rejections[id].error && rejections[id].promise) {
				if(options.onHandledRejection) {
					options.onHandledRejection({
						promise: rejections[id].promise,
						reason: rejections[id].error
					})
				}
			}
		}
	}
}