import './popup.css';
import {
  getConcateAnswers,
  writeToClipboard,
  setAreaValueToStorage,
  removeAreaValueFromStorage,
  clearAreasStorage,
} from '../Helpers';

window.addEventListener('load', () => {
  const storage = window.localStorage;
  const areas = JSON.parse(storage.getItem('areas') || '[]');
  if (!areas) {
    storage.setItem('areas', '[]');
  }

  const inputs = document.querySelectorAll('.json-area');

  inputs[0].value = areas?.[0] || '';
  inputs[1].value = areas?.[1] || '';

  inputs.forEach((input, i) =>
    input.addEventListener('input', (e) => setAreaValueToStorage(event.target.value, i))
  );
  areas.slice(2).forEach((area) => addField(area));
});

const additionalContainer = document.querySelector('.additional-areas');

function addField(value) {
  const newAreaBlock = document.querySelector('#additional-area-template').content.cloneNode(true);
  const newArea = newAreaBlock.querySelector('.addition-area');
  const removeBtn = newAreaBlock.querySelector('button');
  const index = additionalContainer.children.length + 1;
  newArea.id = `addition-${index}`;
  newAreaBlock.querySelector('.addition-area-container').id = `addition-container-${index}`;
  newArea.value = value || '';

  const getIndex = () => {
    const children = additionalContainer.children;
    const result = [...children].indexOf(document.getElementById(`addition-container-${index}`));
    console.log(result, (result !== -1 ? result : children.length) + 2);
    return (result !== -1 ? result : children.length) + 2;
  };

  setAreaValueToStorage(newArea.value, getIndex());
  newArea.addEventListener('input', (e) => setAreaValueToStorage(event.target.value, getIndex()));

  additionalContainer.append(newAreaBlock);

  removeBtn.addEventListener('click', (e) => {
    removeAreaValueFromStorage(getIndex());
    additionalContainer.removeChild(e.target.parentNode.parentNode);
  });
}

let infoTimeout = null;
function showInfo(text, isComplete = false, timeout) {
  if (infoTimeout) {
    clearTimeout(infoTimeout);
    infoTimeout = null;
  }

  const info = document.getElementById('info');
  info.innerHTML = text;
  if (isComplete) {
    info.classList.add('complete');
  }

  if (timeout) {
    infoTimeout = setTimeout(() => {
      info.innerHTML = '';
      info.classList.remove('complete');
    }, timeout);
  }
}

function concateAnswers() {
  const areas = document.querySelectorAll('.json-area');
  const firstArea = areas[0];
  const areaValues = [...areas].map((area) => area.value);

  try {
    const result = getConcateAnswers(areaValues);
    [...areas].forEach((area) => (area.value = ''));
    firstArea.value = result;
    additionalContainer.innerHTML = '';
    clearAreasStorage();
    setAreaValueToStorage(result, 0);
    writeToClipboard({
      text: result,
      thenFunc: () => showInfo('Текст скопирован.', true, 2000),
    });
  } catch {
    showInfo('Произошла ошибка слияния', false, 2000);
  }
}

document.querySelector('#add-field').addEventListener('click', () => addField());
document.querySelector('#concate').addEventListener('click', concateAnswers);
document.querySelector('#clear-all').addEventListener('click', () => {
  clearAreasStorage();
  const inputs = document.querySelectorAll('.json-area');
  [...inputs].forEach((input) => (input.value = ''));
  additionalContainer.innerHTML = '';
});
