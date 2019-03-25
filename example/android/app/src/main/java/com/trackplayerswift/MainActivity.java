package com.trackplayerswift;

import com.facebook.react.ReactActivity;
import com.facebook.react.GoogleCastActivity;
import com.crashlytics.android.Crashlytics;
import android.os.Bundle;
import io.fabric.sdk.android.Fabric;

public class MainActivity extends GoogleCastActivity {
        @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      Fabric.with(this, new Crashlytics());
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "trackplayerSwift";
    }
}
