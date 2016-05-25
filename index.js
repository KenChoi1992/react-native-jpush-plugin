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



let JPush;


// 如果JPushModule没有定义，说明可能没有成功安装插件，需要提醒用户重新安装一下
if (JPushModule) {

	JPush = {
		/**
		 * Android only
		 * 初始化JPush 必须先初始化才能执行其他操作
		 * @param  {any} success 成功的cb
		 * @param  {any} error 失败的cb
		 */
		 
		initPush: (success, error) => safeCallback('initPush', success, error),
		
		stopPush: (success, error) => safeCallback('stopPush', success, error),

		resumePush: (success, error) => safeCallback('resumePush', success, error),

		getInfo: (callback) => JPushModule.getInfo(map => callback(map)),

		setTag: tag => JPushModule.setTag(tag),

		setAlias: alias => JPushModule.setAlias(alias),

		setStyleBasic: () => JPushModule.setStyleBasic(),

		setStyleCustom: () => JPushModule.setStyleCustom(),

		addReceiveCustomMsgListener: (cb) => {
			listeners[cb] = DeviceEventEmitter.addListener(receiveCustomMsgEvent,
				(message) => {
					cb(message);
				});
		},

		removeReceiveCustomMsgListener: (cb) => {
			if (!listeners[cb]) {
				return;
			}
			listeners[cb].remove();
			listeners[cb] = null;
		},

		addReceiveNotificationListener: (cb) => {
			listeners[cb] = DeviceEventEmitter.addListener(receiveNotificationEvent,
				(message) => {
					cb(message);
				});
		},

		removeReceiveNotificationListener: (cb) => {
			if (!listeners[cb]) {
				return;
			}
			listeners[cb].remove();
			listeners[cb] = null;
		}

	}


} else {
	log('没有检测到JPush模块，请确认是否已正确链接到项目中。')
}


export default class JPush {

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

     static setBadge(badge, cb)


}

export default JPush;
