'use strict';

/*
Написать приложение для работы с REST сервисом, 
  все функции делают запрос и возвращают Promise 
  с которым потом можно работать. 
  
  Реализовать следующий функционал:
  - функция getAllUsers() - должна вернуть текущий список всех пользователей в БД.
  
  - функция getUserById(id) - должна вернуть пользователя с переданным id.
  
  - функция addUser(name, age) - должна записывать в БД юзера с полями name и age.
  
  - функция removeUser(id) - должна удалять из БД юзера по указанному id.
  
  - функция updateUser(id, user) - должна обновлять данные пользователя по id. 
    user это объект с новыми полями name и age.
  Документацию по бэкенду и пример использования прочитайте 
  в документации https://github.com/trostinsky/users-api#users-api.
  Сделать минимальный графический интерфейс в виде панели с полями и кнопками. 
  А так же панелью для вывода результатов операций с бэкендом.
*/


//=============================== Функції які відсилають запити на сервер ==================================================
/**
 * Дана функція відправляє запит на сервер, щодо всіх зареєстрованих користувачів
 * та виводить інформацію по них на екран.
 */
function showAllUsers() {
  fetch(usersAPI)
  .then(response => {
    if (response.ok) {
      // console.log(response);
      return response.json();
    }

    throw new Error (`Error while fetching: ${response.statusText}`)
  })
  .then(data => {
    informationContainerTitle.textContent = 'Перелік всіх користувачів'; 
    
    const usersArray = data.data;
    
    // Якщо не має зареєстрованих користувачаі, тоді виводиться на екран
    if (usersArray.length === 0) {
      informationContainerTitle.textContent = 'Не має жодного зареєстрованого користувача!!!';
      return;
    }
    
    //  Відповідно до отриманого від сервера запиту, створюємо картки користувачам
    usersCardsWrapper.innerHTML = usersArray.reduce((acc, elem) => acc + createUserCard(elem), '');
  })
  .catch(error => console.log(error));
}

/**
 * Дана функція відправляє запит на сервер з id певного користувача
 * та виводить на дисплей наявну про нього інформацію,
 * Також створює інструментарій для її зміни (оновлення інформації та її видалення користувача) 
 * @param {*} id    - id користувача (береться після заповнення поля форми "input_id")
 */
function getUserById (id) {
  fetch(`${usersAPI}${id}`)
  .then( response => {

    console.log(response);
    if (response.ok) {
      return response.json();
    }
    
    throw new Error (`Error while fetching: ${response.statusText}`)
  })
  .then(data => {

    if (data.status === 500) {    //  Якщо користувач, з введеним id, відсутній на сервері, виводимо на екран:
      informationContainerTitle.textContent = `Вибачте, але користувача з id: ${id} не має в базі!`;
      return;                     //  і виходимо з функції
    }

    if (data.status === 404) {    //  Якщо користувач, з введеним id, був видалений з сервера, виводимо на екран:
      informationContainerTitle.textContent = `Вибачте, але користувач з id: ${id} був видалений з бази!`;
      return;                     //  і виходимо з функції
    }

    userCardData = data.data      //  Записуємо інформацію про користувача, отриману від сервера, в змінну
    
    informationContainerTitle.textContent = `Картка користувача:`;      //  Змінюємо загаловок
    usersCardsWrapper.innerHTML = createUserCard(userCardData);         //  Створюємо картку користувача

    createUserInterface();                                              //  Створюємо кнопки, для редагування картки користувача
  })
  .catch(error => console.log(error));
}

/**
 * Дана функція відправляє запит на сервер, щодо створення нового користувача.
 * Відправляючи дані з його іменем та віком
 * @param {string}  name  - Ім'я нового користувача
 * @param {number}  age   - Вік нового користувача
 */
