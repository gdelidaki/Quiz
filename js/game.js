const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progress-bar-full");

const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = {};

let questions; //used to have array of questions but transferred them to .json file
//also startGame(); was at the very btm of this file

/* fetch("json/questions.json").then(res => {
  return res.json();
}).then(loadedQuestions => {
  questions = loadedQuestions;
  startGame();
}).catch(err => {
  alert("Error. Please go back to home page");
}); */ 

//change color scheme
//add dropdown menu to select different quiz

fetch("https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple&encode=url3986").then(res => {
  return res.json();
}).then(loadedQuestions => {
  questions = loadedQuestions.results.map( loadedQuestion => {
    const formattedQuestion = {
      question: decodeURIComponent(loadedQuestion.question)
    };
    let answerChoices = [...loadedQuestion.incorrect_answers];


    formattedQuestion.answer = Math.ceil(Math.random() *3) + 1;

    answerChoices.splice(formattedQuestion.answer - 1, 0, decodeURIComponent(loadedQuestion.correct_answer));

    answerChoices.forEach((choice, index) => {
      formattedQuestion["choice" + (index + 1)] = decodeURIComponent(choice);
    });
  
    return formattedQuestion;
  })


  startGame();
}).catch(err => {
  alert("Error. Please go back to home page");
});


const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
    localStorage.setItem('mostRecentScore', score);
    
    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerText = 'Question ' + questionCounter + '/' + MAX_QUESTIONS;
  //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = (questionCounter/MAX_QUESTIONS) * 100 + "%";
   
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach( choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
}

choices.forEach( choice => {
  choice.addEventListener("click", e => {
    if(!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
 
    /*const classToApply = "incorrect";
    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "correct";
    }*/

    const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply==="correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout( () => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 500);
    
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

startGame();

