// Game State
const gameState = {
    currentGame: null,
    currentDifficulty: null,
    score: 0,
    totalQuestions: 10,
    currentQuestion: 0,
    answers: [],
    currentProblem: null,
    questions: []
};

const fruits = ['🍎', '🍊', '🍌', '🍇', '🍓', '🍉', '🍑', '🥝'];



// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
   }
    return shuffled;
}

// Generate questions for Kenali Nombor (Recognize Numbers)
function generateKenaliNomborQuestions(difficulty) {
    const allQuestions = [];
    let minRange, maxRange;
    
    if (difficulty === 'beginner') {
        minRange = 1;
        maxRange = 10;
    } else if (difficulty === 'intermediate') {
        minRange = 1;
        maxRange = 20;
    } else if (difficulty === 'advanced') {
       minRange = 1;
       maxRange = 50;
        
    }

     //Create 30 questions with random counts
     for (let i = 0; i < 30; i++) {
        const count = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        allQuestions.push({
            count: count,
            type: 'items'
        });
    }
    
    // Shuffle and return first 10
    const shuffled = shuffleArray(allQuestions);
    return shuffled.slice(0, 10);
}





function startDifficultySelection(gameType) {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('difficultySelection').classList.remove('hidden');
}

function startGame(gameType, difficulty = null) {
    gameState.currentGame = gameType;
    gameState.currentDifficulty = difficulty;
    gameState.score = 0;
    gameState.currentQuestion = 0;
    gameState.answers = [];
    
    // Generate questions based on game type
    if (gameType === 'kenaliNombor') {
        gameState.questions = generateKenaliNomborQuestions(difficulty);
    }
    
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('difficultySelection').classList.add('hidden');
    document.getElementById('resultsScreen').classList.add('hidden');
    document.getElementById(`${gameType}Game`).classList.remove('hidden');
    
    loadQuestion();
}

function backToMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('difficultySelection').classList.add('hidden');
    document.getElementById('resultsScreen').classList.add('hidden');
    
    const games = ['kenaliNomborGame', 'tambahGame', 'tolakGame', 'masaGame', 'wangGame', 'bentukGame'];
    games.forEach(game => {
        document.getElementById(game).classList.add('hidden');
    });
    
    gameState.currentGame = null;
    gameState.currentDifficulty = null;
}

function loadQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        showResults();
        return;
    }

    const gameType = gameState.currentGame;
    const question = gameState.questions[gameState.currentQuestion];
    
    // Update progress bar
    const percentage = (gameState.currentQuestion / gameState.totalQuestions) * 100;
    document.getElementById(`${gameType}Progress`).style.width = percentage + '%';
    document.getElementById(`${gameType}QNum`).textContent = gameState.currentQuestion + 1;
    
    switch(gameType) {
        case 'kenaliNombor':
            displayKenaliNomborQuestion(question);
            break;
        case 'tambah':
            displayTambahQuestion(question);
            break;
        case 'tolak':
            displayTolakQuestion(question);
            break;
        case 'masa':
            displayMasaQuestion(question);
            break;
        case 'wang':
            displayWangQuestion(question);
            break;
        case 'bentuk':
            displayBentukQuestion(question);
            break;
    }
}

