import {NativeModules, DeviceEventEmitter} from 'react-native';

var JPushModule = NativeModules.JPushModule;
var listeners = {};
var receiveCustomMsgEvent = "receivePushMsg";
var receiveNotificationEvent = "receiveNotification";

export default class  JPush {
	static initPush() {
		JPushModule.initPush((msg) => {
			console.log("init " + msg);
		}, (msg) => {
			console.log("init push failed " + msg);
		});
	}

	static initModule(cb) {
		JPushModule.initModule((map) => {
			cb(map);
		});
	}

	static stopPush() {
		JPushModule.stopPush((msg) => {
			console.log("stop " + msg);
		}, (msg) => {
			console.log("stop push failed " + msg);
		});
	}
	
	static resumePush() {
		JPushModule.resumePush((msg) =>{
			console.log("resume " + msg);
		}, (msg) => {
			console.log("resume " + msg);
		});
	}
	
	static setTag(tag) {
		JPushModule.setTag(tag);
	}
	
	static setAlias(alias) {
		JPushModule.setAlias(alias);
	}
	
	static setStyleBasic() {
		JPushModule.setStyleBasic();
	}

	static setStyleCustom() {
		JPushModule.setStyleCustom();
	}

	static addReceiveCustomMsgListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(receiveCustomMsgEvent,
			(message) => {
				cb(message);
		});
	}

	static removeReceiveCustomMsgListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}

	static addReceiveNotificationListener(cb) {
		listeners[cb] = DeviceEventEmitter.addListener(receiveNotificationEvent,
			(message) => {
				cb(message);
			});
	}

	static removeReceiveNotificationListener(cb) {
		if (!listeners[cb]) {
			return;
		}
		listeners[cb].remove();
		listeners[cb] = null;
	}
}