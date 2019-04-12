'use strict';

// Скрипт, для створення нового логіну, що містить від 4 до 16 символів

const logins = ["Mango", "robotGoogles", "Poly", "Aj4x1sBozz", "qwerty123"];

// Перевірка на те, щи містить логін визначену кількість символів
const isLoginValid = function(login) {
  const validLogin = login.length >= 4 && login.length <= 16;
  return validLogin;
};

// Перевірка на те, чи не був використаний даний логін раніше
const isLoginUnique = function(allLogins, login) {
    const uniqueLogin = !allLogins.includes(login);
    return uniqueLogin;
};

// Додавання нового логіну в масив, або відмова в цьому з вказанням причини
const addLogin = function(allLogins, login) {
    
    let message;

    const validLogin = isLoginValid(login);

    if (validLogin) {

        const uniqueLogin = isLoginUnique(allLogins, login);

        if (uniqueLogin) {
            logins.push(login);
            message = 'Логин успешно добавлен!';
        
        } else {
            message = 'Такой логин уже используется!';
        }

    } else {
        message = 'Ошибка! Логин должен быть от 4 до 16 символов';
    }

    console.log(message);

};

// Вызовы функции для проверки
addLogin(logins, 'Ajax'); // 'Логин успешно добавлен!'
addLogin(logins, 'robotGoogles'); // 'Такой логин уже используется!'
addLogin(logins, 'Zod'); // 'Ошибка! Логин должен быть от 4 до 16 символов'
addLogin(logins, 'jqueryisextremelyfast'); // 'Ошибка! Логин должен быть от 4 до 16 символов'