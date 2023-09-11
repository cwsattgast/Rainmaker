/*
 * On initial page load, and on every lesson navigation (which results in URL change, but no full page refresh):
 * Script checks every 0.5 seconds whether lesson text is truncated with 'Read more' button to expand,
 * and generates a click on the 'Read more' button if detected, so user sees full text almost immediately.
 * Each new interval is cleared after click is generated on 'Read more' button, or 5 seconds, whichever is sooner.
 *
 * MutationObserver implementation for detecting URL change based on:
 * https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
*/
(function() {
  // `intervalDuration` and `maxLife` are configured in seconds
  var intervalDuration = 0.5;
  var maxLife = 5; // cancel interval after 5 seconds
  var maxCount = maxLife / intervalDuration;

  // Interval that is run on initial page load
  var countOuter = 0;
  var expandLessonOnPageLoad = setInterval(function() {
    if (countOuter > maxCount) {
      clearInterval(expandLessonOnPageLoad);
    }
    var readMoreEl = document.getElementById('read-more-post');
    if (readMoreEl) {
      readMoreEl.click();
      clearInterval(expandLessonOnPageLoad);
    }
    countOuter++;
  }, intervalDuration * 1000);

  // Listen for an HREF change, such as a user navigating to a different lesson without refreshing page
  var currentHref = document.location.href;
  var bodyElement = document.querySelector('body');
  var observer = new MutationObserver(function(mutations) {
    if (currentHref !== document.location.href) {
      currentHref = document.location.href;

      // Interval that is run on HREF change
      var countInner = 0;
      var expandLessonOnHrefChange = setInterval(function() {
        if (countInner > maxCount) {
          clearInterval(expandLessonOnHrefChange);
        }
        var readMoreEl = document.getElementById('read-more-post');
        if (readMoreEl) {
          readMoreEl.click();
          clearInterval(expandLessonOnHrefChange);
        }
        countInner++;
      }, intervalDuration * 1000);
    }
  });

  observer.observe(bodyElement, { childList: true, subtree: true });
})();
