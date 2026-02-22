(function () {
    const KAISEKI_ENDPOINT = "/api/track";
    const scriptTag = document.currentScript || document.querySelector('script[src*="sdk.js"]');
    const PROJECT_KEY = scriptTag ? scriptTag.getAttribute('data-project') : null;

    if (!PROJECT_KEY) {
        console.warn("Kaiseki: PROJECT_KEY not found on script tag.");
        return;
    }

    // --- Identity ---
    function generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, maxAgeSeconds) {
        document.cookie = `${name}=${value};max-age=${maxAgeSeconds};path=/;samesite=Lax`;
    }

    let visitorId = getCookie('k_vid');
    if (!visitorId) {
        visitorId = generateId();
        setCookie('k_vid', visitorId, 60 * 60 * 24 * 365 * 2); // 2 years
    }

    let sessionId = getCookie('k_sid');
    let isNewSession = false;
    if (!sessionId) {
        sessionId = generateId();
        isNewSession = true;
    }
    // Refresh session expiry (30 mins)
    setCookie('k_sid', sessionId, 60 * 30);

    // --- Helper: Get UTMs & Acquisition ---
    function getAcquisitionData() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            campaign: urlParams.get('utm_campaign') || null,
            source: urlParams.get('utm_source') || null,
            medium: urlParams.get('utm_medium') || null,
            referrer: document.referrer || null,
            landingPage: window.location.href
        };
    }

    // --- Event Queue & Sending ---
    const queue = JSON.parse(localStorage.getItem('k_queue') || '[]');

    function saveQueue() {
        localStorage.setItem('k_queue', JSON.stringify(queue));
    }

    function sendPayload(eventArr) {
        if (!eventArr.length) return;
        const payload = {
            projectKey: PROJECT_KEY,
            visitorId,
            sessionId,
            events: eventArr,
            url: window.location.href,
            title: document.title,
            timestamp: Date.now() // to prevent replay attacks window if we add sig
        };

        const payloadStr = JSON.stringify(payload);

        // We try sendBeacon first for unloads, fetch otherwise
        if (typeof navigator.sendBeacon === "function" && document.visibilityState === 'hidden') {
            navigator.sendBeacon(KAISEKI_ENDPOINT, payloadStr);
        } else {
            fetch(KAISEKI_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payloadStr,
                keepalive: true
            }).catch((e) => {
                // Retry logic: add back to queue
                queue.push(...eventArr);
                saveQueue();
            });
        }
    }

    function trackEvent(eventName, properties = {}) {
        setCookie('k_sid', sessionId, 60 * 30); // Extend session
        const event = { name: eventName, properties, timestamp: Date.now() };
        queue.push(event);
        saveQueue();
        // Flush immediately for this MVP
        flushQueue();
    }

    function flushQueue() {
        if (queue.length === 0) return;
        const eventsToSend = [...queue];
        queue.length = 0;
        saveQueue();
        sendPayload(eventsToSend);
    }

    // --- Initial Tracking ---
    if (isNewSession) {
        trackEvent("session_start", getAcquisitionData());
    }

    let currentUrl = window.location.href;
    trackEvent("page_view", { url: currentUrl });

    // --- SPA Support ---
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        onUrlChange();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        onUrlChange();
    };
    window.addEventListener('popstate', onUrlChange);

    function onUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            trackEvent("page_view", { url: currentUrl });
        }
    }

    // --- Scroll Tracking ---
    let maxScroll = 0;
    function handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const scrollDepth = Math.round((window.scrollY / scrollHeight) * 100);
            if (scrollDepth > maxScroll) {
                maxScroll = scrollDepth;
            }
        }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- Engagement Ping ---
    setTimeout(() => {
        trackEvent("engagement_ping", { duration: 10 });
    }, 10000); // 10 seconds

    // --- CTA & Click Tracking ---
    document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-track]");
        if (el) {
            const trackName = el.getAttribute("data-track") || "generic_click";
            trackEvent("cta_click", { selector: trackName, text: el.innerText || el.value });
        }
    });

    // --- Final Flush ---
    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            trackEvent("scroll_depth", { max: maxScroll });
            flushQueue();
        }
    });

    // Flush any left-over events from last session error
    flushQueue();

    // Expose to window for custom events/conversions
    window.kaiseki = { track: trackEvent };

})();
