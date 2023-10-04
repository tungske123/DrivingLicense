function doDelete(id) {
    if (window.confirm('Xác nhận xóa?')) {
        window.location = '/Quiz/Delete?quizid=' + parseInt(id);
    }
}