// Скрипт по підрахунку сум введених користувачем чисел

'use strict';

const numbers = [];
let userInput,
    validInput,
    total = 0;

            // Створення масиву з введених користувачем чисел
do {
    userInput = prompt("Введіть число: ");

    if (userInput === null) {                   // Завершення формування масиву при натисненні на Cancel
        break
    }

    validInput = Number(userInput);

    if (Number.isNaN(validInput)) {             // Перевірка на правильність введенних значень
        alert("Вводити можна лише числа!!!")
            
    } else {
        numbers.push(validInput);
    }

} while (userInput !== null);

console.log(numbers);

        // Підрахунок суми введених користувачем цифр
if (numbers.length > 0) {                   // Перевірка на те, чи були введені значення

    for (let element of numbers) {
        total += element;
    }

    alert(`Загальна сума введених вами чисел дорівнює ${total}`);

} 
else {
    alert("Підрахунок здійснити не можливо, так як Ви не ввели числа!");
}
