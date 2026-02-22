# SDK Installation Guide

The Measurement OS relies on a single lightweight JavaScript snippet (`sdk.js`) to collect user data, page views, and interactions.

## 1. Get Your Snippet

In the Measurement OS Dashboard, go to **Settings** to find your unique project snippet. It will look like this:

```html
<script src="https://your-domain.vercel.app/sdk.js" data-project="PROJECT_KEY_HERE"></script>
```

## 2. Install on Your Website

Paste the snippet inside the `<head>` tag of every page you want to track.

### Example: HTML Page

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <!-- Kaiseki OS SDK -->
    <script src="https://your-domain.vercel.app/sdk.js" data-project="mvp-12345"></script>
</head>
<body>
...
```

## 3. Advanced Usage: Tracking Custom Clicks

To easily track custom clicks without writing JavaScript, add the `data-track` attribute to your HTML elements.

```html
<!-- Clicks on this link will be tracked as 'signup_cta' -->
<a href="/register" data-track="signup_cta">無料登録する</a>
```

You can then set up a "Click-based Conversion" in the dashboard using `[data-track="signup_cta"]` as the Selector.

## 4. SPA Support

The SDK automatically hooks into `history.pushState` and `window.onpopstate`. No extra configuration is needed for Single Page Applications (React, Next.js, Vue, etc.).
