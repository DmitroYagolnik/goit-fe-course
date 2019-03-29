// Скрипт, який імітує авторизацію користувача

'use strict';

const passwords = ['qwerty', '111qwe', '123123', 'r4nd0mp4zzw0rd'];
let attempts = 3,
    inputPassword,
    correctPassword = false;

do {
    attempts -= 1;
    inputPassword = prompt("Введіть Ваш пароль!");

    for (let element of passwords) {
        
        if (inputPassword === element) {                    // Порівняння введених користувачем значення з допустимими
            correctPassword = true;
            break;
        }        
    }

    if (attempts > 0) {                                     // Виводиться, коли кількість спроб більше 0
        const message = correctPassword
            ? "Ласкаво просимо!"
            : `Неправильний пароль, у Вас залишилось ${attempts} спроб!`;
    
        alert(message);

    } else {                                                // Виводиться, коли допустимі спроби закінчились
        alert("У Вас закінчилися спроби, акаунт заблоковано!");
    }


} while (inputPassword !== null && attempts > 0 && !correctPassword);

if (inputPassword === null) {                                // Виводиться коли користувач натиснув "Cancel"
    alert("Введення паролю було припинено користувачем!");
};