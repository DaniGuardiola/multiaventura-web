"use strict";
var md = new Paperkit();
var sliderPage = false;
var currentActivity = false;

function hashChangeListener(first) {
  first = (first === true);
  var hash = document.location.hash;
  var parameter = 0;
  if (hash === "#packs") {
    parameter = 1;
  } else if (hash === "#conocenos") {
    parameter = 2;
  } else if (hash === "#actividades-barranquismo" && first) {
    setTimeout(function() {
      document.querySelector(".activity[data-activity=\"1\"]").click();
    }, 500);
  } else if (hash === "#actividades-piraguismo" && first) {
    setTimeout(function() {
      document.querySelector(".activity[data-activity=\"2\"]").click();
    }, 500);
  } else if (hash === "#actividades-espeleologia" && first) {
    setTimeout(function() {
      document.querySelector(".activity[data-activity=\"3\"]").click();
    }, 500);
  } else if (hash === "#actividades-paintball" && first) {
    setTimeout(function() {
      document.querySelector(".activity[data-activity=\"4\"]").click();
    }, 500);
  } else if (hash !== "#actividades" && hash !== "#" && hash !== "") {
    return;
  }
  if (!currentActivity) {
    document.getElementById("main-tabs").moveIndicatorToTab(parameter);
    document.getElementById("main-pager").moveToPage(parameter);
  } else {
    currentActivity = false;
  }
}

function mainTabsHandler(tab, n) {
  if (n === 0) {
    document.location.hash = "#actividades";
  } else if (n === 1) {
    document.location.hash = "#packs";
  } else if (n === 2) {
    document.location.hash = "#conocenos";
  }
}

function activityHashHandler(n) {
  if (n === 1) {
    document.location.hash = "#actividades-barranquismo";
  } else if (n === 2) {
    document.location.hash = "#actividades-piraguismo";
  } else if (n === 3) {
    document.location.hash = "#actividades-espeleologia";
  } else if (n === 4) {
    document.location.hash = "#actividades-paintball";
  }

}

md.initListener(function() {
  hashChangeListener(true);
});
window.addEventListener("hashchange", hashChangeListener);
md.init();

function firefoxFix() {
  var isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
  if (isFirefox) {
    md.greylayer.style.zIndex = -1;
  }
}

function greylayerActivityClick() {
  md.greylayer.removeEventListener("click", greylayerActivityClick);
  transition.morphBack(false, function() {
    md.greylayer.hide();
    firefoxFix();
    md.fab.show();
    document.location.hash = "#actividades";
  });
}

function sliderAuto() {
  setTimeout(sliderAuto, 3000);
  if (sliderPage === false) {
    sliderPage = 0;
    return;
  }
  var slider = document.querySelector("#main-slider");
  slider.moveToPage(sliderPage);
  sliderPage++;
  if (sliderPage > 3) {
    sliderPage = 0;
  }
}

function openSocial(button) {
  var social = button.getAttribute("data-social");
  var text = document.querySelector(".data-" + social).textContent;
  if (social === "facebook") {
    text = "http://facebook.com/" + text;
  } else if (social === "twitter") {
    text = "http://twitter.com/" + text;
  } else if (social === "instagram") {
    text = "http://instagram.com/" + text;
  } else if (social === "email") {
    text = "mailto:" + text;
  }
  window.open(text);
}

function handleMenu(tile) {
  md.sidemenu.close();

  var action = tile.getAttribute("data-action");
  var parameter = tile.getAttribute("data-parameter");

  if (action === "tab") {
    mainTabsHandler(false, +parameter);
    document.getElementById("main-tabs").moveIndicatorToTab(parameter);
    document.getElementById("main-pager").moveToPage(parameter);
  }
}



