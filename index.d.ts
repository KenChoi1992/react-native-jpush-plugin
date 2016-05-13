// by github:bang88
declare module JPush {
	type callback = (message: string) => void;

	export interface JPushInterface {
		/**
		 * 初始化JPush 必须先初始化才能执行其他操作
		 * @param  {any} success 成功的cb
		 * @param  {any} error 失败的cb
		 */
		initPush(success?: callback, error?: callback): void,
		/**
		 * 停止推送
		 *
		 * @param {callback} [success] (description)
		 * @param {callback} [error] (description)
		 */
		stopPush(success?: callback, error?: callback): void,

		/**
		 * 恢复推送
		 *
		 * @param success (description)
		 * @param error (description)
		 */
		resumePush(success, error): void,

		/**
		 * 初始化模块
		 *
		 * @param {Function} [callback] (description)
		 */
		initModule(callback?: Function): void,

		/**
		 * 设置tag
		 *
		 * @param {string} tag (标签)
		 */
		setTag(tag: string): void,

		/**
		 * 设置别名
		 *
		 * @param {string} alias (别名)
		 */
		setAlias(alias: string): void,

		/**
		 * (description)
		 *
		 * @type {void}
		 */
		setStyleBasic: void,

		/**
		 * (description)
		 *
		 * @type {void}
		 */
		setStyleCustom: void,

		/**
		 * (description)
		 *
		 * @type {void}
		 */
		addReceiveCustomMsgListener: void,

		/**
		 * (description)
		 *
		 * @type {void}
		 */
		removeReceiveCustomMsgListener: void,

		/**
		 * (description)
		 *
		 * @type {void}
		 */
		addReceiveNotificationListener: void,

		/**
		 * (description)
		 *
		 * @type {void}
		 */
		removeReceiveNotificationListener: void
	}
}

export = JPush
