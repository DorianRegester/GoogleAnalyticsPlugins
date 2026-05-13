<script>
(function () {
    console.log('🌟 SEO Performance Tracking: High-Resolution Accuracy');

    var timing = window.performance.timing;
    var sent = false;
    var inpInteractions = [];
    var accumulatedCls = 0;

    function calculateDuration(start, end) {
        return end > start ? (end - start) / 1000 : 0;
    }

    function nonNegative(value) {
        return value < 0 ? 0.000 : parseFloat(value).toFixed(3);
    }

    // Storage for the raw latest values
    var latestFCP = 0;
    var latestLCP = 0;
    var longTasks = 0;
    var fidValue = 0;

    // 1. Paint Observer (FCP)
    var paintObserver = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (entry.name === 'first-contentful-paint') {
                latestFCP = entry.startTime / 1000;
            }
        });
    });
    paintObserver.observe({ type: 'paint', buffered: true });

    // 2. LCP Observer (Largest Contentful Paint)
    // IMPORTANT: LCP can fire multiple times. We need the MOST RECENT entry.
    var lcpObserver = new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        var lastEntry = entries[entries.length - 1];
        latestLCP = lastEntry.startTime / 1000;
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 3. CLS Observer
    var clsObserver = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (!entry.hadRecentInput) {
                accumulatedCls += entry.value;
            }
        });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // 4. FID Observer
    var fidObserver = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            fidValue = (entry.processingStart - entry.startTime) / 1000;
        });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // 5. INP Observer
    var inpObserver = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (entry.interactionId !== -1 && entry.duration > 0) {
                inpInteractions.push(entry);
            }
        });
    });
    inpObserver.observe({ type: 'event', buffered: true });

    // 6. Long Tasks
    var longTaskObserver = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (entry.duration > 50) {
                longTasks += 1;
            }
        });
    });
    longTaskObserver.observe({ type: 'longtask', buffered: true });

    function sendPerformanceData() {
        if (sent) return;

        // Final INP Calculation
        var finalINP = 0;
        if (inpInteractions.length > 0) {
            var maxEntry = inpInteractions.reduce(function (prev, curr) {
                return curr.duration > prev.duration ? curr : prev;
            }, inpInteractions[0]);
            finalINP = maxEntry.duration / 1000;
        }

        sent = true;
        window.dataLayer = window.dataLayer || [];
        
        window.dataLayer.push({
            event: "performanceMetricsCaptured",
            site_hostname: window.location.hostname,
            // We use parseFloat/toFixed here to ensure the dataLayer sees numbers, not strings
            google_core_vitals_LCP: parseFloat(nonNegative(latestLCP)),
            google_core_vitals_FCP: parseFloat(nonNegative(latestFCP)),
            google_core_vitals_CLS: parseFloat(nonNegative(accumulatedCls)),
            google_core_vitals_INP: parseFloat(nonNegative(finalINP)),
            google_core_vitals_FID: parseFloat(nonNegative(fidValue)),
            google_core_vitals_LongTasks: longTasks,
            ttfb: nonNegative(calculateDuration(timing.requestStart, timing.responseStart))
        });
    }

    // Reliability Listeners
    window.addEventListener('beforeunload', sendPerformanceData);
    window.addEventListener('pagehide', sendPerformanceData);
    window.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            sendPerformanceData();
        }
    });
})();
</script>
