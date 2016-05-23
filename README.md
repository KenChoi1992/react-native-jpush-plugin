# react-native-jpush-plugin

###Android Usage

- 使用命令行在你的React Native Project目录中安装：

```
npm install jpush-for-react-native --save

rnpm link jpush-for-react-native
```

- 使用Android Studio import你的React Native应用（选择你的React Native应用所在目录下的android文件夹即可）

- 修改android项目下的setting.gradle配置：

> setting.gradle

```
include ':app', ':jpush-for-react-native'
project(':jpush-for-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/jpush-for-react-native/android')

```

- 修改app下的build.gradle配置：

> your react native project/android/app/build.gradle

```
dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])
    compile project(':jpush-for-react-native')
    compile "com.facebook.react:react-native:+"  // From node_modules
}
```

- 现在重新sync一下项目，应该能看到jpush-for-react-native作为一个android Library项目导进来了

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin1.png)

- 打开jpush-for-react-native的build.gradle文件，修改相关配置：

> jpush-for-react-native/android/build.gradle

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin2.png)

将此处的yourAppKey替换成你在官网上申请的应用的AppKey

- 打开app下的MainActivity，在ReactInstanceManager的build方法中加入JPushPackage：

> app/MainActivity.java

![](https://github.com/KenChoi1992/SomeArticles/blob/master/screenshots/plugin3.png)

- 在JS中import JPushModule，然后即调用相关方法：
```
import JPushModule from 'jpush-for-react-native';

...

componentDidMount() {
    JPushModule.addReceiveCustomMsgListener((message) => {
      this.setState({pushMsg: message});
    });
    JPushModule.addReceiveNotificationListener((message) => {
      console.log("receive notification: " + message);
    })
  }

  componentWillUnmount() {
    JPushModule.removeReceiveCustomMsgListener();
    JPushModule.removeReceiveNotificationListener();
  }
```

关于JPushModule的具体方法可以参考jpush-for-react-native文件夹下的index.js文件，此处将方法罗列如下：

- initPush()
- getInfo(map)
```
JPushModule.getInfo((map) => {
      this.setState({
            appkey: map.myAppKey,
            imei: map.myImei,
            package: map.myPackageName,
            deviceId: map.myDeviceId,
            version: map.myVersion
      });
    });
```
- stopPush()
- resumePush()
- setTag(tag)
- setAlias(alias)
- setStyleBasic()
- setStyleCustom()
- addReceiveCustomMsgListener(callback)
- removeReceiveCustomMsgListener()
- addReceiveNotificationListener()
- removeReceiveNotificationListener()


####iOS Usage
- 在工程target的Build Phases->Link Binary with Libraries中加入libz.tbd、CoreTelephony.framework、Security.framework
- JPushModule 类中定义了react调用原生JPush方法的接口
- 在AppDelegate.m 的didRegisterForRemoteNotificationsWithDeviceToken 方法中添加 [JPUSHService registerDeviceToken:deviceToken]; 如下所示
```
- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}
```
---
贡献者列表
- [bang88](https://github.com/bang88)




