# getCookieAudit (v1.0.0)

**getCookieAudit** is an SME-grade JavaScript utility designed to perform a real-time audit of browser-accessible cookies. It monitors the volume and weight of the cookie header, providing critical technical context for performance auditing and consent compliance. By quantifying the total byte-size of cookies, analytics teams can identify potential "Header Overflow" issues that lead to server-side request failures.

Developed by **Dorian D. Regester**, a digital analytics professional and implementation engineer and owner of **scriptedinsights.com**. This tool is architected for enterprise-grade data collection environments, specifically optimized for **Adobe Analytics** and **OneTrust** integration.

---

## 🚀 Key Features

*   **Consent Alignment:** Built-in logic to cross-reference consent states from **OneTrust** (`OptanonConsent`) or **Adobe Opt-In** services.
*   **Architectural Impact Auditing:** Calculates the total byte-weight of the `document.cookie` string to monitor the impact on HTTP header overhead.
*   **Adobe-Specific Identification:** Identifies and counts specific first-party cookie prefixes, such as `s_` and `amcv_`, to assist in domain-level governance.
*   **Performance Monitoring:** Calculates average cookie size to identify bloated cookies that may impact page performance.
*   **Error Resiliency:** Implements localized `try-catch` blocks with logging via `_satellite.logger` to ensure script failure never disrupts the user experience.

---

## 📊 Data Schema (Piped String)

The plugin returns a single, piped string designed for ingestion into an **Adobe Analytics eVar** or **GA4 Custom Dimension**.

**Example Output:** `total:12|avg_bytes:45|total_bytes:540|consent:Consent Given`

| Metric | Type | Description |
| :--- | :--- | :--- |
| **total** | Integer | The total count of accessible first-party cookies. |
| **avg_bytes** | Integer | The average size (in bytes) per cookie. |
| **total_bytes** | Integer | The total weight of the cookie header string. |
| **consent** | String | Returns `Consent Given` or `No Consent` based on CMP status. |

---

## ⚙️ Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
*   **Rule:** Trigger at **Library Loaded (Page Top)**.
*   **Data Element:** Create a Custom Code Data Element that returns the `getCookieAudit` function.
*   **Mapping:** Map the Data Element to a dedicated eVar for reporting on cookie bloat and consent status.

### 2. Adobe Launch (WebSDK / Alloy.js)
*   **Setup:** Use the script within a **Library Loaded** rule.
*   **XDM Mapping:** Map the resulting piped string to your XDM schema under your custom dimensions or eVars. 
*   **Audit Logic:** Use the `total_bytes` value to identify if header sizes are nearing the typical browser limit ($8\text{KB} - 16\text{KB}$).

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension scoped to **All Tags**.
*   **Integration:** 
    ```javascript
    utag_data['cookie_audit_string'] = (function(){ /* Source Code Here */ })();

### 4. Ensighten (Manage)
*   **Tag Type:** **Custom Javascript**.
*   **Timing:** Set to **Immediate**.
*   **Logic:** Push the audit results into the `EnsTag_Data` layer to facilitate real-time tag suppression if consent is absent.

### 5. Signal
*   **Tag Type:** **Custom HTML/JS tag**.
*   **Trigger:** Set to **Page Load**.
*   **Usage:** Monitor the `total_bytes` to audit the performance impact of third-party pixels that contribute to first-party cookie bloat.

---

## 🛠 Technical Details

*   **Cookie Weight Calculation:** Uses `document.cookie.length` to calculate the literal byte-count of the header string.
*   **SME Prefix Logic:** Specifically audits for **Adobe Analytics** (`s_`) and **Experience Cloud ID** (`amcv_`) prefixes to ensure core tracking persistence.
*   **Zero Dependencies:** Pure Vanilla JavaScript requiring no external libraries.
*   **Performance:** Uses a single pass through the cookie string array, ensuring negligible CPU usage.

---

## 📄 License
MIT License - Developed by **Dorian D. Regester** ([scriptedinsights.com](https://scriptedinsights.com)).    
