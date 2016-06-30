package cn.jpush.reactnativejpush;

import android.app.Notification;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.LinkedHashSet;
import java.util.Set;

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.CustomPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

public class JPushModule extends ReactContextBaseJavaModule {

    private static String TAG = "JPushModule";
    private Context mContext;
    private static ReactApplicationContext mRAC;
    private static JPushModule mModule;

    public JPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mRAC = reactContext;
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @Override
    public String getName() {
        return "JPushModule";
    }

    @Override
    public void initialize() {
        super.initialize();
        mModule = this;
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        mModule = null;
    }

    @ReactMethod
    public void initPush() {
        mContext = getCurrentActivity();
        JPushInterface.init(getReactApplicationContext());
        Toast.makeText(mContext, "Init push success", Toast.LENGTH_SHORT).show();
        Log.i("PushSDK", "init Success !");
    }

    @ReactMethod
    public void getInfo(Callback successCallback) {
        WritableMap map = Arguments.createMap();
        String appKey = "AppKey:" + ExampleUtil.getAppKey(getReactApplicationContext());
        map.putString("myAppKey", appKey);
        String imei = "IMEI: " + ExampleUtil.getImei(getReactApplicationContext(), "");
        map.putString("myImei", imei);
        String packageName = "PackageName: " + getReactApplicationContext().getPackageName();
        map.putString("myPackageName", packageName);
        String deviceId = "DeviceId: " + ExampleUtil.getDeviceId(getReactApplicationContext());
        map.putString("myDeviceId", deviceId);
        String version = "Version: " + ExampleUtil.GetVersion(getReactApplicationContext());
        map.putString("myVersion", version);
        successCallback.invoke(map);
    }

