const state = {};

function initState() {
  state.gaps = [];
  state.len;
  state.AI = false;
  state.rabbit = "R";
  state.pos;
}

function initActions() {
  document.querySelector("input").addEventListener("input", renderRange);
  document
    .querySelector("button:first-of-type")
    .addEventListener("click", startAI);
  const modalDiv = document.querySelector(".modal-div");
  modalDiv
    .querySelector("button")
    .addEventListener("click", () => startAgain(modalDiv));
}

function startAgain(modalDiv) {
  state.AI = false;
  modalDiv.classList.add("hide");
  renderRange();
}

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

  document.querySelector("h2").innerText = level;
  document.querySelector("h1").innerText = `${value} boxes`;
  createVirtualBoxes();
  renderArticles();
}

function startAI() {
  const { len, pos } = state;
  let found = false;
  for (let i = 0; i < len; i = i + 2) {
    if (i == pos) {
      rabbitFound();
      found = true;
      break;
    }
    rabbitJumps();
  }
  if (!found) {
    for (let i = 1; i < len; i = i + 2) {
      if (i == pos) {
        rabbitFound();
        found = true;
        break;
      }
      rabbitJumps();
    }
  }

  !found && rabbitFound("This Rabbit was really hard to find :(");
}

function rabbitFound(text = "Robot has found it") {
  document.querySelector(".modal-div").classList.remove("hide");
  document.querySelector(".modal > h2").innerText = text;
}

function renderArticles() {
  const { len } = state;
  const section = document.querySelector("section");
  section.innerHTML = "";

  for (let i = 0; i < len; i++) {
    const article = document.createElement("article");
    article.innerHTML = `
        <div class="one"></div>
        <div class="two"></div>
      `;
    articlesActions(article, i);
    section.appendChild(article);
  }
}

function articlesActions(article, i) {
  article.addEventListener("mouseout", (e) =>
    article.querySelector(".two").classList.remove("fade")
  );
  article.addEventListener("click", () => {
    article.querySelector(".two").classList.add("fade");
    if (i == state.pos) {
      article.querySelector(".one").innerHTML =
        "<img src='./assets/rabbit.jpg'/>";
      article.querySelector(".two").classList.add("permnant-fade");
      rabbitFound("Congratulations you've found it");
    } else {
      article.querySelector(".one").innerHTML =
        "<img src='./assets/empty-room.jpg'/>";
      rabbitJumps();
    }
  });
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
function main() {
  initState();
  renderRange();
  initActions();
}

main();

//this is a sample flashlight effect
// $(document).ready(function () {
//   $(this)
//     .mousemove(function (e) {
//       $("#light").css({
//         top: e.pageY - 250,
//         left: e.pageX - 250,
//       });
//     })
//     .mousedown(function (e) {
//       switch (e.which) {
//         case 1:
//           $("#light").toggleClass("light-off");
//           break;
//         case 2:
//           console.log("Middle Mouse button pressed.");
//           break;
//         case 3:
//           console.log("Right Mouse button pressed.");
//           break;
//         default:
//           console.log("You have a strange Mouse!");
//       }
//     });
// });
