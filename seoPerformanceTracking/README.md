# seoPerformanceTracking (v1.0.0)

**seoPerformanceTracking** is a high-resolution performance monitoring utility designed to capture Google’s Core Web Vitals (CWV) and other critical SEO metrics in real-time. By utilizing the `PerformanceObserver` API, this script provides field data (RUM) that mirrors how Google evaluates page experience, allowing analytics teams to correlate site speed with SEO rankings and conversion performance.

Developed by **Dorian D. Regester**, a digital analytics professional and implementation engineer and owner of **scriptedinsights.com**. This tool is architected for enterprise-level deployments within **GA4** and **Adobe Analytics** environments.

---

## 🚀 Key Features

*   **Comprehensive CWV Tracking:** Captures Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).
*   **Modern Interaction Monitoring:** Includes **Interaction to Next Paint (INP)** tracking, the modern standard for measuring UI responsiveness.
*   **Main-Thread Audit:** Tracks **Long Tasks** (tasks exceeding 50ms) to identify JavaScript execution bottlenecks that impact user experience.
*   **High-Resolution Accuracy:** Implements logic to capture the *most recent* LCP entry and the *maximum* INP duration for precise reporting.
*   **Reliable Data Dispatch:** Uses a combination of `visibilitychange`, `pagehide`, and `beforeunload` listeners to ensure performance data is captured even if a user abruptly exits the page.

---

## 📊 Data Layer Schema

The auditor pushes a `performanceMetricsCaptured` event to the `window.dataLayer`. This data is formatted as floats to ensure compatibility with numerical processing in GA4 and Adobe Analytics.

| Parameter | Type | Metric Description |
| :--- | :--- | :--- |
| `google_core_vitals_LCP` | Float | **Largest Contentful Paint:** Time in seconds for the largest content element to render. |
| `google_core_vitals_FCP` | Float | **First Contentful Paint:** Time until the first bit of content is rendered. |
| `google_core_vitals_CLS` | Float | **Cumulative Layout Shift:** Total score of all unexpected layout shifts. |
| `google_core_vitals_INP` | Float | **Interaction to Next Paint:** The longest interaction latency recorded. |
| `google_core_vitals_FID` | Float | **First Input Delay:** Delay between first interaction and browser response. |
| `google_core_vitals_LongTasks`| Integer | Total count of browser tasks exceeding 50ms. |
| `ttfb` | Float | **Time to First Byte:** Duration between request start and response start. |

---

## ⚙️ Implementation by Tag Manager

### 1. Google Tag Manager (GTM)
*   **Trigger:** Create a **Custom Event** trigger named `performanceMetricsCaptured`.
*   **Variables:** Create **Data Layer Variables** for each metric (e.g., `google_core_vitals_LCP`).
*   **Tag:** Map these variables to a **GA4 Event Tag** as Event Parameters to visualize performance in your "Page Speed" reports.

### 2. Adobe Launch (WebSDK / appMeasurement)
*   **Rule:** Create a rule triggered by the `performanceMetricsCaptured` event in the data layer.
*   **XDM Mapping:** Map these high-resolution metrics to your XDM schema for **Adobe Experience Platform (AEP)** to correlate site speed with specific user segments.

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension.
*   **Integration:** Use the script to populate the `utag_data` object. Ensure the extension is scoped to fire before your analytics tags.
    ```javascript
    window.addEventListener('performanceMetricsCaptured', function(e) {
        utag.link(window.dataLayer[window.dataLayer.length -1]);
    });

### 4. Ensighten (Manage)
* **Tag Type**: **Custom Javascript**.
* **Timing**: Set to **Immediate**.
* **Logic**: Utilize the internal `sendPerformanceData` function to push metrics into the `EnsTag_Data` layer, allowing for real-time performance-based tag suppression.
    ```javascript
    window.addEventListener('performanceMetricsCaptured', function(e) {
        EnsTag_Data.set('performance_metrics', e.detail);
    });

 ### 5. Signal
* **Tag Type**: Custom HTML/JS.
* **Trigger**: Page Load.
* **Usage**: Use the **LongTasks** and **INP** data to audit the performance impact of third-party marketing pixels in your Signal container.

---

## 🛠 Technical Details

* **API Usage**: Utilizes the `PerformanceObserver` API with `buffered: true` to capture events that occurred before the script was initialized.
* **In-Session Updates**: Specifically handles the "multiple-fire" nature of **LCP** and the "accumulated" nature of **CLS** to provide final, accurate session values.
* **Zero Dependencies**: Pure Vanilla JavaScript with a negligible memory footprint.
* **Beacon Reliability**: Optimized for the modern web lifecycle, prioritizing `visibilitychange` for the most reliable data capture across mobile and desktop browsers.

---

## 📄 License
MIT License — Developed by **Dorian D. Regester** ([scriptedinsights.com](https://scriptedinsights.com)).       
