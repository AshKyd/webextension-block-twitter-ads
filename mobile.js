/**
 * Thanks to the abominable trend of CSS in JS for making selectors much more difficult
 * than they need to be. This works by matching attribute selectors on SVG paths, then
 * traversing the DOM that way. It's flaky, but it works for now.
 */

// The "promoted icon"
const adSelector =
  'path[d="M20.75 2H3.25A2.25 2.25 0 0 0 1 4.25v15.5A2.25 2.25 0 0 0 3.25 22h17.5A2.25 2.25 0 0 0 23 19.75V4.25A2.25 2.25 0 0 0 20.75 2zM17.5 13.504a.875.875 0 1 1-1.75-.001V9.967l-7.547 7.546a.875.875 0 0 1-1.238-1.238l7.547-7.547h-3.54a.876.876 0 0 1 .001-1.751h5.65c.483 0 .875.39.875.874v5.65z"]';

// The dropdown chevron
const dropdownSelector =
  'path[d="M20.207 7.043a1 1 0 0 0-1.414 0L12 13.836 5.207 7.043a1 1 0 0 0-1.414 1.414l7.5 7.5a.996.996 0 0 0 1.414 0l7.5-7.5a1 1 0 0 0 0-1.414z"]';

const debounceRate = 150;

// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function checkAds() {
  const isHomeTimeline = document
    .querySelector("header")
    .textContent.match(/^Home/);

  if (!isHomeTimeline) {
    return;
  }

  var ads = Array.from(document.querySelectorAll(adSelector)).map(path => {
    try {
      return path.parentNode.parentNode.parentNode.parentNode.querySelector(
        dropdownSelector
      ).parentNode.parentNode.parentNode;
    } catch (e) {
      console.log("couldnt", path);
      return null;
    }
  });

  if (!ads.length) {
    console.log("No ads found");
    return;
  } else {
    console.log(`Found ${ads.length} ads. Clicking the first one.`);
  }

  ads[0].click();
  const timeout = 100;
  setTimeout(function() {
    const blockButton = Array.from(
      document.querySelectorAll("[role=button]")
    ).find(btn => btn.textContent.match(/^Block @/));
    if (!blockButton) return console.log("couldn't find block button");
    blockButton.click();
    setTimeout(function() {
      const yesButton = Array.from(
        document.querySelectorAll("[role=button]")
      ).find(btn => btn.textContent === "Yes");
      if (!yesButton) return console.log("couldn't find yes button");
      yesButton.click();
      console.log("All done!");
    }, timeout);
  }, timeout);
}

// Create an observer instance to check for & block ads
var observer = new MutationObserver(debounce(checkAds, debounceRate));

// Observe for any changes under the body.
observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
});
