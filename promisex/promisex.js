import { asap } from "./asap.js"

const noop = function() {}
const isObject = (val) => val !== null && typeof val === 'object'

const doResolve = Symbol('a');
/**
 * 0 - pending
 * 1 - fulfilled with PromiseResult
 * 2 - rejected with PromiseResult
 * 3 - Promise的状态取决于其他Promise的PromiseResult
 */
const PromiseState = Symbol('b')
const PromiseResult = Symbol('c')

const deferredState = Symbol('d')
const deferreds = Symbol('e')

/**
 * 通知修改Promise状态
 * resolve方法执行后，Promise的状态将变为fulfilled
 * reject方法执行后，Promise的状态将变为rejected
 */
const resolve = Symbol('f')
const reject = Symbol('g')
const finale = Symbol('h')

const handle = Symbol('i')
const handleResolved = Symbol('j')

var LAST_ERROR = null;
var IS_ERROR = {};

/**
 * @author Alwin
 * Promise重构
 * 由于原生小程序提供的Promise，微信小程序基础库2.16.0以上的版本，
 * 模拟器或者电脑版微信不会执行onUnhandledRejection回调
 * 
 * 参考:https://github.com/then/promise
 */
export class PromiseX extends Promise {

	constructor(excutor) {
		if (typeof excutor !== 'function') {
			throw new TypeError('Promise constructor\'s argument is not a function');
		}

		super(noop)
		// super(excutor)

		this[PromiseState] = 0;
		this[PromiseResult] = null;
		this[deferredState] = 0;
		this[deferreds] = null;

		if (excutor === noop) return;
		this[doResolve](excutor);
	}
	
	then(onFulfilled, onRejected) {
		var self = this
		if (self.constructor !== Promise) {
			return new self.constructor(function (resolve, reject) {
				var res = new Promise(noop);
			    res.then(resolve, reject);
			    self[handle](new Handler(onFulfilled, onRejected, res));
			})
		}
		var res = new Promise(noop);
		self[handle](new Handler(onFulfilled, onRejected, res));
		return res;
	}
	
	static trackRejection(options) {
		options = options || {};
		var id = 0;
		var rejections = {};
		
		Promise._onReject = function(promise, err) {
			if (promise[deferredState] === 0) { // not yet handled
				promise._rejectionId = id++;
				rejections[promise._rejectionId] = {
					promise: promise,
					error: err,
					timeout: setTimeout(onUnhandled.bind(this, promise._rejectionId), 100),
					handled: false
				};
			}
		}
		
		Promise._onHandle = function (promise) {
			if (promise[PromiseState] === 2 && rejections[promise._rejectionId]) {
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
				} else {
					var error = rejections[id].error
					var errStr = 'Unhandled promise rejection\n' + (error && (error.stack || error)) + '';
					console.error(errStr)
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

	[doResolve](excutor) {
		var done = false;
		var res = undefined;
		var self = this
		try {
			res = excutor(function(value) {
				//一旦调用Promise内置的resolve，就会执行到着
				if (done) return;
				done = true;
				self[resolve](value);
			}, function(reason) {
				//一旦调用Promise内置的reject，就会执行到着
				if (done) return;
				done = true;
				self[reject](reason);
			})
		} catch (ex) {
			LAST_ERROR = ex;
			res = IS_ERROR;
		}

		//excutor调用过程中发生了异常
		if (!done && res === IS_ERROR) {
			done = true;
			self[reject](LAST_ERROR);
		}
	}

	[resolve](value) {
		if(value === this) {
			return this[reject](new TypeError('A promise cannot be resolved with itself.'))
		}
		if(value && (typeof value === 'object' || typeof value === 'function')) {
			var then = undefined;
			
			try {
			  then = value.then;
			} catch (ex) {
			  LAST_ERROR = ex;
			  then = IS_ERROR;
			}
			if(then === IS_ERROR) {
				return this[reject](LAST_ERROR);
			}
			
			if(then === this.then && value instanceof Promise) {
				/**
				 * example:
				 * new Promise((resolve, reject) => {
				 *     resolve(Promise.resolve({name: "wqwqw"}))
				 * })
				 */
				this[PromiseState] = 3;
				this[PromiseResult] = value;
				this[finale]();
				return;
			}else if(typeof then === 'function') {
				/**
				 * example:
				 * Promise.resolve({
				 *   then: function(resolve, reject) {
				 *	     resolve("wqwqwqwqwqw")
				 *   }	 
				 * })
				 */
				this[doResolve](then.bind(value));
				return;
			}
		}
		this[PromiseState] = 1;
		this[PromiseResult] = value;
		this[finale]();
	}

	[reject](reason) {
		this[PromiseState] = 2;
		this[PromiseResult] = reason
		Promise._onReject && Promise._onReject(this, reason)
		this[finale]();
	}
	
	/**
	 * 处理过程很繁琐...
	 */
	[handle](deferred) {
		let promise = this
		while(promise[PromiseState] === 3) {
		    promise = promise[PromiseResult];
		}
		
		Promise._onHandle && Promise._onHandle(promise);
		
		//deferredState: 1/2代表延迟处理，即延迟调用then的callBack以及resolve或者reject
		//如果整个Promise流程结束了，并且此时状态未rejected，deferredState还是0，说明没有被处理
		if(promise[PromiseState] === 0) {
			if(promise[deferredState] === 0) {
			  promise[deferredState] = 1;
			  promise[deferreds] = deferred;
			  return;
			}
			
			if(promise[deferredState] === 1) {
			  promise[deferredState] = 2;
			  promise[deferreds] = [promise[deferreds], deferred];
			  return;
			}
			
			promise[deferreds].push(deferred);
			return;
		}
		
		promise[handleResolved](deferred);
	}

	[handleResolved](deferred) {
		let self = this
		asap(function() {
			var cb = self[PromiseState] === 1 ? deferred.onFulfilled : deferred.onRejected;
			if(cb === null) {
				if(self[PromiseState] === 1) {
					deferred.promise[resolve](self[PromiseResult]);
				}else {
					deferred.promise[reject](self[PromiseResult]);
				}
				return;
			}
			
			var res;
			try{
				res = cb(self[PromiseResult]);
			}catch(ex) {
				LAST_ERROR = ex;
				res = IS_ERROR;
			}
			
			if(res === IS_ERROR) {
				deferred.promise[reject](LAST_ERROR);
			}else {
				deferred.promise[resolve](res);
			}
		})
	}

	[finale]() {
		if (this[deferredState] === 1) {
			this[handle](this[deferreds]);
			this[deferreds] = null;
		}
		if (this[deferredState] === 2) {
			for (var i = 0; i < this[deferreds].length; i++) {
			  this[handle](this[deferreds][i]);
			}
			this[deferreds] = null;
		}
	}
}

class Handler {
	constructor(onFulfilled, onRejected, promise) {
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.promise = promise;
	}
}
