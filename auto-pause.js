// script to auto-pause when netflix loses focus
//
// play/pause state is inferred through the existence
// of the button-nfplayerPlay/Pause elements
//
// only resumes when the script itself was the source
// of the pause

function hasElem(className) {
    return new Promise(resolve => {
        let elems = document.getElementsByClassName(className);
        if (elems.length === 1) {
            resolve(elems[0]);
        }
    });
}

function sendSpace(elem) {
    let e = new KeyboardEvent('keydown', { bubbles: true, keyCode: 32 });
    elem.dispatchEvent(e);
}

var scriptPaused = false;
function tryPause() {
    hasElem("button-nfplayerPause")
        .then(sendSpace)
        .then(() => scriptPaused = true);
}

function tryResume() {
    hasElem("button-nfplayerPlay")
        .then(sendSpace)
        .then(() => scriptPaused = false);
}

var blurs = 0;
var focuses = 0;
// to prevent sporadic pauses on alt-tab
// timeout value found through trial and error
function noImmediateBlur(init) {
    return new Promise(resolve => {
        setTimeout(() => blurs === init && resolve(), 300);
    });
}

function noImmediateFocus(init) {
    return new Promise(resolve => {
        setTimeout(() => focuses === init && resolve(), 300);
    });
}

function handleBlur() {
    blurs += 1;
    noImmediateFocus(focuses).then(tryPause);
}

function handleFocus() {
    focuses += 1;
    scriptPaused && noImmediateBlur(blurs).then(tryResume);
}

window.addEventListener("blur", handleBlur);
window.addEventListener("focus", handleFocus);
