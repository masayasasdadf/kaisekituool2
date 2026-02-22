# ノーコードCV設定 (No-code Conversions)

This Measurement OS supports setting up conversion tracking without modifying the site's source code beyond the initial SDK installation. This feature ensures that even non-technical marketers can track meaningful actions (Conversions).

## Types of Conversions Supported (MVP)

### A. URLベース (URL-based Conversions)

- **Condition:** Fires when a user lands on a specific URL or a URL matching a defined pattern.
- **Example Use Case:** Thank you pages (e.g., `/checkout/thanks`), registration completion screens.
- **"やさしい" (Easy Mode) UI Representation:** "このページが表示されたら成果" (If this page is shown, count as success)
- **Execution:** Managed completely server-side in `/api/track`. When a `page_view` event arrives, the server checks if the `url` matches the conversion rule.

### B. クリックベース (Click-based Conversions)

- **Condition:** Fires when a user clicks on an element matching a specific CSS selector.
- **Example Use Case:** "Add to Cart" button clicks (`.btn-add-to-cart`), standard link clicks.
- **"やさしい" (Easy Mode) UI Representation:** "このボタンが押されたら成果" (If this button is clicked, count as success)
- **Execution:** The SDK automatically tracks clicks on elements with `data-track` attributes and sends `cta_click` events. The server matches the `selector` against stored conversion rules.

### C. フォームベース (Form-based Conversions)

- *(Note: In this MVP, simple form submissions can be tracked by assigning a `data-track` ID to the submit button or redirecting to a specific URL).*

## Implementation Logic

1. When a `page_view` or `cta_click` event is received via `/api/track` (POST), the server fetches all `ConversionRule`s associated with the `projectId`.
2. It iterates through the rules, attempting to match:
   - For `URL_MATCH`: `page_view.url.includes(rule.pattern)`
   - For `CLICK_SELECTOR`: `cta_click.selector === rule.pattern`
3. If a match occurs, a `Conversion` record is created, linking it to the current `Session`.
4. The system emits an SSE notification containing the conversion details for the "Live Events" dashboard.
