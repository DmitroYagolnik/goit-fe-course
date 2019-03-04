'use strict';

const adminLogin = 'admin';
const adminPassword = 'm4ngo1zh4ackz0r';

const loginInput = prompt("Пожалуйста введите Ваш логин!");

const validInput = loginInput !== null; // Перевіряємо введення на натиснення "Отмена" або "Esc"
const correctUser = loginInput === adminLogin; // Перевіряємо відповідність введеного логіна та зареєстрованого користувача


if (validInput) {
    
    if (correctUser) {
        const userPassword = prompt(`Уважаемый ${adminLogin} введите Ваш пароль!`)
        const validPassword = userPassword !== null; //  Перевіряємо введення на натиснення "Отмена" або "Esc"
        
        if (validPassword) {
            const correctPassword = userPassword === adminPassword; // Перевіряємо чи був правильно введений пароль

            if (correctPassword) {
                alert('Добро пожаловать!');
            } else {
                alert('Доступ запрещен, неверный пароль!');
            }

        } else {
            alert('Отменено пользователем!'); // Якщо при введенні паролю було натисненне "Отмена" або "Esc" - виводиться у вікно дана строка
        }


    } else {
        alert('Доступ запрещен, неверный логин!') // При введені логіну, якого не має в системі буде виведене у модальне вікно дана строка
    }
} else {
    alert('Отменено пользователем!'); // Якщо при введенні логіну було натисненне "Отмена" або "Esc" - виводиться у вікно дана строка
}