import {
  getQuestionsNodes,
  getQuestionType,
  getLabel,
  pasteChooseAnswer,
  pasteMatchAnswer,
  pasteShortAnswer,
  createBtn,
  upload,
  readFile,
  writeToClipboard,
} from '../../Helpers';

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

  const answerBlock = nameNode.parentNode.querySelector('.ablock');
  const [prompt, answers] = answerBlock.innerText.split(':');

  const copyGptButton = document.createElement('button');
  copyGptButton.classList.add('gpt-prompt');

  const gptPostfix =
    'В ответ пришли только JSON-формат типа:\n`{answer: [""], description: ""}`\nГде answer - это массив с буквами выбранных вариантов, description - описание выбора';
  const textForGpt = `${nameNode.innerText.trim()}\n${prompt}, но объясни почему:${answers}\n${gptPostfix}`;

  copyGptButton.addEventListener('click', (e) => {
    e.preventDefault();
    writeToClipboard({ text: textForGpt });
  });

  searchButtons.append(copyGptButton);

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
  const pasteButton = createBtn(
    'Вставить ответы\n(из буфера)',
    ['btn', 'btn-secondary', 'paste-answers-btn'],
    () => {
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
    }
  );

  const uploadBtn = createBtn(
    '',
    ['btn', 'btn-secondary', 'paste-answers-btn', 'upload-btn'],
    async () => {
      const content = await upload();
      pasteAnswersToQuestions(content);
    }
  );

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
    uploadBtn.classList.toggle('disabled');
  };
  customField.querySelector('.submit-custom-json').onclick = () => {
    pasteAnswersToQuestions(customField.querySelector('textarea').value);
  };

  const div = document.createElement('div');
  Object.assign(div.style, {
    display: 'flex',
    margin: '20px auto',
  });
  div.append(pasteButton, uploadBtn, customField);
  document.querySelector('#region-main').prepend(div);

  // MOVE TO HELPERS
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  document.body.addEventListener('drop', async (e) => {
    const item = e.dataTransfer.items?.[0];
    if (item?.kind !== 'file') {
      return;
    }

    const file = item.getAsFile();
    if (file.type !== 'application/json') {
      return;
    }

    const content = await readFile(file);
    pasteAnswersToQuestions(content);
  });
}

window.addEventListener('load', () => {
  renderUI();
  setLinks();
});
