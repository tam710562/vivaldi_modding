/*
Tab Scroll
https://forum.vivaldi.net/topic/27856/tab-scroll
Clicking on an active tab scrolls page to top, clicking it again returns to previous scroll position. Credits to tam710562 from Vivaldi Forum for coming up with the sessionStorage solution, which made this possible. More info in the linked thread.
*/

function tabScrollExit() {
    tsTarget.removeEventListener('mousemove', tabScrollExit);
    tsTarget.removeEventListener('click', tabScrollTrigger);
};

function tabScrollTrigger() {
    chrome.tabs.executeScript({
        code: 'var offset=window.pageYOffset;if(offset>0){window.sessionStorage.setItem("tabOffset",offset);window.scrollTo(0,0);}else{window.scrollTo(0,window.sessionStorage.getItem("tabOffset")||0);}'
    });
    tabScrollExit();
};

function tabScroll(event) {
    if (event.which == 1 && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
        tsTarget = event.target;
        if (tsTarget.parentNode.classList.contains('tab-header')) {
            tsTarget = tsTarget.parentNode;
        }
        if (tsTarget.classList.contains('tab-header') && tsTarget.parentNode.classList.contains('active')) {
            tsTarget.addEventListener('mousemove', tabScrollExit);
            tsTarget.addEventListener('click', tabScrollTrigger);
        }
    }
};

// Loop waiting for the browser to load the UI. You can call all functions from just one instance.

setTimeout(function wait() {
    const browser = document.getElementById('browser');
    if (browser) {
        document.body.addEventListener('mousedown', tabScroll);
    }
    else {
        setTimeout(wait, 300);
    }
}, 300);
