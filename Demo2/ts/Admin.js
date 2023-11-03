var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var adminTabLinkList = document.querySelectorAll('.dashboard-item');
adminTabLinkList.forEach(function (tabLink) {
    tabLink.addEventListener('click', function (e) {
        e.preventDefault();
        var tabList = document.querySelectorAll('.admin-tab');
        tabList.forEach(function (tab) {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        adminTabLinkList.forEach(function (link) {
            link.classList.remove('is-active');
        });
        // Add is-active to this current tab link
        tabLink.classList.add('is-active');
        //Get id target for each link
        var linkAnchor = tabLink.querySelector('a');
        if (!linkAnchor) {
            return;
        }
        var target = linkAnchor.getAttribute('href');
        if (target === "/Home") {
            window.location.href = "/Home";
            return;
        }
        //Show the tab
        if (target) {
            var tab = document.querySelector(target);
            if (tab) {
                tab.style.display = 'block';
            }
        }
    });
});
adminTabLinkList[0].click();
var RentChartData = /** @class */ (function () {
    function RentChartData() {
    }
    return RentChartData;
}());
function fetchRentChartData() {
    var url = "https://localhost:7235/api/admin/rent/data";
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("HTTP Error! Status code: ".concat(response.status));
        }
        return response.json();
    }).then(function (data) {
        console.log(data);
        renderRentChartData(data);
    }).catch(function (error) {
        console.error(error);
    });
}
function getChartDateData(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    return "".concat(day, "-").concat(month);
}
//.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
function renderRentChartData(dataList) {
    if (dataList.length === 0) {
        console.log('No rent chart data');
        return;
    }
    var chartDataList = document.getElementById('chartdatalist');
    chartDataList.innerHTML = "";
    var chartDateList = document.getElementById('chartdatelist');
    chartDateList.innerHTML = "";
    var totalMoneyElement = document.getElementById('totalMoney');
    var sum = 0;
    dataList.forEach(function (data) {
        var li = document.createElement('li');
        li.setAttribute('hidden', 'true');
        li.className = 'chartdata';
        li.textContent = data.total.toString();
        chartDataList.appendChild(li);
        var dateLi = document.createElement('li');
        dateLi.setAttribute('hiden', 'true');
        dateLi.className = "chartdate";
        dateLi.textContent = getChartDateData(new Date(data.date));
        chartDateList.appendChild(dateLi);
        sum += data.total;
    });
    totalMoneyElement.textContent = sum.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}
fetchRentChartData();
function fetchAdminInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://localhost:7235/api/admin/info/".concat(adminId);
                    return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var adminInfoForm = document.getElementById('adminInfoForm');
var adminId = "";
adminInfoForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var password, repass, url, formData, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                password = document.getElementById('password').value;
                repass = document.getElementById('repass').value;
                if (password !== repass) {
                    alert('Vui lòng xác nhận mật khẩu chính xác');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                url = "https://localhost:7235/api/admin/info/update/".concat(adminId);
                formData = new FormData(adminInfoForm);
                return [4 /*yield*/, fetch(url, {
                        method: 'PUT',
                        body: formData
                    })];
            case 2:
                response = _a.sent();
                if (response.status !== 204) {
                    throw new Error("HTTP Error! Status code: ".concat(response.status));
                }
                alert('Lưu thành công');
                fetchAdminInfo();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchAdminInfo()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
