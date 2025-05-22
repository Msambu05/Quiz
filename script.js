// Quiz data
const quizData = [
    {
        question: "What does HTML stand for?",
        options: [ "Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
        correctAnswer: 0
    },
    {
        question: "Which property is used to change the background color in CSS?",
        options: [ "color", "bgcolor", "background-color", "background"],
        correctAnswer: 2
    },
    {
        question: "What does CSS stand for?",
        options: [ "Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 2
    },
    {
        question: "Which symbol is used to select an id in CSS?",
        options: [ ".", "#", "@", "&"],
        correctAnswer: 1
    }
];

// Variables
let currentQuestionIndex = 0;
let userAnswers = Array(quizData.length).fill(null);
let timeLeft = 300; // 5 minutes in seconds
let timerInterval;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const restartBtn = document.getElementById('restartBtn');
const timerEl = document.getElementById('timer');
const questionNumberEl = document.getElementById('questionNumber');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const reviewListEl = document.getElementById('reviewList');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', restartQuiz);

// Functions
function startQuiz() {
    welcomeScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    loadQuestion(currentQuestionIndex);
    startTimer();
    updateButtonsVisibility();
}

function loadQuestion(index) {
    const question = quizData[index];
    questionNumberEl.textContent = `Question ${index + 1} of ${quizData.length}`;
    questionEl.textContent = question.question;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, i) => {
        const li = document.createElement('li');
        li.className = 'option';
        if (userAnswers[index] === i) {
            li.classList.add('selected');
        }
        li.textContent = option;
        li.dataset.index = i;
        li.addEventListener('click', () => selectOption(i));
        optionsEl.appendChild(li);
    });
}

function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    document.querySelectorAll('.option').forEach((option, i) => {
        option.classList.toggle('selected', i === optionIndex);
    });
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
        updateButtonsVisibility();
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
        updateButtonsVisibility();
    }
}

function updateButtonsVisibility() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === quizData.length - 1;
    submitBtn.style.display = currentQuestionIndex === quizData.length - 1 ? 'block' : 'none';
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    // Check if all questions are answered
    const unansweredQuestions = userAnswers.findIndex(answer => answer === null);
    if (unansweredQuestions !== -1) {
        const confirmSubmit = confirm(`You haven't answered all questions. Question ${unansweredQuestions + 1} is unanswered. Do you still want to submit?`);
        if (!confirmSubmit) return;
    }
    
    // Stop timer
    clearInterval(timerInterval);
    
    // Calculate score
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correctAnswer) {
            correctAnswers++;
        }
    });
    
    // Display results
    const scorePercentage = Math.round((correctAnswers / quizData.length) * 100);
    scoreEl.textContent = `${correctAnswers}/${quizData.length} (${scorePercentage}%)`;
    
    // Generate review list
    reviewListEl.innerHTML = '';
    quizData.forEach((question, index) => {
        const li = document.createElement('li');
        li.className = 'review-item';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'review-question';
        questionDiv.textContent = `${index + 1}. ${question.question}`;
        
        const answerDiv = document.createElement('div');
        answerDiv.className = 'review-answer';
        
        if (userAnswers[index] === null) {
            answerDiv.textContent = `You did not answer. Correct answer: ${question.options[question.correctAnswer]}`;
            answerDiv.classList.add('incorrect');
        } else if (userAnswers[index] === question.correctAnswer) {
            answerDiv.textContent = `You answered correctly: ${question.options[userAnswers[index]]}`;
            answerDiv.classList.add('correct');
        } else {
            answerDiv.textContent = `Your answer: ${question.options[userAnswers[index]]}. Correct answer: ${question.options[question.correctAnswer]}`;
            answerDiv.classList.add('incorrect');
        }
        
        li.appendChild(questionDiv);
        li.appendChild(answerDiv);
        reviewListEl.appendChild(li);
    });
    
    // Show results screen
    quizScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
}

function restartQuiz() {
    // Reset variables
    currentQuestionIndex = 0;
    userAnswers = Array(quizData.length).fill(null);
    timeLeft = 300;
    
    // Reset UI
    resultsScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
}