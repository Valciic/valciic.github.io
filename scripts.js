const UI = {
    selectors: {
        form: '#double-form',
        input: '#input-field',
        submitBtn: '.submit-button',
        actionBtn: '.action-button',
        timerItem: '.timer-item',
        currentDouble: '#current-double',
        stopBtn: '.stop-button',
        doubleTrackerArea: '.double-header-wrapper',
        infoBtn: '#info-btn',
        modal: '.info-modal',
        modalCloseBtn: '#close-modal',
    },
    classNames: {
        hidden: 'hidden',
    },
}
const form = document.querySelector(UI.selectors.form);
const input = form.querySelector(UI.selectors.input);
const label = form.querySelector('label');
const submitBtn = form.querySelector(UI.selectors.submitBtn);
const actionBtn = form.querySelector(UI.selectors.actionBtn);
const currentDouble = form.querySelector(UI.selectors.currentDouble);
const doubleTracker = document.querySelector('#double-tracker');
const doubleTrackerArea = document.querySelector(UI.selectors.doubleTrackerArea);
const timer = document.querySelector('#timer');
const stopBtn = form.querySelector(UI.selectors.stopBtn);
const modalOpenBtn = document.querySelector(UI.selectors.infoBtn);
const infoModal = document.querySelector(UI.selectors.modal);
const modalCloseBtn = document.querySelector(UI.selectors.modalCloseBtn);
let seconds = 0;
let intervalId = null;
let practiceDoubles = [];
let doubleHitCount = -1;
main();

function main() {
    form.addEventListener('submit', handleFormSubmit);
    input.addEventListener('input', handleUserInput);
    actionBtn.addEventListener('click', nextDouble);
    stopBtn.addEventListener('click', () => {
        stopTimer();
        actionBtn.textContent = 'Restart';
        stopBtn.textContent = 'Timer stopped';
    });
    modalOpenBtn.addEventListener('click', () => {
        infoModal.showModal();
    });
    infoModal.addEventListener('click', (e) => {
        const dialogDimensions = infoModal.getBoundingClientRect();
        console.log("Dialog dimensions are: ", dialogDimensions);
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom || e.target.closest(UI.selectors.modalCloseBtn)
        ) infoModal.close();
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const value = form.input.value;
    if (!isValidString(value) || value === '') return;
    practiceDoubles = value
    .split(',')
    .flatMap((v) => [v, v, v])
    .filter(Boolean);
    startTimer();
}

function handleUserInput(e) {
    if (!isValidString(input.value) && input.value !== '') {
        label.textContent = 'Only numbers from 1-20 and B allowed; split by comma';
        label.classList.add('alert');
        return;
    }
    label.textContent = 'Enter doubles to practice';
    label.classList.remove('alert');
}

function nextDouble() {
    if (actionBtn.textContent === "Restart") {
        resetForm();
        return;
    }
    if (practiceDoubles.length === 0) {
        currentDouble.textContent = 'All done!';
        stopTimer();
        actionBtn.textContent = "Restart";
        doubleHitCount++;
        doubleTracker.querySelector('span').textContent = doubleHitCount;
        return;
    }
    updateCurrentDouble();
}

function updateCurrentDouble() {
    const practiceDoubleLength = practiceDoubles.length;
    const random = Math.floor(Math.random() * practiceDoubleLength);
    const currentDoubleNum = practiceDoubles.splice(random, 1)[0];
    currentDouble.textContent = currentDoubleNum;
    doubleHitCount++;
    doubleTracker.querySelector('span').textContent = doubleHitCount;


}

function isValidString(str) {
  const parts = str.split(",").map(s => s.trim()).filter(Boolean);

  return parts.every(part => {
    if (part === "B") return true;

    const num = Number(part);
    return Number.isInteger(num) && num >= 1 && num <= 20;
  });
}

function startTimer() {
    intervalId = setInterval(updateTimer, 1000);
    input.disabled = true;
    submitBtn.classList.add(UI.classNames.hidden);
    actionBtn.classList.remove(UI.classNames.hidden);
    updateCurrentDouble();
    doubleTracker.classList.remove(UI.classNames.hidden);
    stopBtn.classList.remove(UI.classNames.hidden);
    doubleTrackerArea.classList.remove(UI.classNames.hidden);
}

function stopTimer() {
    clearInterval(intervalId);
}
function updateTimer() {
    seconds++;
    const currentTime = formatTime(seconds);
    const timerEls = Array.from(timer.querySelectorAll(UI.selectors.timerItem));
    timerEls.forEach((element) => {
        const { id } = element;
        element.textContent = currentTime[id];
    });
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // pad with leading 0 if < 10
  const pad = (num) => String(num).padStart(2, "0");

  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds)
  }; 
}

function resetForm() {
    input.value = '';
    input.disabled = false;
    submitBtn.classList.remove(UI.classNames.hidden);
    submitBtn.textContent = 'Start practice';
    actionBtn.classList.add(UI.classNames.hidden);
    actionBtn.textContent = 'Next double';
    seconds = -1;
    stopTimer();
    updateTimer();
    doubleTracker.classList.add(UI.classNames.hidden);
    doubleTracker.querySelector('span').textContent = 0;
    doubleHitCount = -1;
    stopBtn.classList.add(UI.classNames.hidden);
    doubleTrackerArea.classList.add(UI.classNames.hidden);
}
