<script>
(function() {
  // 1. Prevent duplicate listeners
  if (window._ga4PrintListenerStarted) return;
  window._ga4PrintListenerStarted = true;
  window._pagePrinted = false;

  var trackPrint = function() {
    if (!window._pagePrinted) {
      window._pagePrinted = true;
      
      // Push to Data Layer for GTM to pick up
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'page_print',
        'event_category': 'engagement',
        'print_method': event ? event.type : 'manual'
      });
    }
  };

  // A. Native OS Print Dialog Listener
  window.addEventListener('beforeprint', trackPrint);

  // B. Keyboard Shortcut Listener (Ctrl+P / Cmd+P)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      trackPrint();
    }
  });

  // C. Print Button Listener (Event Delegation)
  document.addEventListener('click', function(e) {
    var printButton = e.target.closest('.print-button, [data-action="print"], .btn-print');
    if (printButton) {
      trackPrint();
    }
  });
})();
</script>
