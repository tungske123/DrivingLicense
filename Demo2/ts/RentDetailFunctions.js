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
//Declarations
var modal = document.querySelector('.modal');
var modalTitle = document.querySelector('.modal-title');
var startDateElement = document.querySelector('.start-date');
var endDateElement = document.querySelector('.end-date');
var pricePerHour = 40000;
var rentBody = document.querySelector('.rent-body');
var openedModal = false;
//Functions
function openModal() {
    if (!openedModal) {
        modal.classList.add('show');
        rentBody.classList.add('blur-background');
        document.body.classList.add('modal-open');
        openedModal = true;
    }
}
function closeModal() {
    if (openedModal) {
        modal.classList.remove('show');
        rentBody.classList.remove('blur-background');
        document.body.classList.remove('modal-open');
        openedModal = false;
    }
}
function openSubmitForm() {
    var hasValidRentDate = checkValidRentDate();
    if (!hasValidRentDate) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        return;
    }
    openModal();
}
function checkValidRentDate() {
    var startDate = startDateElement.value;
    var endDate = endDateElement.value;
    return (startDate <= endDate);
}
function calculatePrice(pricePerHour) {
    var CostElement = document.querySelector('.finalcost');
    if (!checkValidRentDate()) {
        alert('Vui lòng nhập ngày và giờ phù hợp');
        CostElement.textContent = "Ch\u01B0a c\u00F3 th\u00F4ng tin";
        return;
    }
    var startDate = new Date(startDateElement.value);
    var endDate = new Date(endDateElement.value);
    var minuteDifferences = endDate.getTime() - startDate.getTime();
    var hourDifferences = minuteDifferences / (1000 * 60 * 60);
    var totalPrice = pricePerHour * hourDifferences;
    CostElement.textContent = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString() + " VNĐ";
}
//Events
startDateElement.addEventListener('change', function () {
    calculatePrice(pricePerHour);
});
endDateElement.addEventListener('change', function () {
    calculatePrice(pricePerHour);
});
var UserId = "1AD7482E-2EB6-4394-B63A-D22120241532";
var cookieValue = ".AspNetCore.Session=CfDJ8Df8HqZpRiZNhjIT0NyT1BKfi3xVmayL9ktyM3GQwjp0HSdwA74b%2BxQ3RJMyKMMesti5l9b5ptunRWeD5MbBpi%2BdyDC8dvmmRu5Vo%2BBAT3KLRaxYejMOpByH3o8yaNUpNu3aG3W%2F%2BbUrHJVBHJmjCHj%2Bkl3a4YiPKqUDl%2BCMegDF";
var registerForm = document.getElementById('RegisterForm');
registerForm.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var formData, url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                formData = new FormData(registerForm);
                url = "https://localhost:7235/api/hire/register/".concat(UserId);
                return [4 /*yield*/, fetch(url, {
                        method: 'POST',
                        body: formData
                    })];
            case 1:
                response = _a.sent();
                if (response.status !== 204) {
                    throw new Error("HTTP Error! Status code: ".concat(response.status));
                }
                alert("\u0110\u0103ng k\u00ED h\u1ECDc th\u00E0nh c\u00F4ng!");
                return [2 /*return*/];
        }
    });
}); });