// Display Kenali Nombor Question
function displayKenaliNomborQuestion(question) {
    const nomborVisual = document.getElementById('nomborVisual');
    nomborVisual.innerHTML = '';
    
    const selectedFruit = fruits[Math.floor(Math.random() * fruits.length)];
    
    // Create items to display
    for (let i = 0; i < question.count; i++) {
        const item = document.createElement('span');
        item.style.fontSize = '2.5em';
        item.style.marginRight = '10px';
        item.textContent = selectedFruit;
        nomborVisual.appendChild(item);
    }
    
    // Generate options with possible answers
    const options = [question.count];
    let difficulty = gameState.currentDifficulty;
    let minRange, maxRange;
    
    if (difficulty === 'beginner') {
        minRange = 1;
        maxRange = 7;
    } else if (difficulty === 'intermediate') {
        minRange = 7;
        maxRange = 12;
    } else if (difficulty === 'advanced') {
        minRange = 10;
        maxRange = 30;
    }
    
    // Generate 3 more different options
    while (options.length < 4) {
        const option = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('kenaliNomborOptions');
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkKenaliNomborAnswer(option, question.count, 'kenaliNombor');
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('kenaliNomborFeedback').innerHTML = '';
}



// Check Kenali Nombor Answer
function checkKenaliNomborAnswer(selectedAnswer, correctAnswer, gameType) {
    const feedbackElement = document.getElementById(`${gameType}Feedback`);
    const buttons = document.querySelectorAll(`#${gameType}Options .option-btn`);
    
    buttons.forEach(btn => btn.disabled = true);
    
    const isCorrect = selectedAnswer === correctAnswer;
    
    // Highlight the clicked button
    buttons.forEach(btn => {
        let btnValue = parseInt(btn.textContent);
        
        if (btnValue === selectedAnswer) {
            if (isCorrect) {
                btn.classList.add('correct');
                feedbackElement.classList.remove('wrong');
                feedbackElement.classList.add('correct');
                feedbackElement.textContent = '✓ Betul! Bagus sekali!';
                gameState.score++;
            } else {
                btn.classList.add('wrong');
                feedbackElement.classList.remove('correct');
                feedbackElement.classList.add('wrong');
                feedbackElement.textContent = `✗ Salah! Jawapan yang betul ialah ${correctAnswer}`;
            }
        }
    });
    
    document.getElementById(`${gameType}Score`).textContent = gameState.score;
    
    gameState.currentQuestion++;
    setTimeout(() => {
        loadQuestion();
    }, 2000);
}    

    
    

function showResults() {
    const gameType = gameState.currentGame;
    const difficulty = gameState.currentDifficulty;
    const score = gameState.score;
    const total = gameState.totalQuestions;
    const percentage = Math.round((score / total) * 100);
    
    document.getElementById(`${gameType}Game`).classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
    
    let emoji = '😢';
    let message = 'Cuba lagi!';
    
    if (percentage === 100) {
        emoji = '🏆';
        message = 'Sempurna! Anda bijak!';
    } else if (percentage >= 90) {
        emoji = '😄';
        message = 'Luar biasa! Sangat cemerlang!';
    } else if (percentage >= 80) {
        emoji = '😊';
        message = 'Bagus! Teruskan berlatih.';
    } else if (percentage >= 70) {
        emoji = '👍';
        message = 'Lumayan! Boleh lebih baik.';
    } else if (percentage >= 60) {
        emoji = '😐';
        message = 'Anda boleh lebih baik. Cuba lagi!';
    } else {
        emoji = '😢';
        message = 'Teruskan berlatih, pasti boleh!';
    }
    
    const gameNames = {
        'kenaliNombor': 'Kenali Nombor',
        'tambah': 'Tambah',
        'tolak': 'Tolak',
        'masa': 'Masa',
        'wang': 'Wang',
        'bentuk': 'Bentuk'
    };
    
    let difficultyName = '';
    if (difficulty === 'beginner') {
        difficultyName = ' (Bijak Matematik 1)';
    } else if (difficulty === 'intermediate') {
        difficultyName = ' (Bijak Matematik 2)';
    } else if (difficulty === 'advanced') {
        difficultyName = ' (Bijak Matematik 3&4)';
    }
    
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <div class="result-emoji">${emoji}</div>
        <div class="result-score">${score} / ${total}</div>
        <div class="result-percentage" style="font-size: 1.5em; margin: 15px 0;">${percentage}%</div>
        <div class="result-message">${message}</div>
        <div style="margin-top: 20px; font-size: 1em;">Permainan: ${gameNames[gameType]}${difficultyName}</div>
    `;
}

    window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mainMenu').classList.remove('hidden');
});
