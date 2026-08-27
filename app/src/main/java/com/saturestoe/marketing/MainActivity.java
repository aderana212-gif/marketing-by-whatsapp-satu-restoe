package com.saturestoe.marketing;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.view.Window;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 23) {
            w.setStatusBarColor(android.graphics.Color.rgb(11,58,117));
            w.setNavigationBarColor(android.graphics.Color.BLACK);
        }

        web = new WebView(this);
        setContentView(web);

        if (Build.VERSION.SDK_INT >= 30) {
            web.setOnApplyWindowInsetsListener((v, insets) -> {
                android.graphics.Insets top = insets.getInsets(WindowInsets.Type.statusBars());
                android.graphics.Insets bottom = insets.getInsets(WindowInsets.Type.navigationBars());
                v.setPadding(0, top.top, 0, bottom.bottom);
                return insets;
            });
        }

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);

        web.addJavascriptInterface(new AndroidBridge(), "Android");
        web.setWebViewClient(new WebViewClient());
        web.loadUrl("file:///android_asset/index.html");
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void openWhatsAppBusiness(String phone, String text) {
            runOnUiThread(() -> {
                String p = phone == null ? "" : phone.replaceAll("\\D", "");
                if (p.startsWith("0")) p = "62" + p.substring(1);
                if (p.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Nomor WhatsApp belum diisi.", Toast.LENGTH_SHORT).show();
                    return;
                }
                try {
                    Uri uri = Uri.parse("https://wa.me/" + p + "?text=" + Uri.encode(text == null ? "" : text));
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    intent.setPackage("com.whatsapp.w4b");
                    startActivity(intent);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this,
                            "WhatsApp Business tidak tersedia atau belum terpasang.",
                            Toast.LENGTH_LONG).show();
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
