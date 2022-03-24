import { getQuestionsNodes, getQuestionType, getLabel } from '../../Helpers/getters';
import { pasteChooseAnswer, pasteMatchAnswer, pasteShortAnswer } from '../../Helpers/parsers';

function addSearchLink(nameNode) {
  const searchUrls = [
    { url: 'https://google.com/search', param: 'q', class: 'google' },
    { url: 'https://yandex.ru/search', param: 'text', class: 'yandex' },
    { url: 'https://duckduckgo.com', param: 'q', class: 'duckduckgo' },
  ];

  const searchButtons = document.createElement('div');
  searchButtons.classList.add('search-buttons');

  for (const search of searchUrls) {
    const url = new URL(search.url);
    url.searchParams.set(search.param, nameNode.innerText);

    const link = document.createElement('a');
    link.target = '_blank';
    link.href = url;

    link.classList.add(search.class);
    searchButtons.append(link);
  }

  nameNode.append(searchButtons);
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
