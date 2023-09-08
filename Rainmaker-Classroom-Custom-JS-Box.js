/*Code for RainmakerAI membership product Custom JS Box
*******************************************
*/

/*
 * Script checks every 1.5 seconds whether lesson text is truncated with 'Read more' button to expand,
 * and generates a click on the 'Read more' button if detected, so user sees full text almost immediately.
 * Interval is not cleared immediately because navigating between lessons does not result in full document reload.
*/
(function() {
  // `intervalDuration` and `maxLife` are configured in seconds
  var intervalDuration = 1.5;
  var maxLife = 7200; // cancel interval after 2 hours
  var maxCount = maxLife / intervalDuration;
  var count = 0;

  var expandLesson = setInterval(function() {
    if (count > maxCount) {
      clearInterval(expandLesson);
    }
    var readMoreEl = document.getElementById('read-more-post');
    if (readMoreEl) {
      readMoreEl.click();
    }
    count++;
  }, intervalDuration * 1000);
})();