/* ----------------------------------------- src/getters ------------------------------------------ */
function getQuestionsNodes(type) {
  const selectors = {
    get: '.questionflagsaveform',
    paste: '#responseform',
  };
  return [...document.querySelector(selectors[type]).children[0].children].filter((el) =>
    el.classList.contains('que')
  );
}

function getQuestionType(question) {
  const variants = {
    multichoice: 'choose',
    truefalse: 'choose',
    match: 'match',
    shortanswer: 'shortanswer',
    numerical: 'shortanswer',
  };

  return Object.entries(variants).find((variant) => question.classList.contains(variant[0]))?.[1];
}

function getLabel(element) {
  const labelNode = element.querySelector('label').cloneNode(true);
  labelNode.children[0]?.remove();
  return labelNode.innerText.replace(/\u00A0|^\s+|\s+$/g, '').trim();
}

/* ---------------------------------------- src/pasters --------------------------------------------*/
function pasteChooseAnswer(answer, answerForQuestion) {
  for (const variant of answer.children) {
    const label = getLabel(variant);
    if (!answerForQuestion.includes(label)) {
      continue;
    }
    const checkBox = variant.querySelector(`input:not([type="hidden"])`);
    checkBox.checked = true;
  }
}

function pasteMatchAnswer(answer, answerForQuestion) {
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

function pasteShortAnswer(answer, answerForQuestion) {
  answer.querySelector('.form-control').value = answerForQuestion;
}

/* ------------------------------------- src/PasteAnswers.js ----------------------------- */
function addSearchLink(nameNode) {
  const url = new URL('https://google.com/search');
  url.searchParams.set('q', nameNode.innerText);

  const searchButton = document.createElement('button');
  searchButton.classList.add('google-search-button');
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';

  searchButton.append(link);
  nameNode.append(searchButton);
}

function setLinks() {
  getQuestionsNodes('paste').forEach((question) => addSearchLink(question.querySelector('.qtext')));
}

function pasteAnswersToQuestions(answersJson) {
  let answers = {};
  try {
    answers = JSON.parse(answersJson);
  } catch (e) {
    alert('В ходе считывания данных произошла ошибка.\nПодробнее - в консоли.');
    console.error(e);
    return;
  }
  const questionsNodes = getQuestionsNodes('paste');
  const handles = {
    choose: pasteChooseAnswer,
    match: pasteMatchAnswer,
    shortanswer: pasteShortAnswer,
  };

  for (const question of questionsNodes) {
    const answer = question.querySelector('.answer');
    const nameNode = question.querySelector('.qtext');
    const name = nameNode.innerText;

    const answerForQuestion = answers[name];
    const typeOfQuestion = getQuestionType(question);
    if (!answerForQuestion || !typeOfQuestion) {
      continue;
    }

    handles[typeOfQuestion](answer, answerForQuestion);
  }
}

function renderUI() {
  const pasteButton = document.createElement('button');
  pasteButton.innerText = 'Вставить ответы';
  pasteButton.classList.add('btn', 'btn-secondary', 'paste-answers-btn');
  pasteButton.onclick = () => {
    navigator.clipboard
      .readText()
      .then((value) => {
        pasteAnswersToQuestions(value);
      })
      .catch((err) =>
        alert(
          'Во время вставки произошла ошибка, либо буфер обмена пуст.\nПопробуйте кастомный ввод, нажав на шестеренку.'
        )
      );
  };

  const customField = document.createElement('div');
  customField.classList.add('custom-field-container');
  customField.innerHTML = `
    <button class="custom-paste-answers-btn"></button>
    <textarea class="custom-json-field" placeholder="Введи ответы в JSON формате сюда..."></textarea>
    <button class="submit-custom-json">Вставить ответы</button>
  `;
  customField.querySelector('.custom-paste-answers-btn').onclick = () => {
    customField.classList.toggle('expanded');
    pasteButton.classList.toggle('disabled');
  };
  customField.querySelector('.submit-custom-json').onclick = () => {
    pasteAnswersToQuestions(customField.querySelector('textarea').value);
  };

  const div = document.createElement('div');
  Object.assign(div.style, {
    display: 'flex',
    margin: '20px auto',
  });
  div.append(pasteButton, customField);
  document.querySelector('#region-main').prepend(div);
}

window.addEventListener('load', () => {
  renderUI();
  setLinks();
});
