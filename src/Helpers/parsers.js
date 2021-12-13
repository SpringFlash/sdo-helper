export function getChooseAnswer(answer, currentAnswer) {
  const arrayOfAnswers = [];
  for (let variant of answer.children) {
    if (!variant.querySelector('input').checked) {
      continue;
    }
    const labelNode = variant.querySelector('label').cloneNode(true);
    labelNode.children[0]?.remove();
    const label = labelNode.innerText.replace(/\u00A0|^\s+|\s+$/g, '').trim();
    arrayOfAnswers.push(label);
  }
  return arrayOfAnswers.concat(currentAnswer || []);
}

export function getMatchAnswer(answer, currentAnswer) {
  const matches = {};
  const table = answer.children[0];

  for (const row of table.children) {
    const rowName = row.querySelector('.text p').innerText;
    const choice = row.querySelector('select');
    matches[rowName] = choice.children[choice.selectedIndex].innerText;
  }
  return Object.assign(matches, currentAnswer || {});
}

export function getShortAnswer(answer) {
  const inputValue = answer.querySelector('.form-control').value;
  return inputValue;
}

export function pasteChooseAnswer(answer, answerForQuestion) {
  for (const variant of answer.children) {
    const label = getLabel(variant);
    if (!answerForQuestion.includes(label)) {
      continue;
    }
    const checkBox = variant.querySelector(`input:not([type="hidden"])`);
    checkBox.checked = true;
  }
}

export function pasteMatchAnswer(answer, answerForQuestion) {
  const table = answer.children[0];

  for (const row of table.children) {
    const rowName = row.querySelector('.text p').innerText;
    const choice = row.querySelector('select');
    const rightIndex = [...choice.children].findIndex(
      (el) => el.innerText == answerForQuestion[rowName]
    );
    if (rightIndex !== -1) {
      choice.selectedIndex = rightIndex;
    }
  }
}

export function pasteShortAnswer(answer, answerForQuestion) {
  answer.querySelector('.form-control').value = answerForQuestion;
}
