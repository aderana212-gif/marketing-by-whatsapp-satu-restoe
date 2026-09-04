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
            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Load the live Supabase updater after the local HTML is ready.
                // This keeps the bundled database as an offline fallback while
                // allowing contacts/templates to change without reinstalling.
                view.loadUrl("javascript:(function(){if(window.__satuRestoeUpdaterLoaded)return;window.__satuRestoeUpdaterLoaded=true;var s=document.createElement('script');s.src='file:///android_asset/updater.js?t='+Date.now();document.head.appendChild(s);var st=document.createElement('style');st.textContent='textarea{font-family:Arial,sans-serif!important;line-height:1.45}body{padding-bottom:96px!important}main{padding-bottom:24px!important}';document.head.appendChild(st);})()");
            }

            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null && url.startsWith("https://wa.me/")) {
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
            Uri source = Uri.parse(webUrl);
            String phone = source.getPath();
            String text = source.getQueryParameter("text");
            if (phone != null) phone = phone.replaceAll("[^0-9]", "");

            Uri.Builder b = Uri.parse("whatsapp://send").buildUpon();
            if (phone != null && !phone.isEmpty()) b.appendQueryParameter("phone", phone);
            if (text != null && !text.isEmpty()) b.appendQueryParameter("text", text);

            Intent intent = new Intent(Intent.ACTION_VIEW, b.build());
            intent.setPackage("com.whatsapp.w4b");
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(this, "WhatsApp Business belum terpasang atau tidak dapat dibuka.", Toast.LENGTH_LONG).show();
        }
    }
}

// Build trigger: mobile typography and bottom safe spacing.