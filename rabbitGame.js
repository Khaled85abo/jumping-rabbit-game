/**
 *
 * Model Logic
 *
 */

//#region

const state = {};

function initState() {
  state.gaps = [];
  state.len;
  state.AI = false;
  state.rabbit = "R";
  state.pos;
  state.rabbitArticle;
  state.lights = true;
}

function startAgain(modalDiv) {
  state.AI = false;
  modalDiv.classList.add("hide");
  renderRange();
}

function StartRobotGamer() {
  const { len, pos } = state;
  let found = false;
  for (let i = 0; i < len; i = i + 2) {
    if (i == pos) {
      found = true;
      renderRabbitPic(i);
      showGameEndModal();
      break;
    }
    rabbitJumps();
  }
  if (!found) {
    for (let i = 1; i < len; i = i + 2) {
      if (i == pos) {
        renderRabbitPic(i);
        showGameEndModal();
        found = true;
        break;
      }
      rabbitJumps();
    }
  }

  !found && showGameEndModal("This Rabbit was really hard to find :(");
}

function checkIfRabbitExists(article, i) {
  article.querySelector(".two").classList.add("fade");
  if (i == state.pos) {
    renderRabbitPic(i);
    showGameEndModal("Congratulations you've found it");
  } else {
    rabbitJumps();
  }
}

function rabbitJumps() {
  // destrcturing object to get variables, mutating variables will not mutate the object
  let { pos, len } = state;
  if (Math.random() > 0.5) {
    console.log("jumb forward");
    pos == len ? pos-- : pos++;
  } else {
    console.log("jumb backward");
    pos == 0 ? pos++ : pos--;
  }
  console.log("position in jumping", pos);
  // Binding the object with the current value
  state.pos = pos;
  console.log("position in jumping", state.pos);
  createVirtualBoxes();
}

function createVirtualBoxes() {
  let { len, pos, rabbit, gaps } = state;
  console.log("position in create boxes:", pos);
  gaps = [];
  for (let i = 0; i < len; i++) {
    if (i == pos) {
      gaps.push(rabbit);
    } else {
      gaps.push(i);
    }
  }
  console.log(gaps);
}

//#endregion

/**
 *
 * Controller Logic
 *
 */
//#region

function initActions() {
  document.querySelector("input").addEventListener("input", renderRange);
  document
    .querySelector("button:first-of-type")
    .addEventListener("click", StartRobotGamer);
  const modalDiv = document.querySelector(".modal-div");
  modalDiv
    .querySelector("button")
    .addEventListener("click", () => startAgain(modalDiv));

  const section = document.querySelector(".section");
  section.addEventListener("mousemove", updatePosition);
  // section.addEventListener("click", toggleLight);
}

function articlesActions(article, i) {
  article.addEventListener("mouseout", (e) => {
    article.querySelector(".two").classList.remove("fade");
  });
  article.addEventListener("click", () => checkIfRabbitExists(article, i));
}
//#endregion

/**
 *
 * View Logic
 *
 */

//#region
function renderRange() {
  const value = document.querySelector("input").value;
  state.len = value;
  state.pos = Math.floor(Math.random() * value);
  let level =
    value > 3 && value < 15
      ? "easy"
      : value > 15 && value < 30
      ? "moderate"
      : value > 30 && value < 60
      ? "hard"
      : value > 60 && value < 80
      ? "very had"
      : "impossible";

  document.querySelector("h1").innerText = level;
  document.querySelector("h2").innerText = `${value} boxes`;
  createVirtualBoxes();
  renderDomBoxes();
}

function showGameEndModal(text = "Robot has found it :)") {
  document.querySelector(".modal-div").classList.remove("hide");
  document.querySelector(".modal > h2").innerText = text;
}

function renderDomBoxes() {
  const { len } = state;
  const section = document.querySelector("section");
  section.innerHTML = "";

  for (let i = 0; i < len; i++) {
    const article = document.createElement("article");
    article.innerHTML = `
        <div class="one"><img src='./assets/empty-room.jpg'/></div>
        <div class="two"></div>
      `;
    articlesActions(article, i);
    section.appendChild(article);
  }
}

function renderRabbitPic(i) {
  const article = document.querySelectorAll("article")[i];
  article.querySelector(".one").innerHTML = "<img src='./assets/rabbit.jpg'/>";
  article.querySelector(".two").classList.add("permnant-fade");
  article.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
}

// https://codepen.io/hippolyte-gobbetti/pen/zYZWmOK
//https://codepen.io/jedmac/pen/RWQPNb

function toggleLight() {
  state.lights = !state.lights;
  document.querySelector(".light").classList.toggle("light-circle");
}

function updatePosition(e) {
  document.documentElement.style.setProperty("--cursorXpos", `${e.pageX}px`);
  document.documentElement.style.setProperty(
    "--cursorYpos",
    `${e.pageY - 220}px`
  );
}

//#endregion

/**
 *
 * Entry point
 *
 */
//#region

function main() {
  initState();
  renderRange();
  initActions();
}

main();
//#endregion
