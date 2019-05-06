'use strict';

// Домашнє завдання по модулю № 4

/* Задача: 
    Створити скрипт касира, який отримує список продуктів і гроші, підраховує загальну вартість продуктів,
    і в залежності від того, чи хватає грошей чи ні, повідомляє покупця про результат
*/

// база даних товарів в форматі "ім'я-продукту":"ціна за одиницю"
const products = {
    bread: 10,
    milk: 15,
    apples: 20,
    chicken: 50,
    cheese: 40,
};

// Заказ користувача у вигляді об'єкту в форматі "ім'я-продукту":"кількість одиниць"
const order = {
    bread: 2,
    milk: 2,
    apples: 1,
    cheese: 1
};

// Функція-конструктор 
function Cashier(name, productDatabase, customerMoney = 0) {
    this.name = name;
    this.productDatabase = productDatabase;
    this.customerMoney = customerMoney;

    // Метод отримання коштів від покупця
    this.setCustomerMoney = function(value) {
        this.customerMoney = value;
    };

    // Метод розраховування загальної вартості покупки
    this.countTotalPrice = function(order) {       
        let totalPrice = 0;                                 // Встановлюємо початкове значення загальної вартості покупки у розмірі 0
        
        const objectValuesOrder = Object.values(order);     // Переобразовуємо заказ користувача у масив значень
  
        const objectValuesProducts = Object.values(products);// Переобразовуємо базу товарів у масив значень

        
        for(const i of objectValuesOrder) {                 // Перебираємо масив заказу користувача
            // та множимо кількість замовленого товару на його вартість. Отриману суму додаємо до загальної вартості покупки
            totalPrice += i * objectValuesProducts[i];
        }
        return totalPrice; 
    };

    // Метод, розрахунку здачі (різниця між загальною сумою покупки і грошами покупця)  
    this.countChange = function(totalPrice) {
        totalPrice = this.countTotalPrice(order);           // Передаємо параметру метод обчислення загальної вартості покупки
        
        // Перевіряємо, чи внесені покупцем кошти не менші, ніж вартість покупки
        if(this.customerMoney >= totalPrice) {
            return this.customerMoney - totalPrice;         // Повертаємо розмір здачі
        }

        return null;                                         // Повертає у випадку недостачі внесених покупцем коштів
    }

    // Метод, який повідомляю про успішну покупку
    this.onSuccess = function(change) {
        change = this.countChange(totalPrice);              // Викликаємо метод розрахунку здачі
        console.log(`Спасибо за покупку, ваша сдача ${change}!`);
    }

    // Метод, який повідомляє про недостатність коштів для здійснення покупки
    this.onError = function() {
    console.log('Очень жаль, вам не хватает денег на покупки');
    }

    // Метод, який обнулює поле customerMoney.
    this.reset = function() {
        this.customerMoney = 0;
    }
}

// Приклад використання
const mango = new Cashier('Mango', products);


// Перевірка початкових значень полів
console.log(mango.name); // Mango
console.log(mango.productDatabase);                         // ссылка на базу данных продуктов (объект products)
console.log(mango.customerMoney); // 0


// Викликаємо метод countTotalPrice для підрахунку загальної суми
// передаючи order - список покупок користувача
const totalPrice = mango.countTotalPrice(order);

// Перевіряємо підрахунок
console.log(totalPrice); // 110


// Викликаємо setCustomerMoney для запросу грошей покунця
mango.setCustomerMoney(300);

// Перевіряємо що в полі з грошима користувача
console.log(mango.customerMoney); // 300

// Викликаємо countChange для підрахунку здачі
const change = mango.countChange();

// Перевіряємо що повернув countChange
console.log(change); // 190

// Перевіряємо результат підрахунку грошей
if(change !== null) {
    // При успішному обслуговуванні викликаємо метод onSuccess
   mango.onSuccess(change); // Спасибо за покупку, ваша сдача 190
} else {
   // При невдалому обслуговувані викликаємо метод onError   
   mango.onError(); // Очень жаль, вам не хватает денег на покупки
}

// Викликаємо reset при будь якому обслуговувані
mango.reset();

// Перевіряємо значення після reset
console.log(mango.customerMoney); // 0
