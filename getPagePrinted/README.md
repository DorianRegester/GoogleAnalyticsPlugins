# pagePrintAuditor (v1.0.0)

**pagePrintAuditor** is a specialized engagement tracking utility designed to capture user intent to print web content. Since print actions often happen outside the scope of standard session tracking, this plugin bridges the gap by monitoring native browser dialogs, keyboard shortcuts, and on-page UI elements. Capturing print intent provides high-fidelity data on content value, especially for receipts, documentation, and long-form articles.

Developed by **Dorian D. Regester**, a digital analytics professional and implementation engineer based in **Saint Cloud, Florida** and owner of **scriptedinsights.com**. This tool is optimized for **GA4** environments via **Google Tag Manager (GTM)** but is architected to be platform-agnostic.

---

## 🚀 Key Features

*   **Multi-Modal Detection:**
    1.  **Native OS Listener:** Uses the `beforeprint` event to detect print requests from the browser menu.
    2.  **Keyboard Shortcut Auditor:** Monitors for `Ctrl+P` and `Cmd+P` to capture power-user interactions.
    3.  **Click Delegation:** Automatically tracks clicks on common print button classes (`.print-button`, `.btn-print`, etc.).
*   **Duplicate Prevention:** Implements a global state-check (`_pagePrinted`) to ensure only one print event is fired per page load, preventing skewed engagement metrics.
*   **Contextual Labeling:** Dynamically identifies the `print_method` (e.g., `keydown`, `beforeprint`, or `manual`) to provide deeper insight into user behavior.

---

## 📊 Data Layer Schema

The auditor pushes a clean, structured object to the `window.dataLayer` for GA4 or GTM consumption:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `event` | String | Set to `page_print`. |
| `event_category` | String | Categorized as `engagement`. |
| `print_method` | String | The method used: `beforeprint`, `keydown`, or `manual`. |

---

## ⚙️ Implementation by Tag Manager

### 1. Google Tag Manager (GTM)
*   **Trigger:** Create a **Custom Event** trigger where the Event Name is `page_print`.
*   **Variables:** Create a **Data Layer Variable** for `print_method`.
*   **Tag:** Map the variable to a **GA4 Event Tag** to track print actions as a custom conversion or engagement event.

### 2. Adobe Launch (Legacy & WebSDK)
*   **Data Element:** Create a Data Element that monitors the `dataLayer` for the `page_print` event.
*   **Mapping:** Map the `print_method` to an eVar or XDM field to analyze print behavior alongside other Adobe Analytics metrics.

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension scoped to **All Tags**.
*   **Integration:** Use `utag.link` to broadcast the print event to all configured vendor tags.

### 4. Ensighten (Manage)
*   **Tag Type:** **Custom Javascript**.
*   **Timing:** Set to **Immediate**.
*   **Logic:** Push the audit results into the `EnsTag_Data` layer to facilitate real-time tag orchestration or suppression logic.

### 5. Signal
*   **Tag Type:** **Custom HTML/JS**.
*   **Trigger:** **Page Load**.
*   **Usage:** Use the print intent data to audit high-value user segments and optimize the performance of third-party marketing pixels within your Signal container.

---

## 🛠 Technical Details

*   **API Usage:** Utilizes native `beforeprint` and `keydown` event listeners to ensure high-accuracy capture across all modern evergreen browsers.
*   **Session Management:** Uses a global window flag to ensure the listener only initializes once per page load, maintaining a "zero-leak" implementation.
*   **Zero Dependencies:** Pure Vanilla JavaScript requiring no external libraries, ensuring no impact on site performance or PageSpeed scores.
*   **Compatibility:** Optimized for all modern environments, including specific click-delegation support for common CMS/WordPress print button patterns.

---

## 📄 License
MIT License - Developed by **Dorian D. Regester** ([scriptedinsights.com](https://scriptedinsights.com)).
