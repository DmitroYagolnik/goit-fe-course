'use strict';

const travelToTaba = 6;
const travelSharm = 15;
const travelHurgada = 25;

const bookingInput = prompt('Введите количество необходимых Вам мест');

const bookingActive = bookingInput !== null; // Перевіряємо, чи користувач не натиснув "Отмена" або "Esc"

if (bookingActive) {
    const bookingNumber = Number(bookingInput); // Перетворюємо строку в число
    const bookingIsNaN = Number.isNaN(bookingNumber); // Перевіряємо, чи це число

    if (!bookingIsNaN && Number.isInteger(bookingNumber) && bookingNumber > 0) {
        let haveTravel;
        let travel;

        if (bookingNumber <= travelToTaba) {
            haveTravel = true;
            travel = "Taba";
        
        } else if (bookingNumber <= travelSharm) {
            haveTravel = true;
            travel = "Sharm";

        } else if (bookingNumber <= travelHurgada) {
            haveTravel = true;
            travel = "Hurgada";

        } else {
            haveTravel = false;
        }
        
        if (haveTravel) {
            const consentTrip = confirm(`Есть места в группе, которая едит в ${travel}! Cогласны ли Вы быть в этой группе?`);
            if (consentTrip) {
                alert(`Приятного путешествия в группе ${travel}!`);
            } else {
                alert('Нам очень жаль, приходите еще!');
            }

        } else {
            alert ('Извините, столько мест нет ни в одной группе!');
        }
        
    } else {
        alert('Ошибка ввода!');
    }

} else {
    alert('Нам очень жаль, приходите еще!');
}
