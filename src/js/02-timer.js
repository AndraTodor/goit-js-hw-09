import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

// Selectare elemente din HTML
const startButton = document.querySelector('button[data-start]');
const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');
let countdownInterval = null;
let selectedDate = null;

// obiectul parsat ca al doilea parametru in libraria flatpickr
// metoda onClose verifica daca data selectata este din viitor, apoi afiseaza notificari cu ajutorul librariei Notiflix
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    selectedDate = selectedDates[0];

    if (selectedDate <= now) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

// libraria de data
flatpickr('#datetime-picker', options);

// adaugare eveniment pe butonul de start, porneste cronometrul invers
startButton.addEventListener('click', () => {
  startCountdown();
});

// sterge intervalul anterior atunci cand se seteaza un nou interval
function startCountdown() {
  clearInterval(countdownInterval);

  // actualizare cronometru la fiecare secunda
  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeDifference = selectedDate - now;

    // se verifica daca timpul ramas este 0 sau mai mic ca 0
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimer(0, 0, 0, 0);
      Notiflix.Notify.success('Countdown finished');
      return;
    }
    // se apeleaza functia care converteste diferenta de timp si se actualizeaza cu functia updateTimer
    const time = convertMs(timeDifference);
    updateTimer(time.days, time.hours, time.minutes, time.seconds);
  }, 1000);
}

// convertire milisecunte in zile, ore, minute si secunde
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// functia de update a cronometrului care apeleaza si functia de formatare
function updateTimer(days, hours, minutes, seconds) {
  daysSpan.textContent = addZero(days);
  hoursSpan.textContent = addZero(hours);
  minutesSpan.textContent = addZero(minutes);
  secondsSpan.textContent = addZero(seconds);
}

// Adaugare 0 pentru formatul de 2 cifre
function addZero(value) {
  return String(value).padStart(2, '0');
}
