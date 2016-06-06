//   这个地方是更新配置文件 的脚本
var fs = require('fs');
var spath = require('path');
var os = require('os');

// add other link flag
var appKey = process.argv.splice(2)[0];
if (appKey == undefined || appKey == null) {
	console.log("error 没有输入 appKey 参数");
	return;
}

function projectConfiguration(path){
	
	if (isFile(path) == false) {
		console.log("configuration JPush error!!");
		return;
	}

	var rf = fs.readFileSync(path,"utf-8");
	rf = rf.replace(/				OTHER_LDFLAGS = \(/g, "				OTHER_LDFLAGS = \(\n\
						\"-framework\",\n\
						Adsupport,\n\
						\"-framework\",\n\
						Security,\n\
						\"-framework\",\n\
						UIKit,\n\
						\"-framework\",\n\
						Foundation,\n\
						\"-framework\",\n\
						CoreGraphics,\n\
						\"-framework\",\n\
						SystemConfiguration,\n\
						\"-framework\",\n\
						CoreTelephony,\n\
						\"-framework\",\n\
						CoreFoundation,\n\
						\"-framework\",\n\
						CFNetwork,\n\
						\"-lz\",");
	fs.writeFileSync(path, rf, "utf-8");	
}


function insertJpushCode(path){
	// 	 这个是插入代码的脚本 install


	if (isFile(path) == false) {
		console.log("configuration JPush error!!");
		return;
	}

	var rf = fs.readFileSync(path,"utf-8");
	// 删除所有的 JPush 相关代码  注册推送的没有删除，
	rf = rf.replace(/\n\#import \<RCTJPushModule.h\>/,"");
	rf = rf.replace(/\[JPUSHService registerDeviceToken:deviceToken\]\;\n/,"");

	// 插入 头文件
	rf = rf.replace(/#import "AppDelegate.h"/,"\#import \"AppDelegate.h\"\n\#import \<RCTJPushModule.h\>");
	fs.writeFileSync(path, rf, "utf-8");


	 // 这个是删除代码的脚本 uninstall
	// var rf = fs.readFileSync(path,"utf-8");
	// rf = rf.replace(/#import "AppDelegate.h"[*\n]#import <RCTJPushModule.h>/,"\#import \"AppDelegate.h\"");
	// fs.writeFileSync(path, rf, "utf-8");

	// 插入 注册推送 和启动jpush sdk
// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
	var rf = fs.readFileSync(path,"utf-8");
	var searchDidlaunch = rf.match(/\n.*didFinishLaunchingWithOptions.*\n?\{/);
	if (searchDidlaunch == null) {
		console.log("没有匹配到 didFinishLaunchingWithOptions");
		console.log(rf);
	} else {
		// console.log(searchDidlaunch[0]);
		rf = rf.replace(searchDidlaunch[0],searchDidlaunch[0] + "\n  if \(\[\[UIDevice currentDevice\]\.systemVersion floatValue\] \>\= 8\.0\) \{\n\
    \[JPUSHService registerForRemoteNotificationTypes\:\(UIUserNotificationTypeBadge \|\n\
                                                      UIUserNotificationTypeSound \|\n\
                                                      UIUserNotificationTypeAlert\)\n\
                                          categories\:nil\]\;\n\
  \} else \{\n\
    \[JPUSHService registerForRemoteNotificationTypes\:\(UIRemoteNotificationTypeBadge \|\n\
                                                      UIRemoteNotificationTypeSound \|\n\
                                                      UIRemoteNotificationTypeAlert)\n\
                                          categories\:nil\]\;\n\
  }\n\
  \n\
  \[JPUSHService setupWithOption\:launchOptions appKey\:\@\"" + appKey + "\"\n\
                        channel\:nil apsForProduction\:nil\]\;");
	}
	fs.writeFileSync(path, rf, "utf-8");
	
	//  这个插入代码 didRegisterForRemoteNotificationsWithDeviceToken
	var rf = fs.readFileSync(path,"utf-8");
	var search = rf.match(/\n.*didRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken[ ]*\{/);

	if (search == null) {
		console.log("没有匹配到 地点 didRegisterForRemoteNotificationsWithDeviceToken");
		rf = rf.replace(/\@end/,"\- \(void\)application\:\(UIApplication \*\)application\ndidRegisterForRemoteNotificationsWithDeviceToken\:\(NSData \*\)deviceToken \{\n\[JPUSHService registerDeviceToken:deviceToken\]\;\n\}\n\@end");
		// console.log(rf);
		fs.writeFileSync(path, rf, "utf-8");
	} else {
		console.log(search[0]);
		rf = rf.replace(search[0],search[0]+"\n\[JPUSHService registerDeviceToken:deviceToken\]\;");
		// console.log(rf);
		fs.writeFileSync(path, rf, "utf-8");
	}
}


// 判断文件
function exists(path){  
     return fs.existsSync(path) || path.existsSync(path);  
} 

function isFile(path){  
    return exists(path) && fs.statSync(path).isFile();  
} 

function isDir(path){  
    return exists(path) && fs.statSync(path).isDirectory();  
} 


//  深度遍历所有文件，  
getAllfiles("./",function (f, s) {
  var isAppdelegate = f.match(/AppDelegate\.m/);
  // 找到Appdelegate.m 文件 插入代码
  if (isAppdelegate != null) {  
  	console.log("the file is appdelegate:"+f);
	insertJpushCode(f);
  }

  // 找到 iOS 工程文件，插入需要链接的库文件
  var isiOSProjectPbxprojFile = f.match(/[.]*\.pbxproj/);
  if (isiOSProjectPbxprojFile != null) {
  	console.log("the file is iOS project file:"+f);
  	projectConfiguration(f);
  }
});
// getAllfiles("./",function(f,s){
//   console.log(f);
//   var isAppdelegate = f.match(/AppDelegate\.m/);
//   var isiOSProjectPbxprojFile = f.match(/[.]*\.pbxproj/);
// });
// function to get all file 
function getAllfiles(dir, findOne) {
  // if (arguments.length < 2) throw new TypeError('Bad arguments number');

  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function');
  }

  eachFileSync(spath.resolve(dir), findOne);
}

function eachFileSync (dir, findOne) {
  var stats = fs.statSync(dir);
  findOne(dir, stats);

  // 遍历子目录
  if (stats.isDirectory()) {
    var files = fullPath(dir, fs.readdirSync(dir));
    // console.log(dir);
    files.forEach(function (f) {
      eachFileSync(f, findOne);
    });
  }
}

function fullPath (dir, files) {
  return files.map(function (f) {
    return spath.join(dir, f);
  });
}

