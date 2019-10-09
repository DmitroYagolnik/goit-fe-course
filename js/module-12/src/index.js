import './style.css';                                                           //  Імпортуємо стилі
import '@babel/polyfill';                                                       //  Імпортуємо поліфіл

                                                                                //  Імпортуємо шаблони:
import messageTpl from './templates/message.hbs';                               //      Шаблон про помилку під час заповнення поля форми
import websiteIconTpl from './templates/website_icon.hbs';                      //      Шаблон обраної користувачем веб-сторінки

import { fetchURLData } from './servises/api.js';

import * as storage from './servises/storage.js';                               //  Імпортуємо localStorage

const addURLForm = document.querySelector('.add_url-form');                     //  Форма для введення URL обраної сторінки
const placeMessage = document.querySelector('.place_message');                  //  Місце для виведення на дисплей повідомлення
const iconsArticlesWrapper = document.querySelector('.icons_articles-wrapper'); //  Місце для відображення обраних веб-сторінок
const userInputURL = addURLForm.querySelector('#input_add_url');

const saveURL = [];                                                             //  Масив збережених користувачем адреси веб-сторінок

const message = {                                                               //  Повідомлення, які виводяться на дисплей
    invalidError: 'Неправильний формат введення адреси веб-сторінки! Вона повинна починатися з "https://" або "http://", та містити лише латинські літери',
    blankFormError: 'Ви не ввели адресу веб-сторінки!',
    getDataError: 'Вибачте, але з технічних причин нашому сайту не вдалося отримати інформацію про введену Вами сторінку. Тому вона буде збережена у тому вигляді, в якому ви її ввели в поле',
    savedEarlierError: 'Вибачте, але дана сторінка вже була збережена раніше!'
}

const persistedSaveURL = storage.get();                                         //  Отримуємо збережені дані з localStorage

if (persistedSaveURL) {                                                         //  Якщо вони є:
    saveURL.push(...persistedSaveURL);                                          //      перезаписуємо масив збережени адрес веб-сторінок
    renderSaveURLItem(saveURL);                                                 //      рендеремо іконки збережених сторінок
}

addURLForm.addEventListener('submit', submitForm);                              //  Ставимо слугач на подію 'submit', по всій веб-сторінці
iconsArticlesWrapper.addEventListener('click', hanelRemoveItemClick);

//_______________________________________________________________________________________________________________________________
//==================================================  Функції ===================================================================

/**
 * Функція спрацьовує під час відправки будь-якої форми на даній веб-сторінці.
 * Вона визначає на якій формі відбувся "submit", і відповідно до цього запускає певний функціонал.
 */
function submitForm(event) {
    event.preventDefault();                                                     //  Виключаємо дії браузера за замовчуванням
    removeChildrenElem (placeMessage);                                          //  Якщо раніше були повідомлення на дисплеї - видаляємо їх
    const userURL = userInputURL.value                                          //  Отримуємо введене користувачем значення
    
    const correctURL = testUserURL(userURL);                                    //  Тестуємо отриманий від користувача URL

    if (!correctURL.isCorrect) {                                                //  Якщо тест не був пройдений:
        renderMassege(correctURL.causeError);                                   //      виводимо на дисплей причину
        return;
    }

    handleFetch(userURL);                                                       //  Отримуємо інформацію про введений веб-сайт

    addURLForm.reset();                                                         //  Очищуємо поле введення URL
}


function hanelRemoveItemClick(event) {

    const targetClick = event.target;
    if (targetClick.nodeName === 'BUTTON') {
        const articleIcons = targetClick.parentNode;                            //  Збережена веб-сторінка, по якій відбувся 'click'
        const articleHref = articleIcons.lastElementChild.getAttribute('href'); //  Силка на веб-сторінку
        deleteItemFromMemory(articleHref);                                      //  Видаляємо елемент з масиву та localStorage

        articleIcons.remove();                                                  //  Видаляємо іконку з DOM-вузла
    }
    return;
}

/**
 * Дана функція перевіряє отриманий від користувача URL на валідність та чи не була раніше збережена дана сторінка.
 * Вона повертає об'єкт у якому зазначається результат перевірки, та (за необхідності) причини непроходження перевірки. 
 * @param {str} URL -   URL який ввів користувач в форму
 */
function testUserURL(URL) {

    const resultTest = {};

    if (URL.length === 0) {                                                      //  Перевіряємо, чи це не пуста строка        
        resultTest.isCorrect = false;                                            //  Повідомляємо, що даний URL не пройшов перевірку
        resultTest.causeError = message.blankFormError;                          //  Записуємо причину
        return resultTest;
    }

    const validURL = validateURL(URL);                                           //  Перевіряємо введений URL на валідність
    
    if (!validURL) {                                                             //  Якщо введений користувачем URL не пройшов валідацію:
        resultTest.isCorrect = false;                                            //  Повідомляємо, що даний URL не пройшов перевірку
        resultTest.causeError = message.invalidError;                            //  Записуємо причину
        return resultTest;
    }

    const doubleURL = searchSavedEarlierURL(URL);                                //  Перевіряємо, чи не був збережений даний URL раніше
    if (doubleURL) {
        resultTest.isCorrect = false;                                            //  Повідомляємо, що даний URL не пройшов перевірку
        resultTest.causeError = message.savedEarlierError;                       //  Записуємо причину
        return resultTest;
    }

    resultTest.isCorrect = true;                                                 //  Якщо URL пройшов всі перевірки, то зазначаємо це
    return resultTest;

}

/**
 * Дана функція перевіряє, чи була раніше збережена дана сторінка відвідувачем сайту
 * @param {str} URL -   URL який ввів користувач в форму
 */
function searchSavedEarlierURL (URL) {
    const savedEarlierURL = saveURL.find(elem => elem.url === URL);
    return savedEarlierURL ? true : false;
}

