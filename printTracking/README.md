# PrintPageAuditor (v1.0.0)

**PrintPageAuditor** is a robust JavaScript utility designed to capture user intent to print a web page. While most analytics platforms struggle to track print actions natively, this plugin uses a triple-layered detection strategy to monitor browser dialogs, keyboard shortcuts, and on-page UI elements. By capturing this "High-Intent" behavior, analytics teams can better understand content value and offline usage patterns.

Developed by **Dorian D. Regester**, a digital analytics professional and implementation engineer based in **Saint Cloud, Florida** and owner of **scriptedinsights.com**. This tool is optimized for **GA4** implementations via **Google Tag Manager (GTM)** or **Adobe Launch**.

---

## 🚀 Key Features

*   **Triple-Detection Logic:**
    1.  **Native Browser Listener:** Utilizes the `beforeprint` event to capture print requests initiated via the browser file menu.
    2.  **Keyboard Shortcut Monitoring:** Listens for `Ctrl+P` (Windows/Linux) and `Cmd+P` (macOS) to identify power-user behavior.
    3.  **Click Delegation:** Employs "SME-style" delegation to automatically detect clicks on on-page print buttons or links (compatible with common WordPress classes like `.entry-print`).
*   **Proactive GA4 Integration:** Automatically pushes a clean, structured `print_page` event to the `dataLayer`.
*   **Duplicate Prevention:** Includes internal state-checking logic to prevent a single print action from firing multiple duplicate hits within the same session.

---

## 📊 Data Layer Schema

The auditor pushes a specialized object to the `window.dataLayer` for GA4 consumption:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `event` | String | Set to `print_page`. |
| `print_method` | String | The method used: `Browser Dialog`, `Keyboard Shortcut`, or `Button`. |
| `print_ui_element` | String | Differentiates between `System/Browser` UI and an `On-page Button`. |
| `print_status` | String | Set to `success` upon intent capture. |

---

## ⚙️ Implementation by Tag Manager

### 1. Google Tag Manager (GTM)
*   **Trigger:** Create a **Custom Event** trigger where the Event Name is `print_page`.
*   **Variables:** Create **Data Layer Variables** for `print_method` and `print_ui_element`.
*   **Tag:** Create a **GA4 Event Tag** using the new trigger and map the variables as event parameters.

### 2. Adobe Launch (WebSDK or appMeasurement)
*   **Rule:** Create a rule triggered by **Custom Code** or **Library Loaded**.
*   **Data Element:** Create a Data Element to "watch" the `dataLayer` or use a Custom Event listener to catch the `print_page` broadcast.
*   **Mapping:** Map the event attributes to your desired eVars or XDM schema fields.

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension scoped to **All Tags**.
*   **Mapping:** Use `utag.link` to transform the `dataLayer` push into a Tealium event call.

### 4. Ensighten (Manage)
*   **Tag Type:** **Custom Javascript**.
*   **Timing:** Set to **Immediate**.
*   **Logic:** Reference the script to populate the `EnsTag_Data` layer for real-time orchestration.

### 5. Signal
*   **Tag Type:** **Custom HTML/JS**.
*   **Trigger:** Set to **Page Load**.
*   **Usage:** Use the capture event to trigger secondary pixels for "High-Value" user segments who frequently print documentation or receipts.

---

## 🛠 Technical Details

*   **Browser Support:** Optimized for all modern evergreen browsers (Chrome, Edge, Firefox, Safari).
*   **Lightweight Footprint:** The script is self-contained and uses native event listeners, ensuring zero impact on PageSpeed scores.
*   **WordPress/CMS Ready:** Built-in support for standard print button selectors (e.g., `.print-button`, `.entry-print`, `[data-action="print"]`).
*   **Session Management:** Uses a global window flag to ensure the listener only initializes once per page load.

---

## 📄 License
MIT License - Developed by **Dorian D. Regester** ([scriptedinsights.com](https://scriptedinsights.com)).
