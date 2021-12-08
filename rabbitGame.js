/**
 *
 * Model Logic
 *
 */

//#region

// The model should not communicate with view at all.

const state = {};

function initState() {
  state.gaps = [];
  state.len;
  state.AI = false;
  state.rabbit = "R";
  state.pos;
  state.level;
  state.rabbitArticle;
  state.lights = true;
}

// letting Robot player play to find the rabbit
function StartRobotGamer() {
  const { len, pos } = state;
  let found = false;
  for (let i = 0; i < len; i = i + 2) {
    if (i == pos) {
      found = true;
      renderRabbitPic(i);
      showModal();
      break;
    }
    rabbitJumps();
  }
  if (!found) {
    for (let i = 1; i < len; i = i + 2) {
      if (i == pos) {
        renderRabbitPic(i);
        showModal();
        found = true;
        break;
      }
      rabbitJumps();
    }
  }

  !found && showModal("This Rabbit was really hard to find :(");
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

  const section = document.querySelector(".section");
  section.addEventListener("mousemove", updatePosition);
  // section.addEventListener("click", toggleLight);

  document
    .querySelector(".hint")
    .addEventListener("click", () => showModal("text", "hint"));
  document
    .querySelector(".how-to-play")
    .addEventListener("click", () => showModal("text", "info"));
}

// Checking if rabbit exists in a box which the player has clicked on.
function checkIfRabbitExists(article, i) {
  article.querySelector(".two").classList.add("fade");
  if (i == state.pos) {
    renderRabbitPic(i);
    showModal("Congratulations you've found it");
  } else {
    rabbitJumps();
  }
}

// Adding event listeners to DOM boxes after they are created.
function articlesActions(article, i) {
  article.addEventListener("mouseout", (e) => {
    article.querySelector(".two").classList.remove("fade");
  });
  article.addEventListener("click", () => checkIfRabbitExists(article, i));
}

function initModalBtnAction() {
  document.querySelector(".modal button").addEventListener("click", (e) => {
    document.querySelector(".light").classList.remove("display-none");
    document.querySelector(".modal-div").classList.add("hide");
    document.querySelector(".svg").classList.remove("hide");

    if (e.target.dataset.btnType == "again") {
      state.AI = false;
      renderRange();
    }
    if (e.target.dataset.btnType == "hint") {
      showHint();
    }
  });
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

  state.level = level;
  document.querySelector(".hint").disabled = level == "easy" ? true : false;
  document.querySelector("h1").innerText = level;
  document.querySelector("h2").innerText = `${value} boxes`;
  createVirtualBoxes();
  renderDomBoxes();
}

// Show end game modal wit a success message when the rabbit is found by the user or the robot.
// or show a fail message when the Robot fails to find the rabbit.
function showModal(text = "Robot has found it :)", type) {
  document.querySelector(".modal-div").classList.remove("hide");

  const modal = document.querySelector(".modal");
  modal.classList.add("solid-background");
  document.querySelector(".svg").classList.add("hide");
  document.querySelector(".light").classList.add("display-none");
  let content;

  switch (type) {
    case "info":
      content = `
        <h2>A rabbit has been lost, Help us find it!</h2>
        <ul>
        <li>The rabbit is in one of the boxes below.</li>
        <li>If you find the rabbit the game is over.</li>
        <li>But if you don't then the rabbit will jump forward or backward.</li>
        <li>the rabbit can only jump one box at a time.</li>
        <li>If the rabbit is in the last box, then it can only jump backward.</li>
        <li>If the rabbit is in the first box, then it can only jump forward.</li>
        </ul>
        <button data-btn-type='info'>Play</button>
      `;
      break;
    case "hint":
      content = `
        <h2>The rabbit will be in one of the 10 boxes that will be highlighted.</h2>
        <button data-btn-type='hint'>Go</button>
        `;
      break;
    default:
      content = `
        <h2>${text}</h2>
        <button data-btn-type='again'>Start Again</button>
      `;
      modal.classList.remove("solid-background");
  }

  document.querySelector(".modal").innerHTML = content;
  initModalBtnAction();
}

function showHint() {
  const articles = document.querySelectorAll(".two");

  for (let i = 0; i < state.len; i++) {
    articles[i].classList.remove("highlighted-article");
  }

  const newPos = Math.floor(Math.random() * 10);
  const indexDifference = 10 - newPos;
  let firstIndex = state.pos - newPos;
  let lastIndex = state.pos + indexDifference;

  if (firstIndex < 0) {
    firstIndex = 0;
    lastIndex = 10;
  } else if (lastIndex > state.len - 1) {
    lastIndex = state.len - 1;
    firstIndex = lastIndex - 10;
  }

  for (let i = firstIndex; i <= lastIndex; i++) {
    articles[i].classList.add("highlighted-article");
  }
  articles[firstIndex].scrollIntoView({ behavior: "smooth" });
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
