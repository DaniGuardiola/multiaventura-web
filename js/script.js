var md = new Paperkit();
var sliderPage = false;
window.addEventListener('load', function() {
    md.init();
    sliderAuto();
    md.sidemenu.querySelector("md-list:first-child").click();
    window.firstTabbar = md.toolbar.querySelector("md-row.first md-tabbar");
    window.secondTabbar = md.toolbar.querySelector("md-row.second md-tabbar");
    window.addEventListener("resize:end", function() {
        if (isMobile() && !secondTabbar.daniInit) {
            secondTabbar.daniInit = true;
            secondTabbar.alreadyInitialized = false;
            secondTabbar.style.width = "";
            [].forEach.call(secondTabbar.querySelectorAll("md-tab"), function(tab) {
                tab.style.flex = "";
            });
            secondTabbar.initTabBar();
            secondTabbar.moveIndicatorToTab(0);
            console.log("HI THERE");
        } else if (!firstTabbar.daniInit) {
            firstTabbar.style.width = "";
            firstTabbar.daniInit = true;
            firstTabbar.alreadyInitialized = false;
            [].forEach.call(firstTabbar.querySelectorAll("md-tab"), function(tab) {
                tab.style.flex = "";
            });
            //firstTabbar.initTabBar()
            firstTabbar.moveIndicatorToTab(0);
            console.log("HI YO");
        }
    });


    [].forEach.call(document.querySelectorAll(".activity"), function(aventura) {
        aventura.addEventListener("click", function(e) {
            var el = e.currentTarget;
            transition.morph(el);
        });
    });
});

function sliderAuto() {
    setTimeout(sliderAuto, 3000);
    if (sliderPage === false) {
        sliderPage = 0;
        return;
    }
    var slider = document.querySelector("#main-slider");
    var sliderTabs = document.querySelector("#main-slider-tabs");
    slider.moveToPage(sliderPage);
    sliderTabs.moveIndicatorToTab(sliderPage);
    sliderPage++;
    if (sliderPage > 3) {
        sliderPage = 0;
    }
}

function handleSliderTabs(tab, n) {
    sliderPage = n;
}


// Resize end event
(function(window) {
    var currentOrientation, debounce, dispatchResizeEndEvent, document, events, getCurrentOrientation, initialOrientation, resizeDebounceTimeout;
    document = window.document;
    if (!(window.addEventListener && document.createEvent)) {
        return;
    }
    events = ['resize:end', 'resizeend'].map(function(name) {
        var event;
        event = document.createEvent('Event');
        event.initEvent(name, false, false);
        return event;
    });
    dispatchResizeEndEvent = function() {
        return events.forEach(window.dispatchEvent.bind(window));
    };
    getCurrentOrientation = function() {
        return Math.abs(+window.orientation || 0) % 180;
    };
    initialOrientation = getCurrentOrientation();
    currentOrientation = null;
    resizeDebounceTimeout = null;
    debounce = function() {
        currentOrientation = getCurrentOrientation();
        if (currentOrientation !== initialOrientation) {
            dispatchResizeEndEvent();
            return initialOrientation = currentOrientation;
        } else {
            clearTimeout(resizeDebounceTimeout);
            return resizeDebounceTimeout = setTimeout(dispatchResizeEndEvent, 100);
        }
    };
    return window.addEventListener('resize', debounce, false);
})(window);
