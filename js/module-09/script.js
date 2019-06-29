'use strict';
/*
Создайте скрипт секундомера.  
По ссылке можно посмотреть пример выбрав Stopwatch http://www.online-stopwatch.com/full-screen-stopwatch/

Добавьте следующий функционал:

- При нажатии на кнопку button.js-start, запускается таймер, который считает время 
    со старта и до текущего момента времени, обновляя содержимое элемента p.js-time 
    новым значение времени в формате xx:xx.x (минуты:секунды.сотни_миллисекунд).
    
    🔔 Подсказка: так как необходимо отображать только сотни миллисекунд, интервал
    достаточно повторять не чаще чем 1 раз в 100 мс.
    
  - Когда секундомер запущен, текст кнопки button.js-start меняется на 'Pause', 
  а функционал при клике превращается в оставновку секундомера без сброса 
    значений времени.
    
    🔔 Подсказка: вам понадобится буль который описывает состояние таймера активен/неактивен.
    
  - Если секундомер находится в состоянии паузы, текст на кнопке button.js-start
  меняется на 'Continue'. При следующем клике в нее, продолжается отсчет времени, 
    а текст меняется на 'Pause'. То есть если во время нажатия 'Pause' прошло 6 секунд 
    со старта, при нажатии 'Continue' 10 секунд спустя, секундомер продолжит отсчет времени 
    с 6 секунд, а не с 16. 
    
    🔔 Подсказка: сохраните время секундомера на момент паузы и используйте его 
    при рассчете текущего времени после возобновления таймера отнимая
    это значение от времени запуска таймера.
    
    - Если секундомер находится в активном состоянии или в состоянии паузы, кнопка 
    button.js-reset должна быть активна (на нее можно кликнуть), в противном случае
    disabled. Функционал при клике - остановка таймера и сброс всех полей в исходное состояние.
    
    - Функционал кнопки button.js-take-lap при клике - сохранение текущего времени секундомера 
    в массив и добавление в ul.js-laps нового li с сохраненным временем в формате xx:xx.x
    */
   //=================================================================================
  
   /**
    * Створюємо клас секундоміра
    */
class Timer {
  constructor() {
    this.parent = parent;
    this.startTime = null;
    this.deltaTime = null;
    this.timerId = null;
    this.isActive = false;
  }
  
  start () {

    if (!this.isActive) {
      this.isActive = true;
      this.startTime = Date.now() - this.deltaTime;           // Для того, щоб секундомір вів відлік лише активного часу

      this.timerId = setInterval(() => {
        this.currentTime = Date.now();                        // Поточний (нинішній) час
        this.deltaTime = this.currentTime - this.startTime;   // Різниця від поточного часу, та часу роботи секундоміра

        const time = new Date(this.deltaTime);
        
        updateClockface(time);
      }, 100);
    }
  }

  pause() {

    clearInterval(this.timerId);
    this.timerId = null;
    this.isActive = false;
    
  }

  lap() {
    createNewLi(getClockfaceValue());           // Записуємо значення секундоміра в тег <ul>
  }

  reset() {
    if (this.isActive) {                        // Якщо секундомір в активному стані, спочатку ставимо його на паузу
      this.pause();
    }
    
    this.deltaTime = null;                      // Обнуляємо показання дисплея секундоміра
    const time = new Date(this.deltaTime);     
    updateClockface(time);
  }
}

/**
 * Функція для addEventListener, в залежності від того, на якому елементу відбувся 'click' -
 * буде спрацьовувати відповідна функція 
 * @param {*} event 
 */
function clickBtn(event) {
  
  console.log(event.target);
  if(event.target === stopwatch.querySelector('.js-start')) {
    removeBtnAttributeDisabled();                                           // Робимо всі кнопки активними
    changeBtnClass(event.target, 'js-start', 'js-pause', 'Pause');
    
    newTimer.start();
    return;
  }
  
  if(event.target === stopwatch.querySelector('.js-pause')) {
    changeBtnClass(event.target, 'js-pause', 'js-continue', 'Continue');
    
    newTimer.pause();
    return;
  }
  
  if(event.target === stopwatch.querySelector('.js-continue')) {
    changeBtnClass(event.target, 'js-continue', 'js-pause', 'Pause');
    
    newTimer.start();
    return;
  }
  
  if(event.target === takeLapBtn) {
    newTimer.lap();
  }
  
  if(event.target === resetBtn) {
    newTimer.reset();
    removeAllLi();                              // Видаляємо збережений раніше час (теги <li>)
    BtnDefault();                               // Встановлюємо початкові налаштування кнопок секундоміра
  }
  
  return;
}

