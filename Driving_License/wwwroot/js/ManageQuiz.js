//---------------[ DELETE QUIZ ]--------------
function doDelete(id) {
    if (window.confirm('Xác nhận xóa bộ đề?')) {
        window.location = '/Quiz/Delete?quizid=' + parseInt(id);
    }
}

//---------------[ DELETE QUIZ QUESTION]--------------
var selectedQuestion = [];

function doSelected(questid) {
    if (window.confirm('Xác nhận xóa câu hỏi?')) {
        //Add to selectedQuest[]
        selectedQuestion.push(parseInt(questid));

        //Hide selected to delete
        var selectedRow = document.getElementById('quest-' + questid);
        selectedRow.remove();
    }
}
function SaveDeleteQuest(quizid) {
    for (var i = 0; i < selectedQuest.length; i++) {
        window.location = '/Quiz/DeleteQuizQuest?quizid=' + parseInt(quizid) + '&&questid=' + parseInt(selectedQuest[i]);
    }
}

//---------------[SUBMIT FORM]--------------
function submitForm() {
    var questions = [];
    // Get data from form
    $('#quiz-form').find('tr').each(function (index, element) {
        var questionId = $(element).find('input[name="Questions[' + index + '].QuestionId"]').val();
        questions.push({ QuestionId: questionId });
    });

    // Create AJAX request
    $.ajax({
        url: '/Quiz/Edit',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            QuizId: $('#QuizId').val(),  // replace with your actual QuizId field id
            Questions: questions
        }),
        success: function (result) {
            // Handle success
            console.log(result);
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}