function addUser (name, age) {
  fetch(usersAPI, {
    method: 'POST',
    body: JSON.stringify({name, age}),        // Передаємо тіло запиту, перетворивши його в JSON-формат
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })

  .then(response => {

    if (response.ok) {
      return response.json();
    }
    
    throw new Error (`Error while fetching: ${response.statusText}`);
  })

  .then(data => {

    if (data.status === 201) {
      // Виводимо на дисплей інформацію, щодо успішного створення картки користувача та його id
      userCardData = data.data
      informationContainerTitle.textContent = `Картка користувача з id ${userCardData._id} успішно створена!`
    }

    /* Якщо з якихось причин вік користувача буде переданий на сервер не в числовому форматі, 
    а ім'я - не в текстовому, тоді висвітиться настунпий текст*/
    if (data.status === 500) {
      informationContainerTitle.textContent = `Вік нового користувача необхідно вводити арабськими цифрами, 
      а ім'я - має бути в текстовому форматі!`
    }
  })
  .catch(error => console.log(error));      //  У разі винекнення помилки виводимо на консоль повідомлення
}

/**
 * Дана функція відправляє запит на сервер, щодо видалення картки користувача
 * @param {*} id  -  id-користувача
 */
function removeUser(id) {
  fetch(`${usersAPI}${id}`, {method: 'DELETE'})
  .then (response => {

    // Якщо запит був успішно виконаний, тоді виводимо на дисплей текст з повідомленням
    if (response.ok) {
      informationContainerTitle.textContent = `Користувач з id: ${id} був успішно видалений з бази!`;
    }

    throw new Error (`Error while fetching: ${response.statusText}`);

  })
  .catch(error => console.log(error));      //  У разі винекнення помилки виводимо на консоль повідомлення
}

/**
 * Дана функція відправляє запит на сервер щодо зміни інформації в картці користувача
 * @param {string} id     - id користувача, інформацію по якому необхідно змінити
 * @param {object} user   - об'єкт, який містить ключі з оновленим іменем та віком користувача
 */
