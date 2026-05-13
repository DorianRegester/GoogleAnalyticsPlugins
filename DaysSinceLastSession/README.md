# DaysSinceLastSession (v1.0.0)

**DaysSinceLastSession** is a specialized utility designed to track and bucket user recency—the time elapsed since a user’s previous visit. By leveraging a combination of persistent and session-based storage, this script provides a reliable way to segment users based on their return patterns, which is essential for high-fidelity conversion modeling and retention analysis.

Developed by **Dorian D. Regester**, a digital analytics professional and implementation engineer and owner of **scriptedinsights.com**. This tool is architected for enterprise-level Google Analytics 4 (GA4) and Adobe Analytics environments.

---

## 🚀 Key Features

*   **Hybrid Storage Logic:** Utilizes `localStorage` for long-term persistence of the last visit timestamp and `sessionStorage` to lock the recency bucket for the duration of a single visit.
*   **Session Locking:** Prevents "bucket hopping" within a single session by caching the calculated value at the start of the visit, ensuring data consistency for all hits.
*   **Customizable Bucketing:** Automatically categorizes users into standardized segments (e.g., First Visit, Less than 7 days, More than 30 days).
*   **Privacy-Safe Fallback:** Includes a `try-catch` block to handle environments where storage is restricted (e.g., specific incognito settings or disabled cookies), returning an "Unknown" state rather than breaking execution.
*   **Neutral Footprint:** Uses standardized storage keys that are easily identifiable and won't conflict with existing marketing pixels or site functionality.

---

## 📊 Data Schema & Buckets

The auditor returns a string value representing the user's recency status. This is optimized for use as a **User Property in GA4** or an **eVar in Adobe Analytics**.

| Recency Bucket | Logic (Time Since Last Visit) |
| :--- | :--- |
| **First Visit** | No previous visit timestamp found in `localStorage`. |
| **Less than 1 day** | Previous visit was within the last 24 hours. |
| **Less than 7 days** | Previous visit was more than 1 day but less than 7 days ago. |
| **More than 7 days** | Previous visit was between 7 and 30 days ago. |
| **More than 30 days** | Previous visit was more than 30 days ago. |

---

## ⚙️ Implementation by Tag Manager

### 1. Google Tag Manager (GTM)
*   **Variable Type:** **Custom JavaScript Variable**.
*   **Usage:** Paste the script into the variable editor.
*   **Tagging:** Map this variable to a GA4 "User Property" (e.g., `user_recency`) or an "Event Parameter" within your Configuration/Google Tag.

### 2. Adobe Launch (WebSDK / appMeasurement)
*   **Data Element:** Create a new Data Element using the **Custom Code** type.
*   **Timing:** Set the logic to execute at **Library Loaded (Page Top)** to ensure the bucket is available for the initial page view call.
*   **Mapping:** Map the Data Element to a dedicated eVar or XDM field.

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension.
*   **Scope:** Set to **All Tags** or **Pre-Loader**.
*   **Integration:** Bind the result to a UDO variable like `utag_data['user_recency']` for downstream consumption.

### 4. Ensighten (Manage)
*   **Tag Type:** **Custom Javascript**.
*   **Timing:** Set to **Immediate**.
*   **Data Layer:** Use `EnsTag_Data.set('user_recency', bucketValue);` to make the status available for real-time personalization or suppression logic.

### 5. Signal
*   **Tag Type:** **Custom HTML/JS**.
*   **Trigger:** **Page Load**.
*   **Usage:** Use the recency status to conditionally fire "Win-Back" campaign pixels only for users categorized in the `More than 30 days` bucket.

---

## 🛠 Technical Details

*   **Logic Flow:**
    1. Check for existing session marker. If present, return cached bucket.
    2. If no session marker, calculate the delta between `Date.now()` and the `localStorage` timestamp.
    3. Update `localStorage` with the current time for the *next* visit.
    4. Set the session marker and bucket cache for the current visit.
*   **Storage Requirements:** Requires `localStorage` and `sessionStorage` support.
*   **Performance:** Negligible CPU impact; performs a single calculation once per visit.
*   **Zero Dependencies:** Pure Vanilla JavaScript.

---

## 📄 License
MIT License - Developed by **Dorian D. Regester** (**scriptedinsights.com**).