/**
 * Функція яка змінює назву класу та напис на кнопці
 * @param {Object} elem       - Елемент, на якому відбудеться зміна
 * @param {String} oldClass   - Назва класу, яку необхідно видалити
 * @param {String} newClass   - Назва класу, яку необхідно встановити
 * @param {String} textBtn    - Текст, який буде відображатися на кнопці
 */
function changeBtnClass (elem, oldClass, newClass, textBtn) {
  elem.classList.remove(oldClass);
  elem.classList.add(newClass);
  elem.textContent = textBtn;
}

/**
 * Функція яка переформутовує час роботи секундоміра, в формат "хвилини:секунди.мілісекунди"
 * та обновлює дисплей секундоміра відповідно до цього формату
 * @param {object} stopwatchTime - час, під час якого секундомір був в активному стані
 */
function updateClockface(stopwatchTime) {
  let min = stopwatchTime.getMinutes();
  min < 10 ? min = '0' + min : min.toString();
  
  let sec = stopwatchTime.getSeconds();
  sec < 10 ? sec = '0' + sec : sec.toString();
  
  let ms = Math.floor(stopwatchTime.getMilliseconds() / 100);
  
  let stopwatchDisplay = `${min}:${sec}.${ms}`;
  
  stopwatchText.textContent = stopwatchDisplay;
}

/**
 * Функція для пошуку значення дисплея секундоміра
 */
function getClockfaceValue() {
  return stopwatchText.textContent;
}

/**
 * Функція для створення нового тегу <li>, запису в нього показання секундоміра та встановлення його в тег <ul>
//  * @param {object} stopwatchTime  - Час дисплея на секундомірі
 */
function createNewLi(stopwatchTime) {
  const elem = document.createElement('li');
  elem.textContent = stopwatchTime;
  laps.append(elem)
  return elem;
}

/**
 * Функція для видалення всіх збережених показань секундоміра (видаляємо всі <li> з <ul>)
 */
function removeAllLi() {
  laps.textContent = '';
}

/**
 * Функція для створення неактивних стану кнопок
 */
function addBtnAttributeDisabled() {
  takeLapBtn.setAttribute('disabled', 'disabled');
  resetBtn.setAttribute('disabled', 'disabled');
}

/**
 * Функція для видалення неактивного стану кнопок
 */
function removeBtnAttributeDisabled() {
  takeLapBtn.removeAttribute('disabled');
  resetBtn.removeAttribute('disabled');
}

/**
 * Функція для встановлення початкових налаштувань кнопок секундоміра
 */
function BtnDefault() {
  // Шукаємо кнопки, клас який необхідно встановити на початковий
  const findBtnContinue = stopwatch.querySelector('.js-continue');
  const findBtnPause = stopwatch.querySelector('.js-pause');
  
  if (findBtnPause) {
    changeBtnClass (findBtnPause, 'js-pause', 'js-start', 'Start');
  }
  
  if ( findBtnContinue) {
    changeBtnClass(findBtnContinue, 'js-continue', 'js-start', 'Start');
  }

  // Переводимо кнопки takeLapBtn та resetBtn в неактивний стан
  addBtnAttributeDisabled()
}

//____________________________________________________________________

          //  Створюємо новий секундомір
const newTimer = new Timer();

          //  Знаходимо DOM-елементи
const stopwatch = document.querySelector('.stopwatch');
const stopwatchText = stopwatch.querySelector('.js-time');
const takeLapBtn = stopwatch.querySelector('.js-take-lap');
const resetBtn = stopwatch.querySelector('.js-reset');
const laps = stopwatch.querySelector('.js-laps');

          //  Задаємо кнопкам takeLapBtn та resetBtn неактивний стан
addBtnAttributeDisabled();

          //   Встановлюємо слугача на секундомір
stopwatch.addEventListener('click', clickBtn);