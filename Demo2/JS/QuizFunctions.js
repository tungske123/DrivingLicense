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