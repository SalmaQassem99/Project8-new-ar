const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const game = document.querySelector(".game");
const playButton = document.querySelector(".game .card-wrapper .play");
const cardWrapper = document.querySelector(".game .cardContainer");
const body = document.querySelector(".body");
const infoIcon = document.querySelector(".info.icon");
const scoreWrapper = document.querySelector(".game .scoreWrapper");
const score = document.querySelector(".game .scoreItem .score");
const cardItems = document.querySelectorAll(".cards .card-item");
const textItems = document.querySelectorAll(
  ".match-cards .match-card-wrapper .match-card"
);
const cardsText = document.querySelectorAll(".cards .card-item .text");
const successModal = document.querySelector(".success-wrapper");
const closeButton = document.querySelector(".closeModal");
const overlay = document.querySelector(".overlay");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const iconsArr = [...arrows, pauseButton];
let animationCounter = 0;
let counter = 0;

const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};
infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
const animateNext = (i) => {
  cardItems[i].style.visibility = "visible";
  cardItems[i].classList.add("show");
  cardItems[i].addEventListener("animationend", () => {
    if (cardItems[i].classList.contains("show")) {
      cardItems[i].classList.remove("show");
      if (animationCounter === cardItems.length - 1) {
        //animate text
        textItems.forEach((item) => {
          item.style.visibility = "visible";
          item.classList.add("show");
          item.addEventListener("animationend", () => {
            if (item.classList.contains("show")) {
              item.classList.remove("show");
            }
          });
        });
      } else {
        animationCounter++;
        animateNext(animationCounter);
      }
    }
  });
};
playButton.addEventListener("click", () => {
  document.querySelector("#start-audio").play();
  cardWrapper.classList.add("hide");
  cardWrapper.addEventListener("animationend", () => {
    cardWrapper.classList.remove("hide");
    cardWrapper.style.visibility = "hidden";
    scoreWrapper.style.visibility = "visible";
    score.textContent = `0/${cardItems.length}`;
    body.classList.add("show");
    animateNext(animationCounter);
  });
});
textItems.forEach((textItem) => {
  textItem.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    event.dataTransfer.setData("id", textItem.dataset.index);
    document.querySelector(`audio[id="${textItem.dataset.index}"]`).play();
  });
  textItem.addEventListener("drag", (event) => {
    textItem.style.opacity = "0";
  });
  textItem.addEventListener("dragend", (event) => {
    textItem.style.opacity = "1";
  });
});
cardsText.forEach((cardItem) => {
  cardItem.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  cardItem.addEventListener("drop", (event) => {
    event.preventDefault();
    const index = cardItem.dataset.index;
    const textId = event.dataTransfer.getData("id");
    const text = document.querySelector(
      `.match-cards .match-card-wrapper .match-card[data-index="${textId}"]`
    );
    if (index === textId) {
      cardItem.style.color = "inherit";
      cardItem.style.backgroundColor = "#fcdc6c";
      document.querySelector("#correct-audio").play();
      const textContent = text.textContent;
      counter += 1;
      document.querySelector(
        ".score"
      ).textContent = `${counter}/${textItems.length}`;
      document
        .querySelector(":root")
        .style.setProperty("--width", `${(100 / textItems.length) * counter}%`);
      cardItem.textContent = textContent;
      cardItem.classList.add("animate");
      cardItem.addEventListener("animationend", () => {
        cardItem.classList.remove("animate");
      });
      text.style.visibility = "hidden";
      if (counter === cardsText.length) {
        const text = document.querySelector(".text-card .score-text");
        text.textContent = `${counter}/${cardsText.length}`;
        text.setAttribute("text", `${counter}/${cardsText.length}`);
        successModal.style.visibility = "visible";
        successModal.classList.add("show");
        overlay.classList.add("show");
      }
    } else {
      document.querySelector("#wrong-audio").play();
      text.classList.add("vibrate");
      text.addEventListener("animationend", () => {
        if (text.classList.contains("vibrate")) {
          text.classList.remove("vibrate");
        }
      });
    }
  });
});
const addCloseAnimation = () => {
  closeButton.classList.add("animate");
  closeButton.addEventListener("animationend", () => {
    closeButton.classList.remove("animate");
  });
  successModal.classList.add("hide");
  successModal.style.visibility = "hidden";
  overlay.classList.remove("show");
};
document.addEventListener("click", function (event) {
  const isVisible =
    window.getComputedStyle(successModal).visibility === "visible";
  var isClickInside =
    successModal.contains(event.target) || event.target === closeButton;
  if (!isClickInside && isVisible) {
    addCloseAnimation();
  }
});
closeButton.addEventListener("click", () => {
  addCloseAnimation();
});
const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};
document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
const checkScreen = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth < 768 && isPortrait;
  return isMobile;
};
window.addEventListener("load", () => {
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  } else {
    game.style.visibility = "visible";
  }
  animateInfo();
});
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});
window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (window.orientation === 90 || window.orientation === -90) {
    if (is_mobile) {
      game.style.visibility = "visible";
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  } else {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
});
