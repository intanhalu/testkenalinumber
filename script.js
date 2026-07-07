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

// Soalan khas untuk advanced
const advancedQuestions = [
    { text: "Antara berikut, nombor manakah yang paling besar?", options: [25, 17, 32, 28], answer: 32 },
    { text: "Antara berikut, nombor manakah yang paling kecil?", options: [14, 9, 22, 17], answer: 9 },
    { text: "Antara berikut, nombor manakah yang paling besar?", options: [41, 38, 45, 40], answer: 45 },
    { text: "Tuliskan 26 dalam perkataan.", options: ["Dua puluh empat", "Dua puluh enam", "Dua puluh sembilan", "Dua puluh lapan"], answer: "Dua puluh enam" },
    { text: "Tuliskan 35 dalam perkataan.", options: ["Tiga puluh empat", "Tiga puluh lima", "Tiga puluh enam", "Tiga puluh tiga"], answer: "Tiga puluh lima" }
];

// Generate questions untuk Kenali Nombor
function generateKenaliNomborQuestions(difficulty) {
    if (difficulty === 'advanced') {
        return shuffleArray(advancedQuestions).slice(0, 10);
    }

    const allQuestions = [];
    let minRange, maxRange;

    if (difficulty === 'beginner') {
        minRange = 1; maxRange = 10;
    } else if (difficulty === 'intermediate') {
        minRange = 1; maxRange = 20;
    }

    for (let i = 0; i < 30; i++) {
        const count = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        allQuestions.push({ count: count, type: 'items' });
    }

    return shuffleArray(allQuestions).slice(0, 10);
}

// Display Kenali Nombor Question
function displayKenaliNomborQuestion(question) {
    const nomborVisual = document.getElementById('nomborVisual');
    const questionText = document.getElementById('kenaliNomborQuestion');
    const optionsContainer = document.getElementById('kenaliNomborOptions');
    const feedback = document.getElementById('kenaliNomborFeedback');

    nomborVisual.innerHTML = '';
    optionsContainer.innerHTML = '';
    feedback.textContent = '';

    // Advanced question (ada text + options)
    if (question.text) {
        questionText.textContent = question.text;
        question.options.forEach(opt => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = opt;
            button.onclick = () => checkKenaliNomborAnswer(opt, question.answer, 'kenaliNombor');
            optionsContainer.appendChild(button);
        });
    } else {
        // Beginner/intermediate (kira buah)
        const selectedFruit = fruits[Math.floor(Math.random() * fruits.length)];
        for (let i = 0; i < question.count; i++) {
            const item = document.createElement('span');
            item.style.fontSize = '2.5em';
            item.style.marginRight = '10px';
            item.textContent = selectedFruit;
            nomborVisual.appendChild(item);
        }

        questionText.textContent = "Berapa banyak benda di atas?";

        const options = [question.count];
        let minRange = 1, maxRange = 10;
        if (gameState.currentDifficulty === 'intermediate') {
            minRange = 5; maxRange = 20;
        }

        while (options.length < 4) {
            const option = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
            if (!options.includes(option)) options.push(option);
        }

        shuffleArray(options).forEach(opt => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = opt;
            button.onclick = () => checkKenaliNomborAnswer(opt, question.count, 'kenaliNombor');
            optionsContainer.appendChild(button);
        });
    }
}

// Check Kenali Nombor Answer
function checkKenaliNomborAnswer(selectedAnswer, correctAnswer, gameType) {
    const feedbackElement = document.getElementById(`${gameType}Feedback`);
    const buttons = document.querySelectorAll(`#${gameType}Options .option-btn`);

    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedAnswer === correctAnswer;

    buttons.forEach(btn => {
        if (btn.textContent == selectedAnswer) {
            if (isCorrect) {
                btn.classList.add('correct');
                feedbackElement.textContent = '✓ Betul! Bagus sekali!';
                gameState.score++;
            } else {
                btn.classList.add('wrong');
                feedbackElement.textContent = `✗ Salah! Jawapan yang betul ialah ${correctAnswer}`;
            }
        }
    });

    document.getElementById(`${gameType}Score`).textContent = gameState.score;
    gameState.currentQuestion++;
    setTimeout(() => loadQuestion(), 2000);
}
