import './popup.css';
import { getConcateAnswers, writeToClipboard } from '../Helpers/getters';

const additionalContainer = document.querySelector('.additional-areas');

function addField() {
  const newAreaBlock = document.querySelector('#additional-area-template').content.cloneNode(true);
  const newArea = newAreaBlock.querySelector('.addition-area');
  const removeBtn = newAreaBlock.querySelector('button');
  newArea.id = `addition-${additionalContainer.children.length + 1}`;
  additionalContainer.append(newAreaBlock);

  removeBtn.addEventListener('click', (e) => {
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
    writeToClipboard({
      text: result,
      thenFunc: () => showInfo('Текст скопирован.', true, 2000),
    });
  } catch {
    showInfo('Произошла ошибка слияния', false, 2000);
  }
}

document.querySelector('#add-field').addEventListener('click', addField);
document.querySelector('#concate').addEventListener('click', concateAnswers);
