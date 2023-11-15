
let currentQuestionIndex = -1;
let questions = [];

const questionElement = document.getElementById('question');
const wordElement = document.getElementById('word');
const optionsElement = document.getElementById('options');
const messageElement = document.getElementById('message');
const scoreElement = document.querySelector('.score');
const playerName = document.querySelector('.namePlayer')
const timer = document.querySelector('.timer')

function displayNextQuestion() {

    messageElement.textContent = '';

    messageElement.classList.remove('correct-message');
    messageElement.classList.remove('incorrect-message');
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        const randomQuestion = questions[currentQuestionIndex];
        questionElement.textContent = randomQuestion.question;
        wordElement.textContent = randomQuestion.word;
        optionsElement.innerHTML = '';
        randomQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option, randomQuestion.response_correct));
            optionsElement.appendChild(button);
        });
    } else {
        
        messageElement.textContent = 'Congratulations, you answered all the questions!';
    }
} 

let scorePlayer = 0;

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        messageElement.textContent = 'Response Correct!'
        messageElement.classList.add('correct-message')
        messageElement.classList.remove('incorrect-message')
        scorePlayer += 1
        updateScore();
    } else {
        messageElement.textContent = 'Response! Invalid '
        messageElement.classList.add('incorrect-message')
        messageElement.classList.remove('correct-message') // You can customize this part as needed.
    }

    setTimeout(() => {
        displayNextQuestion();
    }, 1000);
}


function updateScore () {
    scoreElement.textContent = scorePlayer;
}

const start = document.querySelector('.start');
const end = document.querySelector('.end'); 


function startGame () {
    const textStart = document.querySelector('.text-start')
    const questions = document.querySelector('.questions')
    const formGame = document.querySelector('.form-game')
    const options = document.querySelector('#options')
    const styleTimer = document.querySelector('.style-timer')

    textStart.style.display = 'none';
    options.style.display = 'block';
    questions.style.display = 'flex';
    formGame.style.display = 'block';
    styleTimer.style.display = 'block'
    start.style.display = 'none'
    end.style.display = 'block'

    startTimer();
};


function endGame () {
    const scoreEndGame = document.querySelector('.score').textContent;
    const namePlayer = document.querySelector('.name-player').textContent.trim();
    const playerData = { name: namePlayer, score: scoreEndGame };
    
    const dataScore = document.querySelector('.scorePlayer')
    dataScore.style.display = 'block'

    end.style.display = 'none'
    
    stopTimer();
    try {
        const response = fetch('/player-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData),
        });

        if (response.ok) {
            console.log('Dados enviados com sucesso!');
        } else {
            console.error('Erro ao enviar os dados. Status:', response.status);
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
    
};


const startTimer = () => {
    let currentTime = +timer.innerHTML;

    this.loop = setInterval(() => {
        if (currentTime === 0) {
            clearInterval(this.loop);
            endGame();

        } else {
            currentTime -= 1;
            timer.innerHTML = currentTime;
        }
    }, 1000);
}

const stopTimer = () => {
    clearInterval(loop);
}

fetch('../data_base_quiz.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayNextQuestion();
    })
    .catch(error => console.error('Error loading questions:', error));
    
updateScore();

