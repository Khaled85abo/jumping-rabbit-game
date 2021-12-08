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

// When Games ends, this function will reset everything to its initial state.
function startAgain(modalDiv) {
  state.AI = false;
  modalDiv.classList.add("hide");
  renderRange();
}

// letting Robot player play to find the rabbit
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

// Checking if rabbit exists in a box which the player has clicked on.
function checkIfRabbitExists(article, i) {
  article.querySelector(".two").classList.add("fade");
  if (i == state.pos) {
    renderRabbitPic(i);
    showGameEndModal("Congratulations you've found it");
  } else {
    rabbitJumps();
  }
}

// moving the rabbit randomly forward or backward after a failed attempt to find the rabbit.
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

// Creating a array with a (rabbit) inside, the array has the same length as the DOM boxes.
// when a user clicks on a DOM box, it's index is used to check if the rabbit exists in the array.
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

// Listening to user changing input range, restarting the game and moving the mouse in the boxes section.
function initActions() {
  document.querySelector("input").addEventListener("input", renderRange);
  document.querySelector(".robot").addEventListener("click", StartRobotGamer);

  const modalDiv = document.querySelector(".modal-div");
  modalDiv
    .querySelector("button")
    .addEventListener("click", () => startAgain(modalDiv));

  const section = document.querySelector(".section");
  section.addEventListener("mousemove", updatePosition);
  // section.addEventListener("click", toggleLight);
}

// Adding event listeners to DOM boxes after they are created.
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

// Change the DOM and array length according to user's input,
// then calling the functions to create them providing a new start position for the rabbit in the virtual boxes.
// Rendering game level and boxes number according to number of boxes
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

// Show end game modal wit a success message when the rabbit is found by the user or the robot.
// or show a fail message when the Robot fails to find the rabbit.
function showGameEndModal(text = "Robot has found it :)") {
  document.querySelector(".modal-div").classList.remove("hide");
  document.querySelector(".modal > h2").innerText = text;
}

// Rendering DOM boxes according to the number provided by the user or the initial value of input which is 25.
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

// Rendering a rabbit picture when the index of the DOM box clicked by the user matches the index of the virtual array that has the rabbit.
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
/**
 *
 * flash lights projects links.
 * https://codepen.io/hippolyte-gobbetti/pen/zYZWmOK
 * https://codepen.io/jedmac/pen/RWQPNb
 * https://www.youtube.com/watch?v=y1Avl1CscnM
 */

// NOT IN USE
function toggleLight() {
  state.lights = !state.lights;
  document.querySelector(".light").classList.toggle("light-circle");
}

// Updating positions x and y css variables according to user's mouse position in the boxes section.
function updatePosition(e) {
  document.documentElement.style.setProperty("--cursorXpos", `${e.pageX}px`);
  document.documentElement.style.setProperty(
    "--cursorYpos",
    `${e.pageY - 320}px`
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
