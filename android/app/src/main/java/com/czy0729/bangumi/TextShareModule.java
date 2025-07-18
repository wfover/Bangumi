package com.czy0729.bangumi;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.app.Activity;
import android.content.Intent;

public class TextShareModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private static String lastSharedText = null;
  private static boolean isComponentMounted = false;

  public TextShareModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @NonNull
  @Override
  public String getName() {
    return "TextShareModule";
  }

  @ReactMethod
  public void notifyComponentMounted() {
    isComponentMounted = true;
    checkPendingShare();
  }

  @ReactMethod
  public void notifyComponentUnmounted() {
    isComponentMounted = false;
  }

  @ReactMethod
  public void getSharedText(Promise promise) {
    try {
      Activity currentActivity = getCurrentActivity();
      if (currentActivity != null) {
        Intent intent = currentActivity.getIntent();
        if (intent != null && "com.czy0729.bangumi.ACTION_SHARE_TEXT".equals(intent.getAction())) {
          String text = intent.getStringExtra("shared_text");
          if (text != null) {
            promise.resolve(text);
            intent.removeExtra("shared_text");
            return;
          }
        }
      }
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("ERROR_GETTING_TEXT", e);
    }
  }

  public static void sendShareEvent(String text) {
    if (text == null) return;

    lastSharedText = text;
    if (isComponentMounted && reactContext != null) {
      WritableMap params = Arguments.createMap();
      params.putString("text", text);
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("onTextShared", params);
    }
  }

  private static void checkPendingShare() {
    if (isComponentMounted && lastSharedText != null && reactContext != null) {
      WritableMap params = Arguments.createMap();
      params.putString("text", lastSharedText);
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("onTextShared", params);
      lastSharedText = null;
    }
  }
}
