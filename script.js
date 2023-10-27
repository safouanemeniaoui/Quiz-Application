/* Selector */
let categorySelect = document.querySelector("select");
let category = document.querySelector(".category");
let timerSelected = document.querySelector(".timer-select");
let form = document.querySelector(".form");
let questionNb = document.querySelectorAll(".ques-nb");
let bullets = document.querySelector(".bullets");
let quizContent = document.querySelector(".quiz-content");
let question = document.querySelector(".quiz-content h2");
let listAnswers = document.querySelector(".quiz-content .list-answers");
let submit = document.querySelector(".submit");
let seconds = document.querySelector(".seconds");
let result = document.querySelector(".result");
let timeBullets = document.querySelector(".time-and-bullets");
let rightAnswerSpan = document.querySelector(".right-answer");
let resultMsgSpan = document.querySelector(".result .msg");
let startBtn = document.querySelector(".start");
let resetBtn = document.querySelector(".reset");
let overlay = document.querySelector(".overlay");
let container = document.querySelector(".container");
let ansTable = [1, 2, 3, 4];
let index = 0;
let rightAnswer = 0;
let counter;
let time;
let selected;
let qLength = 10;

startBtn.onclick = function () {
  time = timerSelected.value;
  form.remove();
  overlay.remove();
  container.style.display = "block";
  category.innerHTML =
    categorySelect.options[categorySelect.selectedIndex].text;
  fetch(`./json/${categorySelect.value}`)
    .then((response) => response.json())
    .then((json) => {
      let questionsList = randomQuestions(json, qLength);
      questionNb.forEach((e) => (e.innerHTML = qLength));
      createSpans(qLength);
      main(questionsList);
      getSelectedAnswer();
      submit.onclick = function () {
        matchedCheck(selected, questionsList);
        if (index < 10) {
          let answers = document.querySelectorAll(".answers");
          answers.forEach((answer) => {
            answer.remove();
          });
          clearInterval(counter);
          main(questionsList);
          selected = null;
          getSelectedAnswer();
        } else {
          result.style.display = "block";
          resetBtn.style.display = "block";
          resultMsg(rightAnswer);
          quizContent.remove();
          submit.remove();
          timeBullets.remove();
        }
      };
    });
};

resetBtn.onclick = function () {
  location.reload();
};

// Functions

function createSpans(nb) {
  for (i = 0; i < nb; i++) {
    let span = document.createElement("span");
    bullets.appendChild(span);
  }
}

function getQuestion(data) {
  question.textContent = data[index].title;
  for (i = 1; i <= 4; i++) {
    createAnswer(i, data[index][`answer_${i}`]);
  }
  index += 1;
}

let randomTable = shuffle(ansTable);

function createAnswer(i, answer) {
  let myDiv = document.createElement("div");
  let myInput = document.createElement("input");
  let myLable = document.createElement("label");
  let lableText = document.createTextNode(answer);
  myDiv.classList = "answers";
  myDiv.style.order = `${randomTable[i - 1]}`;
  myInput.type = "radio";
  myInput.name = "answer";
  myInput.id = `answer_${i}`;
  myInput.setAttribute("data-set", `answer_${i}`);
  myLable.htmlFor = `answer_${i}`;
  myLable.appendChild(lableText);
  myDiv.appendChild(myInput);
  myDiv.appendChild(myLable);
  listAnswers.appendChild(myDiv);
}

function timer() {
  counter = setInterval(() => {
    seconds.textContent -= 1;
    seconds.textContent =
      seconds.textContent < 10
        ? `0${seconds.textContent}`
        : seconds.textContent;
    if (seconds.textContent == "00") {
      clearInterval(counter);
      submit.click();
    }
  }, 1000);
}

function main(json) {
  let bulletsSpans = document.querySelectorAll(".bullets span");
  bulletsSpans[index].classList.add("on");
  seconds.textContent = time < 10 ? `0${time}` : time;
  getQuestion(json);
  timer();
}

function getSelectedAnswer() {
  let answers = document.querySelectorAll(".answers input");
  answers.forEach((e) => {
    e.onclick = function () {
      answers.forEach((e) => {
        e.classList.remove("clicked");
      });
      e.classList.add("clicked");
      selected = e.dataset.set;
      return selected;
    };
  });
}

function matchedCheck(e, data) {
  if (e == data[index - 1][`right_answer`]) {
    rightAnswer += 1;
  }
  rightAnswerSpan.innerHTML = rightAnswer;
}

function resultMsg(val) {
  if (val < 5) {
    resultMsgSpan.textContent = "bad";
    resultMsgSpan.classList.add("bad");
  } else if (val < 9) {
    resultMsgSpan.textContent = "good";
    resultMsgSpan.classList.add("good");
  } else {
    resultMsgSpan.textContent = "good";
    resultMsgSpan.classList.add("good");
  }
}

function randomQuestions(table, val = 10) {
  let tab = [];
  let mySet = new Set();
  while (mySet.size < val) {
    let random = Math.trunc(Math.random() * table.length);
    mySet.add(random);
  }
  Array.from(mySet).forEach((e) => tab.push(table[e]));
  return tab;
}

function shuffle(tab) {
  tab.forEach((el) => {
    let random = Math.trunc(Math.random() * tab.length);
    [tab[tab.indexOf(el)], tab[random]] = [tab[random], tab[tab.indexOf(el)]];
  });
  return tab;
}
