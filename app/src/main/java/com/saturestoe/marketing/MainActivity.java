package com.saturestoe.marketing;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("https://wa.me/")) {
                    openWhatsAppBusiness(url);
                    return true;
                }
                return false;
            }
        });

        web.loadUrl("file:///android_asset/index.html");
    }

    private void openWhatsAppBusiness(String webUrl) {
        try {
            // Keep the exact selected customer's phone and prefilled message.
            // Use the official HTTPS WhatsApp link as the URI, but explicitly
            // target the WhatsApp Business Android package.
            Uri target = Uri.parse(webUrl);
            Intent intent = new Intent(Intent.ACTION_VIEW, target);
            intent.setPackage("com.whatsapp.w4b");
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(this,
                    "WhatsApp Business belum tersedia atau belum diizinkan.",
                    Toast.LENGTH_LONG).show();
        }
    }
}
