var md = new Paperkit();
md.init();
var sliderPage = false;
var currentActivity = false;
window.addEventListener('load', function() {
    var isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
    var mobileAgent = (typeof window.orientation !== "undefined") ||
        (navigator.userAgent.indexOf('IEMobile') !== -1);
    if (isFirefox && !mobileAgent) {
        [].forEach.call(document.querySelectorAll('a[href^="tel:"]'), function(link) {
            link.removeAttribute("href");
        });
    }
    document.querySelector("md-fab").addEventListener("click", function() {
        if (isFirefox) {
            return false;
        }
        window.open("tel:666666666", "_self");
    });
    sliderAuto();
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
        aventura.addEventListener("click", activityClick);
    });

    function activityClick(event) {
        var activity = currentActivity = event.currentTarget;
        var rect = activity.getBoundingClientRect();
        var height = isMobile() ? getViewport().height - 32 : 600;

        md.greylayer.show();
        md.greylayer.addEventListener("click", greylayerActivityClick);

        var morphHelper = document.createElement("div");
        morphHelper.id = "morph-helper";
        morphHelper.style.opacity = "0";
        morphHelper.style.height = height + "px";
        morphHelper.style.width = isMobile() ? rect.width + "px" : "1000px";
        morphHelper.style.backgroundColor = "white";
        morphHelper.style.position = "fixed";
        morphHelper.style.top = "50%";
        morphHelper.style.left = "50%";
        morphHelper.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(morphHelper);

        transition.morph(activity, morphHelper, activityMorphCallback);
    }

    function activityMorphCallback(container) {
        var morphHelper = document.getElementById("morph-helper");
        var template = document.querySelector("div.activity-template").innerHTML;
        var title = currentActivity.querySelector(".data-title").innerHTML;
        var text = currentActivity.querySelector(".data-text").innerHTML;

        morphHelper.parentNode.removeChild(morphHelper);

        container.innerHTML = template;
        container.querySelector(".replace-title").innerHTML = title;
        container.querySelector(".replace-text").innerHTML = text;

        md.initElement(container);
    }
});

function greylayerActivityClick(event) {
    md.greylayer.removeEventListener("click", greylayerActivityClick);
    transition.morphBack(false, function() {
        md.greylayer.hide();
    });
}

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

function handleMenu(tile) {
    md.sidemenu.close();

    var action = tile.getAttribute("data-action");
    var parameter = tile.getAttribute("data-parameter");

    if (action === "tab") {
        document.getElementById("main-tabs").moveIndicatorToTab(parameter);
        document.getElementById("mobile-tabs").moveIndicatorToTab(parameter);
        document.getElementById("main-pager").moveToPage(parameter);
    }
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
