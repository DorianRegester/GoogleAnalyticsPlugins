<script>
function() {
  // Neutral keys for a GA4/GTM environment
  var STORAGE_KEY = 'ga_last_visit_ts';
  var SESSION_MARKER = 'ga_recency_session';
  var BUCKET_CACHE = 'ga_current_recency';
  
  var now = Date.now();
  var dayMs = 24 * 60 * 60 * 1000;
  
  try {
    // 1. Retrieve the last recorded timestamp and session status
    var lastTs = localStorage.getItem(STORAGE_KEY);
    var sessionActive = sessionStorage.getItem(SESSION_MARKER);

    // 2. First Visit Logic
    if (!lastTs) {
      localStorage.setItem(STORAGE_KEY, now);
      sessionStorage.setItem(SESSION_MARKER, 'true');
      sessionStorage.setItem(BUCKET_CACHE, "First Visit");
      return "First Visit";
    }

    // 3. Session Lock: Return the value calculated at the start of this session
    if (sessionActive) {
      return sessionStorage.getItem(BUCKET_CACHE) || "Less than 1 day";
    }

    // 4. Calculate Recency Bucket
    var diff = now - parseInt(lastTs, 10);
    var bucket = "";

    if (diff > 30 * dayMs) {
      bucket = "More than 30 days";
    } else if (diff > 7 * dayMs) {
      bucket = "More than 7 days";
    } else if (diff > dayMs) {
      bucket = "Less than 7 days";
    } else {
      bucket = "Less than 1 day";
    }

    // 5. State Update (Once per visit)
    localStorage.setItem(STORAGE_KEY, now);
    sessionStorage.setItem(SESSION_MARKER, 'true');
    sessionStorage.setItem(BUCKET_CACHE, bucket);

    return bucket;
    
  } catch (e) {
    // Fallback for private browsing/disabled storage
    return "Unknown";
  }
}
</script>
