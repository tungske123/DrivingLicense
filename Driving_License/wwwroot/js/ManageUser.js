//---------------[ DELETE USER ]--------------
function doDelete(id) {
    if (window.confirm('Xác nhận xóa hồ sơ này?')) {
        window.location = '/User/Delete?userid=' + id;
    }
}