<script>
(function() {
  // 1. Prevent duplicate listeners
  if (window._printListenerStarted) return;
  window._printListenerStarted = true;
  window._pagePrinted = false;

  var trackPrintIntent = function(method) {
    if (!window._pagePrinted) {
      window._pagePrinted = true;
      
      // 2. Proactive DataLayer Push for GA4
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'print_page', // Clean, custom event name
        'print_method': method,
        'print_ui_element': method === 'Button' ? 'On-page Button' : 'System/Browser',
        'print_status': 'success'
      });
      
      console.log('🖨️ Print intent captured: ' + method);
    }
  };

  // A. Native OS/Browser Print Listener
  window.addEventListener('beforeprint', function() {
    trackPrintIntent('Browser Dialog');
  });

  // B. Keyboard Shortcut (Ctrl+P / Cmd+P)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      trackPrintIntent('Keyboard Shortcut');
    }
  });

  // C. Click Delegation (SME style for WordPress compatibility)
  document.addEventListener('click', function(e) {
    var printTrigger = e.target.closest('.print-button, [data-action="print"], .entry-print, .print-link');
    if (printTrigger) {
      trackPrintIntent('Button');
    }
  });
})();
</script>
