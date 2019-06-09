/**
 * Thanks to the abominable trend of CSS in JS for making selectors much more difficult
 * than they need to be. This works by matching attribute selectors on SVG paths, then
 * traversing the DOM that way. It's flaky, but it works for now.
 */

function checkAds() {
  // The "promoted icon"
  var adSelector201906 =
    '[d="M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.393-.875-.876V9.967l-7.547 7.546c-.17.17-.395.256-.62.256s-.447-.086-.618-.257c-.342-.342-.342-.896 0-1.237l7.547-7.547h-3.54c-.482 0-.874-.393-.874-.876s.392-.875.875-.875h5.65c.483 0 .875.39.875.874v5.65z"]';

  // The dropdown chevron
  var dropdownSelector =
    'path[d="M20.207 8.147c-.39-.39-1.023-.39-1.414 0L12 14.94 5.207 8.147c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414l7.5 7.5c.195.196.45.294.707.294s.512-.098.707-.293l7.5-7.5c.39-.39.39-1.022 0-1.413z"]';

  const isHomeTimeline = document.title.includes('Home / Twitter');

  if (!isHomeTimeline) {
    return;
  }

  var ads = Array.from(document.querySelectorAll(adSelector201906)).map(path => {
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
      document.querySelectorAll("[role=menuitem]")
    ).find(btn => btn.textContent.match(/^Block @/));
    if (!blockButton) return console.log("couldn't find block button");
    console.log(blockButton.textContent);
    blockButton.click();
    setTimeout(function() {
      const yesButton = Array.from(
        document.querySelectorAll("[role=button]")
      ).find(btn => btn.textContent === "Block");
      if (!yesButton) return console.log("couldn't find yes button");
      yesButton.click();
      console.log("All done!");
    }, timeout);
  }, timeout);
}


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

// Create an observer instance to check for & block ads
var observer = new MutationObserver(debounce(checkAds, debounceRate));

// Observe for any changes under the body.
observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
});
