package com.flashgrab;

import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class SystemSettings extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  SystemSettings(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "SystemSettings";
  }

  @ReactMethod
  public void Display() {
    Intent intent = new Intent(Settings.ACTION_DISPLAY_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
    if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
      reactContext.startActivity(intent);
    }
  }
}