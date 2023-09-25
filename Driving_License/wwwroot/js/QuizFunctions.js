// const quizButtons = document.querySelector('.question_button');
// for (const quizButton of quizButtons) {
//     var quesCnt = parseInt(quizButton.getAttribute("cnt"));
//     if (quesCnt) {
        
//     }
// }

//For the timer
let timer;

const savedTimeLeft = sessionStorage.getItem("quizTimer");
let timeLeft = savedTimeLeft ? parseInt(savedTimeLeft) : 60;

function saveTimerState() {
    sessionStorage.setItem("quizTimer", timeLeft.toString());
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
function startTimer() {
    timer = setInterval(() => {
        const timeElement = document.getElementById("time");
        timeElement.textContent = formatTime(timeLeft);
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            submitQuiz();
        }
        saveTimerState();
    }, 1000);
}
function submitQuiz() {
    alert('Quiz submitted');
}
document.querySelector('.submit-button').addEventListener('click', function(){
    clearInterval(timer);
    submitQuiz();
});
// startTimer();
if (savedTimeLeft) {
    startTimer();
}


//For saving quiz
async function SaveQuestion() {
    try {
        const response = await fetch('/Quiz/SaveQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },  
            body: JSON.stringify()
        });
        if (!response.ok) {
            throw new Error('Network response is not Ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error: ' + error);
    }
}