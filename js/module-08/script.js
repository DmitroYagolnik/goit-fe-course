'use strict';

/*
  Создайте компонент галлереи изображений следующего вида.
  
    <div class="image-gallery js-image-gallery">
      <div class="fullview">
        <!-- Если выбран первый элемент из preview -->
        <img src="img/fullview-1.jpeg" alt="alt text 1">
      </div>
      <!-- li будет столько, сколько объектов в массиве картинок. Эти 3 для примера -->
      <ul class="preview">
        <li><img src="img/preview-1.jpeg" data-fullview="img/fullview-1.jpeg" alt="alt text 1"></li>
        <li><img src="img/preview-2.jpeg" data-fullview="img/fullview-2.jpeg" alt="alt text 2"></li>
        <li><img src="img/preview-3.jpeg" data-fullview="img/fullview-3.jpeg" alt="alt text 3"></li>
      </ul>
    </div>   
    
    🔔 Превью компонента: https://monosnap.com/file/5rVeRM8RYD6Wq2Nangp7E4TkroXZx2
      
      
    Реализуйте функционал:
      
      - image-gallery есть изначально в HTML-разметке как контейнер для компонента.
    
      - fullview содержит в себе увеличенную версию выбранного изображения из preview, и
        создается динамически при загрузке страницы.
    
      - preview это список маленьких изображений, обратите внимание на атрибут data-fullview,
        он содержит ссылку на большое изображение. preview и его элементы, также создаются 
        динамически, при загрузке страницы.
        
      - При клике в элемент preview, необходимо подменить src тега img внутри fullview
        на url из data-атрибута выбраного элемента.
        
      - По умолчанию, при загрузке страницы, активным должен быть первый элемент preview.
        
      - Изображений может быть произвольное количество.
      
      - Используйте делегирование для элементов preview.
      
      - При клике, выбраный элемент из preview должен получать произвольный эффект выделения.
      
      - CSS-оформление и имена классов на свой вкус.
      
      
    🔔 Изображения маленькие и большие можно взять с сервиса https://www.pexels.com/, выбрав при скачивании
      размер. Пусть маленькие изображения для preview будут 320px по ширине, большие для fullview 1280px.
      Подберите изображения одинаковых пропорций.
*/

/**
 * Пошук елемента в DOM-дереві
 */
function findElement(element) {
  return document.querySelector(element)
}

/**
 * Створення елементу, надання йому класів, атрибутів та встановлення його в певний DOM-вузол
 * @param {String}            tag         - Назва створюваного тегу
 * @param {String or Array}   classNames  - Присвоєння йому класу
 * @param {String or Array}   attrs       - Надання йому атрибутів
 * @param {object}            parent      - Місце, в яке буде поставлений тег
 */
function createNewElem(tag, classNames, attrs, parent) {
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

  parent.append(elem)
  return elem;
}

/**
 * Задання атрибутів тегу <img> в DOM-вузлі fullview
 */
function setFullviewImageAttribute () {
  const findActiveElementPreview = findElement('.active');          // Шукаємо <li>, який має клас 'active'
  const imagePreview = findActiveElementPreview.firstElementChild;  // В ньму переходимо до єдиного нащадка
  const adressFullviewContent = imagePreview.dataset.fullview;      // Звертаємося до data-атрибуту 'img';

  return  [
    {name:'src', value: adressFullviewContent},
    {name:'alt', value: imagePreview.alt}
  ]
}

/**
 * Створення елементів в <ul class="preview"> згідно масиву об'єктів 
 * @param {Array} array - Масив об'єктів, з якого потрібно створити нові елементи
 */
function addElemPreviewGalary(array) {
  array.forEach(element => createPreviewElem(element));
}

/**
 * Створення окремого елемента в <ul class="preview"> згідно масиву об'єктів
 * @param {object} param0 - Об'єкт, з якого потрібно створити елемент в DOM-дереві
 * @param {key} preview   - Адреса картинка для preview галереї
 * @param {key} alt       - Альтернативний текст, який буде відображатися, якщо не зможе загрузитися картинка
 * @param {key} fullview  - Адреса картинки, яка може відобразитися в fullview
 */
function createPreviewElem({preview, alt, fullview}) {
  const previewItem = createNewElem('li', null, null, previewGalary);
  createNewElem(
    'img',
    null,
    [ {name: 'src', value: preview},
      {name: 'alt', value: alt},
      {name: 'data-fullview', value: fullview} ],
    previewItem)
}

/**
 * Задає картинку fullview, відповідно до вибору користувача
 * @param {*} event - Руагування на клік користувача по елементам галереї preview
 */
function addNewFullviewImage(event) {
  const findActiveElementPreview = findElement('.active');          // Шукаємо 'li', з класом 'active'
  findActiveElementPreview.classList.remove('active');              // Видаляємо цей клас у пепереднього елементу
  
  const parentTarget = event.target.parentNode;                     // Вибираємо батька обраного елемента 
  parentTarget.classList.add('active');                             // та надаємо йому клас 'active'

  // Задаємо атрибути Fullview за допомогою виклика функції setFullviewImageAttribute()
  setFullviewImageAttribute().map(e => fullviewElement.setAttribute(e.name, e.value));
}


const galleryItems = [
    { preview: 'img/preview-1.jpg', fullview: 'img/fullview-1.jpg', alt: "alt text 1" },
    { preview: 'img/preview-2.jpg', fullview: 'img/fullview-2.jpg', alt: "alt text 2" },
    { preview: 'img/preview-3.jpg', fullview: 'img/fullview-3.jpg', alt: "alt text 3" },
    { preview: 'img/preview-4.jpg', fullview: 'img/fullview-4.jpg', alt: "alt text 4" },
    { preview: 'img/preview-5.jpg', fullview: 'img/fullview-5.jpg', alt: "alt text 5" },
    { preview: 'img/preview-6.jpg', fullview: 'img/fullview-6.jpg', alt: "alt text 6" },
];

const ImageGallery = findElement('.js-image-gallery');
const fullview = findElement('.fullview');
const previewGalary = findElement('.preview');

addElemPreviewGalary(galleryItems);                                 // Створюємо елементи галереї preview

const firstImagePreviewGalary = findElement('.preview > li');       // За замовчуванням надаємо першому елементу галереї клас 'active'
firstImagePreviewGalary.classList.add('active');

const fullviewElement = createNewElem(
  'img', 
  null, 
  setFullviewImageAttribute(),
  fullview
);                                                                  // Створюємо елемент в fullview

ImageGallery.addEventListener('click', addNewFullviewImage);        // Задаємо слухача для галереї