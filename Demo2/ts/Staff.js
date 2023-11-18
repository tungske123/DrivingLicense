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
var staffTabLinkList = document.querySelectorAll('.dashboard-item');
staffTabLinkList.forEach(function (tabLink) {
    tabLink.addEventListener('click', function (e) {
        e.preventDefault();
        var tabList = document.querySelectorAll('.staff-tab');
        tabList.forEach(function (tab) {
            tab.style.display = 'none';
        });
        // Remove is-active from all tab links
        staffTabLinkList.forEach(function (link) {
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
staffTabLinkList[0].click();
var staffId = "2AF899DA-324B-4FF0-BE6F-23A119C045E7";
var Staff = /** @class */ (function () {
    function Staff() {
    }
    return Staff;
}());
function renderStaffInfo(staff) {
    var FullNameInput = document.getElementById('fullname');
    var EmailElement = document.getElementById('email');
    var PhoneElement = document.getElementById('phone');
    var PasswordElement = document.getElementById('password');
    FullNameInput.value = staff.fullName;
    EmailElement.value = staff.email;
    PhoneElement.value = staff.email;
    PasswordElement.value = staff.password;
}
function fetchStaffInfoData() {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, staff, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://localhost:7235/api/staff/info/".concat(staffId);
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
                    staff = data;
                    renderStaffInfo(staff);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error: ".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateStaffInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var staffInfoForm, url, formData, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    staffInfoForm = document.getElementById('staffInfoForm');
                    url = "https://localhost:7235/api/staff/info/update/".concat(staffId);
                    formData = new FormData(staffInfoForm);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'PUT',
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    if (response.status !== 204) {
                        throw new Error("HTTP Error! Status code: ".concat(response.status));
                    }
                    alert('Lưu thông tin thành công');
                    return [4 /*yield*/, fetchStaffInfoData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var staffInfoForm = document.getElementById('staffInfoForm');
staffInfoForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                return [4 /*yield*/, updateStaffInfo()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchStaffInfoData()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
