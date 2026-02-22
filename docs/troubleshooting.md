# Troubleshooting & FAQ

## 1. Events are not appearing in the Dashboard

- **Check Project Key:** Verify that the `data-project` attribute in your `<script>` tag exactly matches the project key from your Settings page.
- **Ad Blockers:** Privacy extensions like uBlock Origin or Brave Shields may block `/api/track` requests. Try disabling them while testing.
- **Cross-Origin Restrictions:** Ensure your domain is allowed in the project's CORS settings (if configured).

## 2. "Live Events" is disconnected

- Your browser or corporate firewall may be stripping Server-Sent Events (SSE).
- Verify that your deployment platform (e.g., Vercel, Nginx) is configured to hold `text/event-stream` connections open. Vercel automatically supports this for Serverless functions up to an execution limit, but remember to keep connections light.

## 3. Conversions aren't tracking

- **Type Check:** Ensure your rule type (`URL_MATCH` vs `CLICK_SELECTOR`) correctly aligns with what you want to track.
- **Pattern Match:** For URL match, double check the pattern substring. For Click Selector, ensure the `data-track` value matches exactly what you configured in the admin UI without `#` or `.` prefixes (e.g. pattern `buy-btn` if `<a data-track="buy-btn">`).

## 4. "Easy Mode" toggle isn't remembering my choice

- Easy Mode relies on `localStorage`. If you are browsing in Incognito/Private mode and close the browser, your preference will be reset to Normal Mode.

If you continue facing issues, please check the network payload in your browser's Developer Tools (F12) to see if the SDK is emitting data correctly to `/api/track`.
