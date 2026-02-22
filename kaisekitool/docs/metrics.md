# Metrics Definitions (指標定義)

This document precisely outlines how each key metric in Kaiseki OS is calculated on the backend.

## Session & Engagement Rules

### **Session (セッション)**

- **Definition:** A continuous period of user activity on the website.
- **Expiration:** A session ends when the `k_sid` cookie expires (defaults to 30 minutes of inactivity). Any interaction (page view, click, scroll) extends the session expiry by another 30 minutes.

### **Bounce (直帰)**

- **Definition:** A session is considered a "Bounce" if it satisfies both of the following conditions:
  1. The total `page_views` for the session is exactly 1.
  2. The `engaged` flag on the session is `false`.

### **Engaged (エンゲージメント)**

- **Definition:** A session is marked as `engaged = true` if *any* of the following conditions are met during its lifetime:
  1. The user stays on the page for **10 seconds** or more (handled via the `engagement_ping` event in the SDK).
  2. The user scrolls past **25%** of the maximum page height (handled via the `scroll_depth` event).
  3. The user performs at least **1 important click** (handled via `cta_click` events on elements with `data-track`).

---

## KPI Calculations

- **Bounce Rate (すぐ離脱した割合)**:
  `Total "Bounce" Sessions / Total Sessions`
- **Engagement Rate (よく読まれた割合)**:
  `Total "Engaged" Sessions / Total Sessions`
- **CVR (Conversions Rate / 成果率)**:
  `Total "Conversions" / Total Sessions`
