function preventContextMenu(e) {
    e.preventDefault();
}

// Обработчик события mousedown
function preventMouseDown(e) {
    e.preventDefault();
}

//Encrypt password
// const Password = "kuropatochka";
// const encryptedPassword = btoa(Password);
// console.log(encryptedPassword);

const encryptedPassword = "a3Vyb3BhdG9jaGth";

function decryptPassword(encryptedPassword){
    return atob(encryptedPassword);
}

const decryptedPassword = decryptPassword(encryptedPassword);

//Функция для проверки пароля и отключения запрета копирования
function checkPassword() {
    const enteredPassword = prompt("Введите пароль для разблокировки:");

    if (enteredPassword === decryptedPassword) {
        // Разрешаем выделение текста и восстанавливаем контекстное меню правой кнопки мыши
        // Отключаем обработчик события keydown
        document.onkeydown = null;
        document.removeEventListener("contextmenu", preventContextMenu);
        document.removeEventListener('mousedown', preventMouseDown);
        clearInterval(Interval);
    } else {
        alert("Неверный пароль. Попробуйте еще раз.");
    }
}
window.addEventListener("load", checkPassword);

const Interval = setInterval(()=> {
    const emptyClipboard = () => navigator.clipboard.writeText('');
    emptyClipboard();
}, 100);


document.addEventListener("contextmenu", preventContextMenu);

document.onkeydown = function (e) {
    if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 86)) {
        e.preventDefault();
    }
};

// Добавляем обработчик события mousedown
document.addEventListener('mousedown', preventMouseDown);