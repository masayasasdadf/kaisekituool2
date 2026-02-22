# Attribution & Channel Grouping

This document outlines the rules for classifying traffic sources into predefined `channel_group` categories, and the attribution model used by the Measurement OS.

## 帰属モデル (Attribution Model)

**MVP Mode: Last non-direct click**

- Converts are attributed to the most recent known source of traffic prior to the conversion.
- If the most recent source is a "Direct" visit (no referrer, no UTM parameters), the system will look back to the last known non-direct source for that user, if available. For this MVP, we capture the attribution data strictly at the start of each session.

## チャネル分類 (Channel Grouping)

When a `session_start` event is received, the Ingestion API classifies the traffic into one of the following Channel Groups based on UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.) and the HTTP `referrer`.

| Channel Group | 条件 (Condition) |
| :--- | :--- |
| **Paid Search** | `utm_medium` matches `cpc`, `ppc`, or `paidsearch` AND source is a known search engine (e.g., Google, Bing, Yahoo). Matches `gclid`, `wbraid`, or `gbraid`. |
| **Paid Social** | `utm_medium` matches `cpc`, `ppc`, or `paidsocial` AND source is a known social network (e.g., Facebook, Instagram, Twitter/X). Matches `fbclid`. |
| **Organic Search** | No paid `utm_medium`. Referrer matches a known search engine (Google, Bing, Yahoo). |
| **Organic Social** | No paid `utm_medium`. Referrer matches a known social network. |
| **Email** | `utm_medium` matches `email`. |
| **Affiliate** | `utm_medium` matches `affiliate`. |
| **Referral** | Referrer is a known external website (not a search engine or social network). |
| **Direct** | No referrer AND no UTM parameters. (e.g., Bookmarks, direct URL typing). |
| **Other** | Traffic that does not fit any of the above categories. |

> **Note to Developers:**
> The exact regex patterns for classification are maintained in `src/lib/attribution.ts`.
