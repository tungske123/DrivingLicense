document.getElementById('create').addEventListener('click', function () {
    // Get the table body
    var tbody = document.getElementById('answerTableBody');

    // Create a new row and its cells
    var tr = document.createElement('tr');
    tr.className = " border-b dark:border-gray-700 font-bold";
    var td1 = document.createElement('td');
    td1.className = "w-4 p-4"
    var td2 = document.createElement('td');
    td2.className = "px-6 py-3 answerID";
    var td3 = document.createElement('td');
    td3.className = "px-6 py-3";
    var td5 = document.createElement('td');
    td5.className = "px-0.5 py-3";

    // Set the contents of the cells
    td1.innerHTML = '<input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">';
    td2.textContent = tbody.getElementsByTagName('tr').length + 1;
    td3.innerHTML = '<input type="text" required="" style="width: 90%;" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">';
    td5.innerHTML = '<button type="button" data-modal-target="deleteAnswerModal" data-modal-toggle="deleteAnswerModal" id="deleteAnswer" class="inline-flex items-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><svg class="w-4 h-4 mr-2" viewbox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" /></svg>Xóa</button>';

    // Append the cells to the row
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td5);

    // Append the row to the table body
    tbody.appendChild(tr);
    tr.querySelector('[data-modal-target="deleteAnswerModal"]').addEventListener('click', function () {
        // Remove the row from the table
        tr.parentNode.removeChild(tr);

        // Update the row numbers
        var rows = tbody.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            rows[i].getElementsByTagName('td')[1].textContent = i + 1;
        }
    });
});



///DELETE
// Add the event listener when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get all the delete buttons
    var deleteButtons = document.querySelectorAll('[data-modal-target="deleteAnswerModal"]');

    // Add a click event listener to each delete button
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Get the row that the button is in
            var tr = this.closest('tr');

            // Remove the row from the table
            tr.parentNode.removeChild(tr);
        });
    });
});

async function fetchQuestionDetaildata() {
    try {
        const questionid = document.getElementById('questionid').textContent;
        const url = `https://localhost:7235/api/questions/${questionid}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        const data = await response.json();
        const question = data;
        console.log(question);
        LoadQuestionData(question);
    } catch (error) {
        console.error(error);
    }
}


async function LoadQuestionData(question) {
    console.log(question.questionText);
    
    // if (question.questionText === null) {
    //     tinymce.get('questionTextMCE').setContent('');
    // } else {
    // }
    
    document.getElementById('questionTextMCE').value = question.questionText;
    let template = document.getElementById('templateAnswerBody');
    let answerTableBody = document.getElementById('answerTableBody');
    answerTableBody.innerHTML = '';

    // Assuming question.answers is an array of answers
    for (const answer of question.answers) {
        let clone = document.importNode(template.content, true);
        let cells = clone.querySelectorAll('td');
        cells[1].textContent = answer.answerId;
        clone.querySelector('.answerInputTemplate').value = answer.answerText;
        answerTableBody.appendChild(clone);
    }
    if(question.questionImage !== null){
        document.getElementById('questionImage').innerHTML = `<img src="/img/question/A1/${question.questionImage}">`;
    }
    

    if (question.isCritical === false) {
        document.getElementById('isCritical').value = 'No';
    } else {
        document.getElementById('isCritical').value = 'Yes';
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    await fetchQuestionDetaildata();
});