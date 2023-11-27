function fetchQuestionDetaildata() {
    const url = `https://localhost:7235/api/questions/1`;
  
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error("error");
        }
        return response.json();
    }).then(data => {
        const question = data;
        console.log(question);
    }).then(error => {
        console.error(error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetchQuestionDetaildata();
});