    @ReactMethod
    public void stopPush() {
        mContext = getCurrentActivity();
        JPushInterface.stopPush(getReactApplicationContext());
        Log.i("PushSDK", "stop push");
        Toast.makeText(mContext, "Stop push success", Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void resumePush() {
        mContext = getCurrentActivity();
        JPushInterface.resumePush(getReactApplicationContext());
        Log.i("PushSDK", "resume push");
        Toast.makeText(mContext, "Resume push success", Toast.LENGTH_SHORT).show();
    }

    //为用户设置Tag,可以在服务端根据Tag推送消息
    @ReactMethod
    public void setTags(final ReadableArray strArray, final Callback callback) {
        mContext = getCurrentActivity();
        Log.i(TAG, "tag: " + strArray.toString());
        if (strArray.size() > 0) {
            Set<String> tagSet = new LinkedHashSet<>();
            for (int i = 0; i < strArray.size(); i++) {
                if (!ExampleUtil.isValidTagAndAlias(strArray.getString(i))) {
                    Toast.makeText(mContext, "Invalid tag !", Toast.LENGTH_SHORT).show();
                    return;
                }
                tagSet.add(strArray.getString(i));
            }
            final ProgressDialog dialog = new ProgressDialog(mContext);
            dialog.setMessage("Loading");
            dialog.show();
            JPushInterface.setAliasAndTags(getReactApplicationContext(), null,
                    tagSet, new TagAliasCallback() {
                        @Override
                        public void gotResult(int status, String desc, Set<String> set) {
                            dialog.dismiss();
                            switch (status) {
                                case 0:
                                    Log.i(TAG, "Set tag success. tag: " + strArray.toString());
                                    Toast.makeText(getReactApplicationContext(),
                                            "Set tag success", Toast.LENGTH_SHORT).show();
                                    callback.invoke(0);
                                    break;
                                case 6002:
                                    Log.i(TAG, "Set tag timeout");
                                    Toast.makeText(getReactApplicationContext(),
                                            "Set tag timeout, check your network", Toast.LENGTH_SHORT).show();
                                    callback.invoke("Set tag timeout");
                                    break;
                                default:
                                    Toast.makeText(getReactApplicationContext(),
                                            "Error code: " + status, Toast.LENGTH_SHORT).show();
                                    callback.invoke("Set tag failed. Error code: " + status);
                            }
                        }
                    });
        } else {
            Toast.makeText(mContext, "Empty tag ", Toast.LENGTH_SHORT).show();
        }
    }

    //为用户设置别名,可以在服务端根据别名推送
    @ReactMethod
    public void setAlias(String str, final Callback callback) {
        mContext = getCurrentActivity();
        final String alias = str.trim();
        Log.i(TAG, "alias: " + alias);
        if (!TextUtils.isEmpty(alias)) {
            JPushInterface.setAliasAndTags(getReactApplicationContext(), alias,
                    null, new TagAliasCallback() {
                        @Override
                        public void gotResult(int status, String desc, Set<String> set) {
                            switch (status) {
                                case 0:
                                    Log.i(TAG, "Set alias success");
                                    Toast.makeText(getReactApplicationContext(),
                                            "Set alias success", Toast.LENGTH_SHORT).show();
                                    callback.invoke("Set alias success. alias: " + alias);
                                    break;
                                case 6002:
                                    Log.i(TAG, "Set alias timeout");
                                    Toast.makeText(getReactApplicationContext(),
                                            "set alias timeout, check your network", Toast.LENGTH_SHORT).show();
                                    callback.invoke("Set alias timeout");
                                    break;
                                default:
                                    Toast.makeText(getReactApplicationContext(),
                                            "Error code: " + status, Toast.LENGTH_SHORT).show();
                                    callback.invoke("Set alias failed. Error code: " + status);
                            }
                        }
                    });
        } else {
            Toast.makeText(mContext, "Empty alias ", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 设置通知提示方式 - 基础属性
     */
    @ReactMethod
    public void setStyleBasic() {
        mContext = getCurrentActivity();
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(mContext);
        builder.statusBarDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
        builder.notificationFlags = Notification.FLAG_AUTO_CANCEL;  //设置为点击后自动消失
        builder.notificationDefaults = Notification.DEFAULT_SOUND;  //设置为铃声（ Notification.DEFAULT_SOUND）或者震动（ Notification.DEFAULT_VIBRATE）
        JPushInterface.setPushNotificationBuilder(1, builder);
        Toast.makeText(mContext, "Basic Builder - 1", Toast.LENGTH_SHORT).show();
    }


    /**
     * 设置通知栏样式 - 定义通知栏Layout
     */
    @ReactMethod
    public void setStyleCustom() {
        mContext = getCurrentActivity();
        CustomPushNotificationBuilder builder = new CustomPushNotificationBuilder(mContext
                , IdHelper.getLayout(mContext, "customer_notification_layout"),
                IdHelper.getViewID(mContext, "icon"), IdHelper.getViewID(mContext, "title"),
                IdHelper.getViewID(mContext, "text"));
        builder.layoutIconDrawable = IdHelper.getDrawable(mContext, "ic_launcher");
        builder.developerArg0 = "developerArg2";
        JPushInterface.setPushNotificationBuilder(2, builder);
        Toast.makeText(mContext, "Custom Builder - 2", Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void getRegistrationID(Callback callback) {
        mContext = getCurrentActivity();
        String id = JPushInterface.getRegistrationID(mContext);
        callback.invoke(id);
    }

    @ReactMethod
    public void clearAllNotifications() {
        JPushInterface.clearAllNotifications(getReactApplicationContext());
    }

    public static class JPushReceiver extends BroadcastReceiver {

        public JPushReceiver() {
        }

        @Override
        public void onReceive(Context context, Intent data) {
            Bundle bundle = data.getExtras();
            if(JPushInterface.ACTION_MESSAGE_RECEIVED.equals(data.getAction())) {
                String message = data.getStringExtra(JPushInterface.EXTRA_MESSAGE);
                Log.i(TAG, "收到自定义消息: " + message);
                mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("receivePushMsg", message);
            } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(data.getAction())) {
                String message = bundle.getString(JPushInterface.EXTRA_ALERT);
                Log.i(TAG, "收到推送下来的通知: " + message);
                mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("receiveNotification", message);
            } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(data.getAction())) {
                Log.d(TAG, "用户点击打开了通知");
                WritableMap map = Arguments.fromBundle(bundle);
                mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("openNotification", map);
                if (mModule != null && mModule.mContext != null) {
                    Intent intent = new Intent(context, mModule.mContext.getClass());
                    intent.putExtras(bundle);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                    Log.d(TAG, "正在打开应用");
                }
            }
        }
    }
}