/**
 * Дана функція перевіряє, чи правильно був введений URL веб-сторінки
 * @param {string} checkURL  -   URL, який необхідно перевірити на валідність
 */
function validateURL(checkURL) {
    const patern = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;   //  Регулярний вираз для перевірки валідності URL
    const validURL = patern.test(checkURL);                                         //  Тестуємо на валідність
    return validURL
}

/**
 * Дана функція отримує інформацію про введений користувачем сайт за допомогою ресурсу api.linkpreview.net.
 * У випадку якщо не має змогу отримати інформацію за допомогою зазначеного ресурсу, тоді створюємо її за замовчуванням.
 * Потім зберігає адресу та рендерить силки в контейнер.
 * @param {str} URL -   URL який ввів користувач в форму
 */
function handleFetch(URL) {

    fetchURLData(URL)
        .then(dataURL => {

        if (!dataURL) {                                                         //  Якщо не вдалося отримати інформацію по API:
            const defaultURL = {                                                //      Створюємо інформацію про неї, в якій:
                successfulDataURL: false,                                       //      -додаємо ключ про невдале отримання інформації по URL
                url: URL,                                                       //      -записуємо адресу, яка була введена користувачем
                title: URL
            }
            
            saveURL.push(defaultURL);                                           //  Зберігаємо інформацію про сайт у масив
            storage.set(saveURL);                                               //  Зберігаємо інформацію про сайт у localStorage

            renderSaveURLItem(defaultURL);                                      //  Створюємо іконку сайту за-замовчуванням
            renderMassege(message.getDataError);                                //  Повідомлення про невдалу спробу отримати інформацію
            return
        }                                                                       //  Якщо вдалося отримати інформацію по API про веб-сторінку:
        
        dataURL.successfulDataURL = true;                                       //  Додаємо ключ про успішне отримання інформації по URL

        saveURL.push(dataURL);                                                  //  Зберігаємо інформацію про сайт у масив
        storage.set(saveURL);                                                   //  Зберігаємо інформацію про сайт у localStorage

        renderSaveURLItem(dataURL);                                             //  Рендеримо іконку веб-сторінки
    })
} 

/**
 * Функція перевіряє наявність дочірніх елементів DOM-вузла, та при їх присутності - видаляє
 * @param {*} parentNode - Батьківський DOM-вузол, у якому потрібно видалити всі дочірні елементи
 */
function removeChildrenElem (parentNode) {

    const childrenElem = parentNode.children;                                   //  Обираємо всі дочірні елементи DOM-вузола

    if (childrenElem.length > 1) {                                              //  Якщо вони є і їх більше чим 1 тоді:
      const arrayChildrenElem = Array.from(childrenElem);                       //      значення з псевдомасиву перетворюємо в масив
      arrayChildrenElem.reduce((acc, elem) => acc + elem.remove(), '');         //      проходимо по масиву, видаляючи кожний його елемент
      return
    }

    if (childrenElem.length === 1) {                                            //  Якщо DOM-вузол має лише один дочірній елемент, тоді:
        parentNode.firstElementChild.remove();                                  //      вибираємо його та видаляємо
        return
    }

    return;                                                                     //  Якщо дочірніх елементів не має - виходими
}

/**
 * 
 * @param {str} massege - повідомлення, яке необхідно вивести на дисплей
 */
function renderMassege(massege) {

    createTemplate(                                                             //  Рендерим по шаблону:
        messageTpl,                                                             //  - підключаємо шаблон-повідомлення
        { messageText: massege },                                               //  - текст повідомлення відповідно аргумента функції
        placeMessage                                                            //  - вибираємо місце рендерингу для повідомлень
    );
}

/**
 * Дана функція рендерить збережені користувачем адреси веб-сторінок
 * @param {obj or arr} saveUserURL -    Збережена адреса веб-сторінки відвідувача сайту 
 */
function renderSaveURLItem(saveUserURL) {
    createTemplate(websiteIconTpl, saveUserURL, iconsArticlesWrapper);
}

/**
 * Дана функція рендерить на дисплей шаблони
 * @param {*} template              - Шаблон, який буде застосовуватися
 * @param {arr or obj} optionElem   - Елементи, які вставляються в шаблон
 * @param {*} parentContainer       - Місце в DOM-вузлі, для рендерингу
 */
function createTemplate(template, optionElem, parentContainer) {

    let markup;                                                                 //  HTML-розмітка згідно шаблону
  
    if (Array.isArray(optionElem)) {                                            //  Якщо опції - масив тоді: 
      markup = optionElem                                                       //      створюючи розмітку, перебираємо кожний його елемент
        .reduceRight((markup, item) => markup + template(item), '');            //  Перебираємо масив з останнього елементу до першого

    } else {                                                                    //  Якщо ні:
        markup = template(optionElem)                                           //      в шабон передаємо лише параметри об'єкта
    }
    
    parentContainer.insertAdjacentHTML('afterbegin', markup);                   //  Записуємо отриману HTML-розмітку в визначений DOM-вузл
}

/**
 * Дана функція видаляє збережену відвідувачем сайту веб-адресу з масиву "saveURL" та з localStorage
 * @param {str} itemURL -   адреса, на яку посилається силка
 */
function deleteItemFromMemory(itemURL) {
    const indexItem = saveURL
        .indexOf(saveURL                                                        //  Отримуємо індекс елементу шляхом:
            .find(elem => elem.url === itemURL)                                 //      пошуку в кожного об'єкту ключа з значенням itemURL
        );

    saveURL.splice(indexItem, 1);                                               //  Видаляємо обраний елемент з масиву "saveURL"

    storage.set(saveURL);                                                       //  Оновлюємо дані localStorage
}