window.addEventListener("load", function() {
  var isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
  var mobileAgent = (typeof window.orientation !== "undefined") ||
    (navigator.userAgent.indexOf("IEMobile") !== -1);
  if (isFirefox && !mobileAgent) {
    [].forEach.call(document.querySelectorAll("a[href^=\"tel:\"]"), function(link) {
      link.removeAttribute("href");
    });
  }

  var imagesFolder = document.querySelector("#conocenos-page .data-image-folder").textContent;
  var imagesFormat = document.querySelector("#conocenos-page .data-image-format").textContent;
  var imagesN = +document.querySelector("#conocenos-page .data-image-number").textContent;
  var imagesNOriginal = imagesN;
  var newImage = false;

  while (imagesN > 0) {
    newImage = document.createElement("img");
    newImage.src = "resources/" + imagesFolder + "/" + (imagesNOriginal - imagesN + 1) + "." + imagesFormat;
    document.querySelector("#conocenos-page .replace-photos").appendChild(newImage);
    imagesN = imagesN - 1;
  }

  var phone = document.querySelector(".data-phone").textContent;
  document.querySelector("#tlf>a").href = "tel:+34" + phone;
  document.querySelector(".replace-phone-trust").href = "tel:+34" + phone;
  document.querySelector(".replace-phone-trust").textContent = phone;
  document.querySelector("md-fab").addEventListener("click", function() {
    if (isFirefox) {
      return false;
    }
    window.open("tel:+34" + phone, "_self");
  });
  sliderAuto();
  addEventListener("resize:end", function() {

  });


  [].forEach.call(document.querySelectorAll(".activity"), function(aventura) {
    aventura.addEventListener("click", activityClick);
  });

  function activityClick(event) {
    var activity = event.currentTarget;
    currentActivity = event.currentTarget;
    var rect = activity.getBoundingClientRect();
    var height = isMobile() ? getViewport().height - 32 : 600;

    activityHashHandler(+activity.getAttribute("data-activity"));

    md.greylayer.show();
    md.fab.hide();
    md.greylayer.addEventListener("click", greylayerActivityClick);

    var morphHelper = document.createElement("div");
    morphHelper.id = "morph-helper";
    morphHelper.style.opacity = "0";
    morphHelper.style.height = height + "px";
    morphHelper.style.width = isMobile() ? rect.width + "px" : "";
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
    var priceIndividual = currentActivity.querySelector(".data-price-individual").innerHTML;
    var priceGroup = currentActivity.querySelector(".data-price-group").innerHTML;
    // var image = currentActivity.querySelector(".data-image").src;
    var imagesN = +currentActivity.querySelector(".data-image-number").textContent;
    var imagesNOriginal = imagesN;
    var imagesFolder = currentActivity.querySelector(".data-image-folder").textContent;
    var imagesFormat = currentActivity.querySelector(".data-image-format").textContent;
    var newImage;

    container.classList.add("activity-popup");

    morphHelper.parentNode.removeChild(morphHelper);

    container.innerHTML = template;
    container.querySelector(".replace-title").innerHTML = title;
    container.querySelector(".replace-text").innerHTML = text;
    container.querySelector(".replace-price-individual").innerHTML = container.querySelector(".replace-price-individual-mobile").innerHTML = priceIndividual;
    container.querySelector(".replace-price-group").innerHTML = container.querySelector(".replace-price-group-mobile").innerHTML = priceGroup;
    // container.querySelector(".replace-image").src = image;

    while (imagesN > 0) {
      newImage = document.createElement("img");
      newImage.src = "resources/" + imagesFolder + "/" + (imagesNOriginal - imagesN + 1) + "." + imagesFormat;
      container.querySelector(".replace-photos").appendChild(newImage);
      imagesN = imagesN - 1;
    }

    md.initElement(container);
  }
});


// Resize end event
(function(window) {
  var currentOrientation, debounce, dispatchResizeEndEvent, document, events, getCurrentOrientation, initialOrientation, resizeDebounceTimeout;
  document = window.document;
  if (!(window.addEventListener && document.createEvent)) {
    return;
  }
  events = ["resize:end", "resizeend"].map(function(name) {
    var event;
    event = document.createEvent("Event");
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
      return (initialOrientation = currentOrientation);
    } else {
      clearTimeout(resizeDebounceTimeout);
      return (resizeDebounceTimeout = setTimeout(dispatchResizeEndEvent, 100));
    }
  };
  return window.addEventListener("resize", debounce, false);
})(window);
