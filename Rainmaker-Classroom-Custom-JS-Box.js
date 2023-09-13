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
  
  var debounce = function(func, wait) {
    var timeoutId = null;
    if (typeof wait === 'undefined') {
      wait = 300;
    }
    return function() {
      var context = this;
      var args = Array.prototype.slice.call(arguments);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function() {
        timeoutId = null;
        func.apply(context, args);
      }, wait);
    }
  };

  // Intervals that are run on initial page load
  var countOuterExpandLesson = 0;
  var expandLessonOnPageLoad = setInterval(function() {
    if (countOuterExpandLesson > maxCount) {
      clearInterval(expandLessonOnPageLoad);
    }
    var readMoreEl = document.getElementById('read-more-post');
    if (readMoreEl) {
      readMoreEl.click();
      clearInterval(expandLessonOnPageLoad);
    }
    countOuterExpandLesson++;
  }, intervalDuration * 1000);
  
  var setupFaqs = debounce(function(faqContainers) {
    faqContainers.forEach(function(container) {
      const faqAnswer = container.querySelector('[data-title="faq-answer"]');
      const faqQuestion = container.querySelector('[data-title="faq-question"]');
      const toggleIcon = container.querySelector('.toggle-faq');
      var handleFaqClick = function() {
        if (faqAnswer.classList.contains('show')) {
          faqAnswer.classList.remove('show');
          toggleIcon.innerHTML = '+';
        } else {
          // Collapse other open FAQs and reset toggle icon to plus symbol
          document.querySelectorAll('[data-title="faq-answer"].show').forEach(function(el) {
            el.classList.remove('show');
            var question = el.previousElementSibling;
            var prevToggleIcon = question.querySelector('.toggle-faq');
            prevToggleIcon.innerHTML = '+';
          });
          // Show FAQ that was clicked on
          faqAnswer.classList.add('show');
          toggleIcon.innerHTML = '&ndash;';
        }
      };
      faqQuestion.removeEventListener('click', handleFaqClick);
      faqQuestion.addEventListener('click', handleFaqClick);
    });
  });

  var countOuterSetupFaq = 0;
  var setupFaqOnPageLoad = setInterval(function() {
    if (countOuterSetupFaq > maxCount) {
      clearInterval(setupFaqOnPageLoad);
    }
    var faqContainers = document.querySelectorAll('[data-title="faq-container"]');
    if (faqContainers.length > 0) {
      setupFaqs(faqContainers);
      clearInterval(setupFaqOnPageLoad);
    }
    countOuterSetupFaq++;
  }, intervalDuration * 1000);

  // Listen for an HREF change, such as a user navigating to a different lesson without refreshing page
  var currentHref = document.location.href;
  var bodyElement = document.querySelector('body');
  var observer = new MutationObserver(function(mutations) {
    if (currentHref !== document.location.href) {
      currentHref = document.location.href;

      // Intervals that are run on HREF change
      var countInnerExpandLesson = 0;
      var expandLessonOnHrefChange = setInterval(function() {
        if (countInnerExpandLesson > maxCount) {
          clearInterval(expandLessonOnHrefChange);
        }
        var readMoreEl = document.getElementById('read-more-post');
        if (readMoreEl) {
          readMoreEl.click();
          clearInterval(expandLessonOnHrefChange);
        }
        countInnerExpandLesson++;
      }, intervalDuration * 1000);

      var countInnerSetupFaq = 0;
      var setupFaqOnHrefChange = setInterval(function() {
        clearInterval(setupFaqOnPageLoad);
        if (countInnerSetupFaq > maxCount) {
          clearInterval(setupFaqOnHrefChange);
        }
        var faqContainers = document.querySelectorAll('[data-title="faq-container"]');
        if (faqContainers.length > 0) {
          setupFaqs(faqContainers);
          clearInterval(setupFaqOnHrefChange);
        }
        countInnerSetupFaq++;
      }, intervalDuration * 1000);
    }
  });

  observer.observe(bodyElement, { childList: true, subtree: true });
})();
