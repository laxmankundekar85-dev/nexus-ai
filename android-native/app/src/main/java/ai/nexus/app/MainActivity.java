package ai.nexus.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private static final String APP_URL = "https://nexus-ai-ecru-nine.vercel.app/dashboard";
    private static final String APP_HOST = "nexus-ai-ecru-nine.vercel.app";
    private static final String CHANNEL_ID = "nexus_ai_tasks";
    private static final int NOTIFICATION_PERMISSION_CODE = 1001;

    private WebView mWebView;
    private SwipeRefreshLayout mSwipeRefresh;
    private ProgressBar mProgressBar;
    private volatile boolean mWebCanScrollUp = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        createNotificationChannel();
        requestNotificationPermission();

        mWebView = findViewById(R.id.webView);
        mSwipeRefresh = findViewById(R.id.swipeRefreshLayout);
        mProgressBar = findViewById(R.id.progressBar);

        setupWebView();
        setupSwipeRefresh();
        setupBackNavigation();

        if (savedInstanceState != null) {
            mWebView.restoreState(savedInstanceState);
        } else {
            mWebView.loadUrl(APP_URL);
        }
    }

    private void setupWebView() {
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        
        // Custom user-agent identifier to signal native Android app
        String defaultUA = settings.getUserAgentString();
        settings.setUserAgentString(defaultUA + " NexusAI-Android/2.0");

        mWebView.addJavascriptInterface(new NexusNativeBridge(this), "NexusNativeBridge");

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if (host != null && (host.equals(APP_HOST) || host.endsWith("vercel.app"))) {
                    return false; // Load inside WebView
                }
                // External links open in default handler
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                mProgressBar.setVisibility(View.VISIBLE);
                mWebCanScrollUp = false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                mProgressBar.setVisibility(View.GONE);
                mSwipeRefresh.setRefreshing(false);

                // Inject notification bridge and continuous scroll tracking
                String injection = 
                    "(function() {" +
                    "  if (window.__nexusNativeHooked) return;" +
                    "  window.__nexusNativeHooked = true;" +
                    "  const origNotification = window.Notification;" +
                    "  window.Notification = function(title, options) {" +
                    "    const body = (options && options.body) ? options.body : '';" +
                    "    if (window.NexusNativeBridge && window.NexusNativeBridge.showNotification) {" +
                    "      window.NexusNativeBridge.showNotification(title, body);" +
                    "    }" +
                    "    return new origNotification(title, options);" +
                    "  };" +
                    "  window.Notification.permission = 'granted';" +
                    "  window.Notification.requestPermission = function() { return Promise.resolve('granted'); };" +
                    "  function reportScroll() {" +
                    "    var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;" +
                    "    var canScroll = top > 2;" +
                    "    var main = document.querySelector('main');" +
                    "    if (main && main.scrollTop > 2) canScroll = true;" +
                    "    if (window.NexusNativeBridge && window.NexusNativeBridge.setWebScrollState) {" +
                    "      window.NexusNativeBridge.setWebScrollState(canScroll);" +
                    "    }" +
                    "  }" +
                    "  window.addEventListener('scroll', reportScroll, { passive: true, capture: true });" +
                    "  document.addEventListener('scroll', reportScroll, { passive: true, capture: true });" +
                    "})();";
                view.evaluateJavascript(injection, null);
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    mProgressBar.setVisibility(View.VISIBLE);
                    mProgressBar.setProgress(newProgress);
                } else {
                    mProgressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }
        });
    }

    private void setupSwipeRefresh() {
        mSwipeRefresh.setColorSchemeResources(R.color.primary);
        mSwipeRefresh.setProgressBackgroundColorSchemeResource(R.color.background);
        mSwipeRefresh.setOnRefreshListener(() -> mWebView.reload());
        
        // Fix: Only trigger pull-to-refresh when at the VERY top of the page (like YouTube).
        // If scrolled down anywhere in the app, canChildScrollUp returns true,
        // which prevents SwipeRefreshLayout from intercepting downward touches and lets the user scroll back up!
        mSwipeRefresh.setOnChildScrollUpCallback((parent, child) -> {
            boolean canNativeScrollUp = mWebView.canScrollVertically(-1) || mWebView.getScrollY() > 0;
            return canNativeScrollUp || mWebCanScrollUp;
        });
    }

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (mWebView.canGoBack()) {
                    mWebView.goBack();
                } else {
                    setEnabled(false);
                    MainActivity.super.onBackPressed();
                }
            }
        });
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Nexus AI Notifications",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Task completions and agent updates");
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 250, 100, 250});
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) 
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    NOTIFICATION_PERMISSION_CODE
                );
            }
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mWebView.saveState(outState);
    }

    public class NexusNativeBridge {
        private final Context context;

        public NexusNativeBridge(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void setWebScrollState(boolean canScrollUp) {
            mWebCanScrollUp = canScrollUp;
        }

        @JavascriptInterface
        public void showNotification(String title, String message) {
            try {
                Intent intent = new Intent(context, MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );

                NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(title != null ? title : "Nexus AI")
                    .setContentText(message != null ? message : "Task alert")
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setAutoCancel(true)
                    .setContentIntent(pendingIntent)
                    .setVibrate(new long[]{0, 250, 100, 250});

                NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                if (manager != null) {
                    manager.notify((int) System.currentTimeMillis(), builder.build());
                }
            } catch (Exception ignored) {
            }
        }
    }
}
