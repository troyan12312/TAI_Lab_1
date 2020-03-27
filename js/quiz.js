let preQuestions = [];

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(0)
    }
);

let answeredQuestions = [];


let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let question = document.querySelector('.question');

let questionNumber = document.querySelector('#question-number');
let answers = document.querySelectorAll('.list-group-item');

let list = document.querySelector('.list');
let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let average = document.querySelector('.average');
let index = 0;
let points = 0;



for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}

function setQuestion(index) {
    question.innerHTML = preQuestions[index].question;
    questionNumber.innerHTML = (index + 1);

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    markAnswers(index);

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}
activateAnswers();

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function unMark() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove("correct");
        answers[i].classList.remove("incorrect");
    }
}

function markCorrect(elem) {
    elem.classList.add('correct');
    answeredQuestions.push({
        index: index,
        choosen: elem.innerHTML,
    });
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
    answeredQuestions.push({
        index: index,
        choosen: elem.innerHTML,
    });
}

function storage() {
    let counter = JSON.parse(localStorage.getItem("counter"));
    let sum = JSON.parse(localStorage.getItem("sum"));

    counter += 1;
    sum += points;
    avg = sum / counter;

    average.innerHTML = avg;

    localStorage.setItem("counter", counter);
    localStorage.setItem("sum", sum);
    localStorage.setItem("avg", avg);
}

function isAnswered() {
    for(let i = 0; i < answeredQuestions.length; i++) {
        if(answeredQuestions[i].index === index) {
            return true;
        }
    }
    return false;
}

restart.addEventListener('click', function (event) {
    event.preventDefault();
    answeredQuestions = [];
    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    unMark();
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        for(let i = 0; i < answers.length; i++){
            if(answers[i].innerHTML === preQuestions[index].correct_answer){
                answers[i].classList.add('correct');
            }
    }
        markInCorrect(event.target);
    }
    console.log(answeredQuestions);
    disableAnswers();
}


next.addEventListener('click', function() {
    index++;
    if(index >= preQuestions.length){
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;

        storage();
    } else {
        unMark();
        activateAnswers();
        setQuestion(index);
    }
});

previous.addEventListener('click', function() {
   if(index > 0) {
       index--;
       unMark();
       setQuestion(index);
   }
});

function markAnswers(index) {
    if(isAnswered()){
        disableAnswers();
        for(let i = 0; i < answers.length; i++){
            if(answers[i].innerHTML === preQuestions[index].correct_answer){
                answers[i].classList.add('correct');
            } else if (answers[i].innerHTML === answeredQuestions[index].choosen){
                answers[i].classList.add('incorrect');
            }
        }
    }
}

