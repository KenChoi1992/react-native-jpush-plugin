import {NativeModules, Platform, DeviceEventEmitter} from 'react-native';

const JPushModule = NativeModules.JPushModule;

const listeners = {};
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";

/**
 * Logs message to console with the [JPush] prefix
 * @param  {string} message
 */
const log = (message) => {
	console.log(`[JPush] ${message}`);
}
// is function
const isFunction = (fn) => typeof fn === 'function';
/**
 * create a safe fn env
 * @param  {any} fn
 * @param  {any} success
 * @param  {any} error
 */
const safeCallback = (fn, success, error) => {

	JPushModule[fn](function (params) {
		log(params);
		isFunction(success) && success(params)
	}, function (error) {
		log(error)
		isFunction(error) && error(error)
	})

}

export default class JPush {

	/**
	 * Android only
	 * 初始化JPush 必须先初始化才能执行其他操作
	*/
	static initPush() {
		JPushModule.initPush();
	}

	static stopPush() {
		JPushModule.stopPush();
	}

	static resumePush() {
		JPushModule.resumePush();
	}

	static getInfo(cb) {
		JPushModule.getInfo((map) => {
			cb(map);
		});
	}

	/**
	 * Android 
	*/
	static setTag(tag, success, error) {
		JPushModule.setTag(tag, (resultCode) => {
			if (resultCode === 0) {
				success;
			} else {
				error;
			}
		});
	}
	
	/**
	 * Android 
	*/
	static setAlias(alias, success, error) {
		JPushModule.setAlias(alias, (resultCode) => {
			if (resultCode === 0) {
				success;
			} else {
				error;
			}
		});
	}

	/**
	 * Android 
	*/
	static addReceiveCustomMsgListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(receiveCustomMsgEvent,
			(message) => {
				cb(message);
			});
	}

	/**
	 * Android 
	*/
	static removeReceiveCustomMsgListener(cb) {
		if (!listeners[cb]) {
				return;
			}
			listeners[cb].remove();
			listeners[cb] = null;
	}

	/**
	 * Android 
	*/
	static addReceiveNotificationListener(cb) {
 		listeners[cb] = DeviceEventEmitter.addListener(receiveNotificationEvent,
 			(message) => {
 				cb(message);
 			});
 	}
 
 	/**
	 * Android 
	*/
 	static removeReceiveNotificationListener(cb) {
 		if (!listeners[cb]) {
 			return;
 		}
 		listeners[cb].remove();
 		listeners[cb] = null;
 	}

 	static getRegistrationID(cb) {
 		JPushModule.getRegistrationID((id) => {
 			cb(id);
 		});
 	}

	static setupPush() {
		JPushModule.setupPush;
	}


     static getAppkeyWithcallback(cb) {
     	JPushModule.getAppkeyWithcallback((appkey) => {
     		cb(appkey);
     	});
     }

     static setTag(tag, success, fail) {
     	JPushModule.setTags(tag, null, (resultCode) => {
     		if (resultCode == 0) {
     			success;
     		} else {
     			fail;
     		}
     	});
     }

     static setAlias(alias, success, fail) {
     	JPushModule.setTags(null, alias, (resultCode) => {
     		if (resultCode == 0) {
     			success;
     		} else {
     			fail;
     		}
     	})
     }

  	static addLocationNotification(date, textContain, badge, alertAction, notificationKey, userInfo, soundName) {
  		JPushModule.addLocationNotification(date, textContain, badge, alertAction, notificationKey, userInfo, soundName);
  	}
//  add listener
        // NativeAppEventEmitter.addListener('networkDidSetup', (token) => {
        // this.setState({ connectStatus: '已连接' });
        // });
        // NativeAppEventEmitter.addListener('networkDidClose', (token) => {
        // this.setState({ connectStatus: '连接已断开' });
        // });
        // NativeAppEventEmitter.addListener('networkDidRegister', (token) => {
        // this.setState({ connectStatus: '已注册' });
        // });
        // NativeAppEventEmitter.addListener('networkDidLogin', (token) => {
        // this.setState({ connectStatus: '已登陆' });
        // });

     static setBadge(badge, cb){

     }
}