function updateUser(id, user) {
  fetch(`${usersAPI}${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error (`Error while fetching: ${response.statusText}`);
    })
    .then(data => {
      informationContainerTitle.textContent = `Інформація по користувачу була успішно змінена!`;

      userCardData = data.data
      usersCardsWrapper.innerHTML = createUserCard(userCardData);     //  Виводимо на дисплей оновлену картку користувача
    })  

    .catch(error => console.log(error));                              //  У разі винекнення помилки виводимо на консоль повідомлення

}

//___________________________________________________________________________________________________________________________________

//======================================== Створення та видалення DOM-елементів =====================================================
/**
 * Створення елементу, надання йому класів, атрибутів та встановлення його в певний DOM-вузол
 * @param {String}            tag         - Назва створюваного тегу
 * @param {String or Array}   classNames  - Присвоєння йому класу
 * @param {object or Array}   attrs       - Надання йому атрибутів
 * @param {String}            text        - Заповнення текст контенту
 * @param {object}            parent      - Місце, в яке буде поставлений тег
 */
function createNewElem (tag, classNames, attrs, text, parent) {
  const elem = document.createElement(tag);
  
  if (Array.isArray(classNames)) {                        // Якщо classNames масив - задаємо стільки класів, скільки елементів в масиві
    classNames.map(e => elem.classList.add(e));
  } else if (classNames) {
    elem.classList.add(classNames);                       // Якщо classNames один аргумент - створюємо лише один клас елементу
  }
  
  if (Array.isArray(attrs)) {                             // Якщо attrs масив - задаємо стільки атрибутів, скільки елементів в масиві
    attrs.map(e => elem.setAttribute(e.name, e.value));
  } else if (attrs) {                                     // Якщо attrs об'єкт - створюємо лише один атрибут елементу
  elem.setAttribute(attrs.name, attrs.value);
}

elem.textContent = text;

parent.append(elem)
  return elem;
}

/**
 * Створення картки користувача
 * @param {*} id    - id-користувача
 * @param {*} name  - ім'я користувача
 * @param {*} age   - вік користувача
 */
function createUserCard ({id, name, age}) {
  return `
    <table class="user-card">
      <tr class="field-name">
        <th class="line_header">Ім'я:</th>
        <td class="user-name">${name}</td>
      </tr>
      <tr class="field-age">
          <th class="line_header">Вік:</th>
          <td class="user-age">${age}</td>
      </tr>
      <tr class="field-id">
        <th class="line_header">id:</th>
        <td class="user-id">${id}</td>
      </tr>
      </table>
  `
}

/**
 * Функція, для створення форми, на основі переданого їй об'єкта форми
 * @param {Object} objectForm    - Об'єкт форми
 */
function createForm(objectForm) {
  informationContainerTitle.textContent = objectForm.titleText;                               //  Створюємо заговок форми
  const form = createNewElem ("form", objectForm.classForm, null, null, usersCardsWrapper);   //  Створюємо форму
  objectForm.formTarget = form;       //  Записуємо в об'єкт форми розташування DOM-вузла цієї форми

  // Якщо у об'єкта налаштувань форми є налаштування для полей форми, тоді: 
  if (objectForm.optionsFieldForm) {

    // Створюємо поля форми, які має заповнити відвідувач сайту
    if (Array.isArray(objectForm.optionsFieldForm)) {  //  Якщо значення ключа поля форми є масив, тоді перебираємо його.
      objectForm.optionsFieldForm.map(e => {
        const signatureForm = createNewElem (          //  По кожному елементу масиву створюємо:
          "label",                                     //      створюємо підпис до поля форми (тег: <label>)
          e.classSignature,                            //      клас цього тега задається відповідно до об'єкта налаштувань поля форми
          null,                                        //      даний тег без атрибутів
          e.signatureTextForm,                         //      текст тега задається відповідно до об'єкта налаштувань поля форми
          form                                         //      якого розташовуємо всередині елемента form
        );
          
        const fieldForm = createNewElem (              //  І відповідно до кожного тегу <label> створюємо:
          "input",                                     //      текстове поле введення (тег <input>)
          e.classFieldForm,                            //      клас тега отримуємо з об'єкта налаштувань поля форми
          e.attrsFieldForm,                            //      атрибути тега отримуємо з об'єкта налаштувань поля форми
          null,                                        //      без тексту
          signatureForm                                //      Розташовуємо даний тег у створений раніше  тег: <label>
        );
          
        e.targetFieldForm = fieldForm;                 //  Записуємо створений тег в об'єкт налаштувань поля форми

        /*  Якщо необхідно створити форму для оновлення даних по користувачу, тоді для полей введення інформації,
        за замовчуванням, буде встановлене значення яке вже має картка користувача */
        if (objectForm === updateFormObj) {
          if (e.classFieldForm === 'input_name') {        //  Якщо поле має клас 'input_name':
            e.targetFieldForm.value = userCardData.name   //  Встановлюємо йому значення, яке вже має картка користувача
          }

          if (e.classFieldForm === 'input_age') {
            e.targetFieldForm.value = userCardData.age
          }             
        }
      });

    } else {                                           //  Якщо значення ключа поля форми є об'єкт, тоді:
      const signatureForm = createNewElem (            //      створюємо підпис до поля форми (тег: <label>)
        "label", 
        objectForm.optionsFieldForm.classSignature, 
        null, 
        objectForm.optionsFieldForm.signatureTextForm, 
        form
      );

      const fieldForm = createNewElem (
        "input", 
        objectForm.optionsFieldForm.classFieldForm, 
        objectForm.optionsFieldForm.attrsFieldForm, 
        null, 
        signatureForm
      );
      objectForm.optionsFieldForm.targetFieldForm = fieldForm;
    }
  }

  const formBtnWrapper = createNewElem ("div", "form_btn-wrapper", null, null, form);    //  Сторюємо місце для кнопок
  createNewElem ("input", "submit-btn", optionsBtnSubmit, null, formBtnWrapper);         //  Сторюємо кнопку "submit"

  if (objectForm.resetBtn) {                                                             //  Якщо, об'єкт форми передбачає кнопку "reset":
    createNewElem ("input", "reset-btn", optionsBtnReset, null, formBtnWrapper);         //     створюємо її
  }
}

/**
 * Дана функція призначенна для створення інтервейсу щодо зміни (оновлення та видалення) картки користувача
 */
function createUserInterface () {
  const userInterface = createNewElem ('div', "user_interface-wrapper", null, null, usersCardsWrapper);
  updateUserBtn = createNewElem ('button', ["functional-button", 'update_user-btn'], null, "Оновити дані користувача", userInterface);
  removeUserBtn = createNewElem ('button', ["functional-button", 'remove_user-btn'], null, "Видалити дані користувача", userInterface);

}

/**
 * Дана функція перевіряє на наявність у кнопки закрити атрибут: 'hidden'.
 * У разі наявності - видаляє його
 */
function removeAttrBtnClose () {
  if (btnClose.hasAttribute('hidden')) {
    btnClose.removeAttribute('hidden');
  }
}

/**
 * Функція для повернення початкових налаштувань сторінки.
 * Застосовується тоді, коли відвідувач сайту натиснув на кнопку "Закрити"
 */
function returnOriginalPageSettings () {

  informationContainerTitle.textContent = '';                         // Перезаписуємо заголовок, як пусту строку
  
  if (!btnClose.hasAttribute('hidden')) {
    btnClose.setAttribute('hidden', null);
  }

  removeChildrenElem (usersCardsWrapper)  //  Якщо у DOM-вузола є дочірні елементи, тоді їх видаляємо 
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

//_______________________________________________________________________________________________________________________________

//================================  Функції, які запускаюсться тоді, коли спрацьовують слухачі  =================================
/**
 * В залежності від кнопки, на яку натиснув користувач, запускається певна функція
 * @param {*} event 
 */
function handleBtnClick (event) {
  const target = event.target;

  if (target.nodeName !== 'BUTTON') return;     // якщо було натиснута не кнопка - функція завершується

  removeChildrenElem (usersCardsWrapper);       //  Якщо в контейнері є дочірні елементи, тоді видаляємо їх
  removeAttrBtnClose();                         //  Якщо кнопна "Закрити" має атрибут 'hidden' - видаляєм його

  switch (target) {
    case btnGetAllUsers:                        
      showAllUsers();                           //  Виводимо на дисплей всі картки користувачів
      break;
      
    case btnGetUser:
      createForm(searchFormObj);                //  Створюємо форму для пошуку користувача за id
      break;

    case btnAddUser:
      createForm(addFormObj);                   //  Створюємо форму для заповнення даних по новому користувачу
      break;

    case btnClose:                              
      returnOriginalPageSettings();             //  Повернення веб-сторінки початкових налаштувань
      break;

    case updateUserBtn:
      createForm(updateFormObj);                //  Створюємо форму для оновлення даних в картці користувача
      break;
    
    case removeUserBtn:
      createForm(removeFormObj);                //  Створюємо форму для підтвердження видалення картки користувача
      break;
  }
}

/**
 * Дана функція запускається коли у будь-якій формі відбувся 'submit'. 
 * Вона визначає, тип форми, у якій відбулася ця дія, та відповідно до нього запускає певну функцію
 * @param {*} event 
 */
function submitForm (event) {
  event.preventDefault();                                           //  Виключаємо дії браузера за замовчуванням
  removeChildrenElem (usersCardsWrapper);                           //  Очищуємо місце для виведення інформації

  if (event.target === searchFormObj.formTarget) {                  //  Якщо "submit" виконався на формі для пошуку користувача за Id
    userId = searchFormObj.optionsFieldForm.targetFieldForm.value;  //  Присвоюємо змінній значення, яке було введене відвідувачем сайту
    getUserById(userId);                                            //  Запускаємо функцію пошуку користувача за Id
    return;
  }

  
  if (event.target === addFormObj.formTarget) {       //  Якщо "submit" виконався на формі для створення нового користувача
    //  Присвоюємо змінним значення, які ввів відвідувач сайту в форму для створення нового користувача
    const FieldFormArr = addFormObj.optionsFieldForm;         //  Масив текстових полей форми

    userName = FieldFormArr                                   //  Значення змінної імені користувача встановлюється шляхом:
      .find((elem) => elem.classFieldForm === "input_name")   //    пошук в масиві елемент, клас форми якої є "input_name"
      .targetFieldForm                                        //    в знайденому елементу заходимо в ключ, значення якого є DOM-вузол
      .value;                                                 //    з DOM-вузола записуємо введене користувачем значення в змінну

    userAge = Number(FieldFormArr                                    //  Значення змінної імені користувача встановлюється шляхом:
      .find((elem) => elem.classFieldForm === "input_age")    //    пошук в масиві елемент, клас форми якої є "input_age"
      .targetFieldForm                                        //    в знайденому елементу заходимо в ключ, значення якого є DOM-вузол
      .value);

      addUser(userName, userAge);                             //  Запускаємо функцію по створенню картки користувача на сервері
  }

  if (event.target === updateFormObj.formTarget) {     //  Якщо "submit" виконався на формі для оновлення даних картки користувача, тоді:

    /* У випадках, коли відвідувач сайту намагається відправити дані, щодо оновлення картки користувача, 
    проте жодних змін в картку не було внесено, тоді запит на сервер відправлено не буде.
    Для цього створюється змінні з новими даними, і порівнюються з попередніми. */

    userName = updateFormObj
      .optionsFieldForm
      .find((elem) => elem.classFieldForm === "input_name")   
      .targetFieldForm 
      .value;
      
    userAge = Number(updateFormObj
      .optionsFieldForm
      .find((elem) => elem.classFieldForm === "input_age")   
      .targetFieldForm 
      .value);



    if (userName === userCardData.name && userAge === userCardData.age) {
      informationContainerTitle.textContent = `Ви не внесли жодних змін в картку користувача з id: ${userId}`;
      return;
    }

    updateUser(userId, {name: userName, age: userAge})       //  Якщо зміни були внесені, тоді відправляємо оновлену інформацію на сервер
    return;
  }

  if (event.target === removeFormObj.formTarget) {     //  Якщо "submit" виконався на формі для підтвердження видалення картки користувача
    removeUser(userId);                                       //  Відправляємо на сервер запит на видалення картки користувача
    return;
  }
}
//_______________________________________________________________________________________________________________________________

//============================================= Налаштування для полей форми ====================================================
//  Налаштування для поля форми: "Введення id користувача"
const optionsFieldFormId = {
  classSignature: ["signature_form", "field-id"],             //  Клас підпису     
  signatureTextForm: "Введіть id користувача: ",              //  Підпис форми
  classFieldForm: "input_id",                                 //  Клас для текстового поля введення
  targetFieldForm: undefined,                                 //  Розташування поля форми в DOM 
  attrsFieldForm: [                                           //  Атрибути для текстового поля введення:
    {
      name: 'type',                                           //      текстовий тип поля
      value: 'text'
    },
    {                                                         
      name: 'required',                                       //      позначка для обов'язкового для заповнення поля
      value: null
    }, 
    {
      name: 'placeholder',                                    //      напис в текстовому полі
      value: 'Id користувача'
    }, 
    {
      name: 'name',                                           //      назва форми
      value: 'input_id'
    },
  ],
}

//  Налаштування для поля форми: "Введення імені користувача"
const optionsFieldFormName = {  
  classSignature: ["signature_form", "field-name"],            //  Клас підпису                   
  signatureTextForm: "Введіть ім'я користувача: ",      //  Підпис форми
  classFieldForm: "input_name",                                //  Клас для текстового поля введення
  targetFieldForm: undefined,                                  //  Розташування поля форми в DOM
  attrsFieldForm: [                                            //  Атрибути для текстового поля введення:
    {
      name: 'type',                                           //      текстовий тип поля
      value: 'text'
    },
    {                                           
      name: 'required',                                        //      позначка для обов'язкового для заповнення поля
      value: null
    }, 
    {
      name: 'placeholder',                                     //      напис в текстовому полі
      value: "Ім'я користувача"
    }, 
    {
      name: 'name',                                            //      назва форми
      value: 'input_name'
    }
  ]
}

//  Налаштування для поля форми: "Введення віку користувача"
const optionsFieldFormAge = { 
  classSignature: ["signature_form", "field-age"],            //  Клас підпису             
  signatureTextForm: "Введіть вік користувача: ",      //  Підпис форми
  classFieldForm: "input_age",                                //  Клас для текстового поля введення
  targetFieldForm: undefined,                                 //  Розташування поля форми в DOM
  attrsFieldForm: [                                           //  Атрибути для текстового поля введення:
    {
      name: 'type',                                           //     числовий тип поля (так як вік користувача може бути тільки числом)
      value: 'number'
    },
    {
      name: 'min',                                            //     вік користувача може бути тільки додатнім
      value: '0'
    },
    {                                           
      name: 'required',                                       //      позначка для обов'язкового для заповнення поля
      value: null
    }, 
    {
      name: 'placeholder',                                    //      напис в текстовому полі
      value: 'Вік користувача'
    }, 
    {
      name: 'name',                                           //      назва форми
      value: 'input_age'
    }
  ]
}

//_______________________________________________________________________________________________________________________________

//============================================ Налаштування для кнопок форми ====================================================

//  Налаштування кнопки для відправлення форми
const optionsBtnSubmit = [
  {
    name: "type", 
    value: "submit"
  },
  {
    name: "value", 
    value: "Ок"
  }
]

//  Налаштування кнопки для скинення раніше введених значень у полей форми
const optionsBtnReset = [
  {
    name: "type", 
    value: "reset"
  },
  {
    name: "value", 
    value: "Відміна"
  }
]

//_______________________________________________________________________________________________________________________________

//====================================================== Об'єкти форм ===========================================================
//  Об'єкти форм застосовуються для побудови форми відповідно до їх налаштувань

const searchFormObj = {         //  Об'єкт форми для пошуку користувача за Id
  titleText: "Пошук користувача за id",                                //  Заголовок форми
  classForm: "user_search_by_id",                                      //  Клас форми
  optionsFieldForm: optionsFieldFormId,                                //  В формі присутнє текстове поле "optionsFieldFormId"
  resetBtn: true,                                                      //  Форма передбачає наявність кнопки "reset"
};

const updateFormObj = {         //  Об'єкт форми для зміни даних по користувачу
  titleText: "Зміна даних картки користувача",                         //  Заголовок форми
  classForm: "change_user_data",                                       //  Клас форми
  optionsFieldForm: [optionsFieldFormName, optionsFieldFormAge],
  resetBtn: true,                                                      //  Присутня кнопка "reset"
};

const addFormObj = {            //  Об'єкт форми для створення нового користувача
  titleText: "Додати картку нового користувача",                       //  Заголовок форми
  classForm: "add_new_user",                                           //  Клас форми
  optionsFieldForm: [optionsFieldFormName, optionsFieldFormAge],
  resetBtn: true,                                                      //  Присутня кнопка "reset"
};

const removeFormObj = {         //  Об'єкт форми для підтвердження видалення користувача
  titleText: "Ви впевнені, що бажаєте видалити картку користувача?",   //  Заголовок форми
  classForm: "remove_user",                                            //  Клас форми
  optionsFieldForm: null,                                              //  Відсутні текстові поля введення
  resetBtn: false,                                                     //  Кнопка "reset" відсутня
}

//_______________________________________________________________________________________________________________________________

const main = document.querySelector('main');
const informationContainerWrapper = main.querySelector('.information_container-wrapper');
const informationContainerTitle = main.querySelector('.information_container-title');
const usersCardsWrapper = main.querySelector('.users-cards-wrapper');

const btnClose = main.querySelector('.btn-close');
const btnGetAllUsers = main.querySelector('.btn-get-all_users-js');
const btnGetUser = main.querySelector('.btn-get_user-js');
const btnAddUser = main.querySelector('.btn-add_user-js');

/* Змінні, значення яких встановлюється коли відвідувач сайту заповнює форми.
Використовується, щоб знайти та/або редагувати (видалити, оновити дані) картки користувача*/
let userId,         //  Id-користувача (встановлюється значення під час заповнення форми для пошуку користувача за Id)
    userName,       //  Ім'я користувача (встановлюється значення під час створення картки користувача чи редагування вже існуючої)
    userAge,        //  Вік користувача (встановлюється значення під час створення картки користувача чи редагування вже існуючої)  
    userCardData;   //  Інформація про картку користувача, отримана від сервера. 

/* Змінні для кнопок інтерфейсу управління карткою користувача, які створюються після того, як був знайдений користувач за Id*/
let updateUserBtn,  //  Кнопка, натиснувши яку, можна оновити дані по картці користувача
    removeUserBtn;  //  Кнопка для видалення картки користувача з сервера


const usersAPI = 'https://test-users-api.herokuapp.com/users/';

//  Встановлюємо слухачі
main.addEventListener('click', handleBtnClick);
main.addEventListener('submit', submitForm);
