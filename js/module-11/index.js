/*
  Реализуйте форму фильтра товаров в каталоге и список отфильтрованных товаров.
  Используйте шаблонизацию для создания карточек товаров.
  
  Есть массив объектов, каждый из которых описывает ноутбук с определенными характеристиками.
  
  Поля объекта по которым необходимо производить фильтрацию: size, color, release_date.
  Поля объекта для отображения в карточке: name, img, descr, color, price, release_date.
    
  Изначально есть форма с 3-мя секциями, состоящими из заголовка и группы чекбоксов.
  После того как пользователь выбрал какие либо чекбоксы и нажал кнопку Filter, 
  необходимо собрать значения чекбоксов по группам. 
  
  🔔 Подсказка: составьте объект формата
      const filter = { size: [], color: [], release_date: [] }
    
  После чего выберите из массива только те объекты, которые подходят 
  под выбраные пользователем критерии и отрендерите список карточек товаров.
  
  🔔 Каждый раз когда пользователь фильтрует товары, список карточек товаров очищается, 
      после чего в нем рендерятся новые карточки товаров, соответствующих текущим критериям фильтра.
*/

const laptops = [
  {
    size: 13,
    color: 'white',
    price: 28000,
    release_date: 2015,
    name: 'Macbook Air White 13"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 13,
    color: 'gray',
    price: 32000,
    release_date: 2016,
    name: 'Macbook Air Gray 13"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 13,
    color: 'black',
    price: 35000,
    release_date: 2017,
    name: 'Macbook Air Black 13"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 15,
    color: 'white',
    price: 45000,
    release_date: 2015,
    name: 'Macbook Air White 15"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 15,
    color: 'gray',
    price: 55000,
    release_date: 2016,
    name: 'Macbook Pro Gray 15"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 15,
    color: 'black',
    price: 45000,
    release_date: 2017,
    name: 'Macbook Pro Black 15"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 17,
    color: 'white',
    price: 65000,
    release_date: 2015,
    name: 'Macbook Air White 17"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 17,
    color: 'gray',
    price: 75000,
    release_date: 2016,
    name: 'Macbook Pro Gray 17"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 17,
    color: 'black',
    price: 80000,
    release_date: 2017,
    name: 'Macbook Pro Black 17"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
];

const form = document.querySelector('.js-form');                  //  Знаходимо в HTML форму та чекбокси

//  Для того, щоб можна було б працювати з чекбоксами, перетворюємо їх в масив
const checkboxSize = Array.from(form.querySelectorAll('input[name="size"]'));
const checkboxColor = Array.from(form.querySelectorAll('input[name="color"]'));
const checkboxReleaseDate = Array.from(form.querySelectorAll('input[name="release_date"]'));

const container = document.querySelector('.products-list');                   //  Місце для рендерингу інформації, щодо запиту користувача

//  Шаблони
const sourceProductCard = document.querySelector('#product_card-template')    //  Шукаємо шаблон картки товару
  .innerHTML                                                                  //  Перетворюємо знайдений шаблон в строку
  .trim();                                                                    //  Обрізаємо пусті місця на почанку і вкінці строки

const sourseErrorMessage = document.querySelector('#error_message') 
  .innerHTML
  .trim();

form.addEventListener('submit', submitForm);                                  //  Ставимо слухач на форму

//_______________________________________________________________________________________________________________________________
//==================================================  Функції ===================================================================

/**
 * Дана функція, спрацьовує коли відбулася відправка форми.
 * Вона оброблює запит, відповідно до параметрів заданих відвідувачем сайту
 * @param {*} event 
 */
function submitForm(event) {

  event.preventDefault();                               //  Видаляємо дії браузера за замовчуванням
  
  const filter = {                                      //  Об'єкт, з значеннями чекбоксів, які обрав відвідувач сайту
    size: checkboxSize.filter(input => input.checked)   //  в ключ записуємо тільки ті параметри, які вибрав відвідувач сайту
    .map(elem => Number(elem.value)),                   //  перебираємо кожний елемент, додаючи в масив значення, приведене до числа
    
    color: checkboxColor.filter(input => input.checked)
    .map(elem => elem.value),
    
    release_date: checkboxReleaseDate.filter(input => input.checked)
    .map(elem => Number(elem.value))
  }
  
  let typeSearchErrorsArr = [];                         // Масив в який заносяться причини/помилки які відбулися під час пошуку товарів

  /*  Якщо відвідувач сайту не вказав хоч один параметр пошуку, тоді виведеться на дисплей повідомлення з проханням, 
  вказати критерій пошуку  */
  if (filter.size.length === 0 || filter.color.length === 0 || filter.release_date.length === 0) {

    if (filter.size.length === 0) {               //  У випадку коли користувачем не було обрано жодного параметру, щодо розміру дисплея
      typeSearchErrorsArr.push({typeSearchError: 'Specify search option: "Screen size"'});
    }

    if (filter.color.length === 0) {              //  У випадку коли користувачем не було обрано жодного параметру, щодо кольору
      typeSearchErrorsArr.push({typeSearchError: 'Specify search option: "Color"'});
    }
    if (filter.release_date.length === 0) {       //  У випадку коли користувачем не було обрано жодного параметру, щодо дати релізу
      typeSearchErrorsArr.push({typeSearchError: 'Specify search option: "Release date"'});
    }

    renderTemplate(sourseErrorMessage, typeSearchErrorsArr, container);   //  Рендериться відповідь, щодо невказаних критеріїв пошуку
    return
  }

  const searchResultArr = filterProductsByUserChoice(filter);             //  Записується результат пошуку товару за заданими критеріями

  if (searchResultArr.length === 0) {

    typeSearchErrorsArr.push({
      typeSearchError: 'Sorry, but the product with the selected characteristics is missing!'
    });

    renderTemplate(sourseErrorMessage, typeSearchErrorsArr, container);   //  Рендериться відповідь, щодо відсутності товару
    return
  }

  renderTemplate(sourceProductCard, searchResultArr, container);          //  Рендериться відповідь, щодо наявних товарів
}

/**
 * Дана функція знаходить товари, які відповідають параметрам, заданих в чекбоксах відвідувачем сайту
 * @param {obj} userCheked  - об'єкт, що містить ключі з значенням чекбоксів, які обрав відвідувач сайту
 */
function filterProductsByUserChoice(userCheked) {
  
  let checkboxSize = [];                            //  Масив товарів, який задовольняє користувача, стосовно розміру товару
  let checkboxColor = [];                           //  Масив товарів, який задовольняє користувача стосовно розмірів та кольру товару
  let filteredProductsArray = [];                   //  Масив товарів, який задовольняє користувача стосовно всіх заданих параметрів
          
  userCheked.size.forEach(elem =>                   //  Перебираєм ключ, який містить розміри обрані відвідувачем сайту та
    checkboxSize.push(...                           //  в масив checkboxSize, за допомогою spread, будуть добавлені
      laptops.filter(element =>                     //  з масиву всіх товарів, лише ті:
        element.size === elem)));                   //  які відповідають критеріям, щодо розміру товару
                
  userCheked.color.forEach(elem =>                  //  Перебираєм ключ, який містить кольори, які обрані відвідувачем сайту, та
    checkboxColor.push(...                          //  в масив checkboxColor, за допомогою spread, будуть добавлені
      checkboxSize.filter(element =>                //  з масиву товарів які задовольняють розміри відвідувача сайту, лише ті:
        element.color === elem)));                  //  які відповідають критеріям, щодо кольру товару
                  
  userCheked.release_date.forEach(elem =>           //  Перебираєм ключ, який містить роки релізу, які обрані відвідувачем сайту, та
    filteredProductsArray.push(...                  //  в масив filteredProductsArray, за допомогою spread, будуть добавлені
      checkboxColor.filter(element =>               //  з масиву товарів які задовольняють критеріям розміру та кольору товару, лише ті:
        element.release_date === elem)));           //  які відповідають критеріям, щодо рокам релізу

  return filteredProductsArray;
}

/**
 * Функція перевіряє наявність дочірніх елементів DOM-вузла, та при їх присутності - видаляє
 * @param {*} parentNode - Батьківський DOM-вузол, у якому потрібно видалити всі дочірні елементи
 */
function removeChildrenElem (parentNode) {

  const childrenElem = parentNode.children;                             // Обираємо всі дочірні елементи DOM-вузола

  if (childrenElem.length > 0) {                                        // Якщо вони є, тоді:
    const arrayChildrenElem = Array.from(childrenElem);                 //  отримані значення з псевдомасиву перетворюємо в масив
    arrayChildrenElem.reduce((acc, elem) => acc + elem.remove(), '');   //  проходимо по масиву, видаляючи кожний його елемент
  }
}

/**
 * Дана функція рендерить на дисплей картки товару, які відповідають вказаними критеріями, або причини невдалого пошуку
 * @param {*} source            - HTML-розмітка шаблону, який буде рендеритися
 * @param {array} arrayAnswers  - Масив елементів, які вставляються в шаблон
 * @param {*} parentContainer   - Місце в DOM-вузлі, для рендерингу
 */
function renderTemplate(source, arrayAnswers, parentContainer) {

  const template = Handlebars.compile(source);              //  Компіляція вибраного шаблону за допомогою Handlebars

  const markup = arrayAnswers                               //  Створення HTML-розмітки відповідно до відповідей на запит користувача
    .reduce((acc, answer) => acc + template(answer), ''); 

  removeChildrenElem(parentContainer);                      //  Якщо в DOM-вузлі є елементи, тоді видаляємо їх

  parentContainer.insertAdjacentHTML('afterbegin', markup); //  Записуємо отриману HTML-розмітку в визначений DOM-вузл
}