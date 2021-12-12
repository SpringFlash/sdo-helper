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

function getJsonWithAnswers(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => alert('Скопировано!'))
      .catch((e) => {
        console.error(e);
      });
  } else {
    window.clipboardData.setData('text', text);
  }
}

function getAnswerGrade(question) {
  return question
    .querySelector('.grade')
    .innerText.split(':')[1]
    .split('из')
    .map((el) => parseInt(el));
}
/* ---------------------------------------- src/parsers --------------------------------------------*/
function getChooseAnswer(answer, currentAnswer) {
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

function getMatchAnswer(answer, currentAnswer) {
  const matches = {};
  const table = answer.children[0];

  for (const row of table.children) {
    const rowName = row.querySelector('.text p').innerText;
    const choice = row.querySelector('select');
    matches[rowName] = choice.children[choice.selectedIndex].innerText;
  }
  return Object.assign(matches, currentAnswer || {});
}

function getShortAnswer(answer) {
  const inputValue = answer.querySelector('.form-control').value;
  return inputValue;
}

/* ------------------------------------- src/GetAnswers.js ----------------------------- */
function parseAnswersToJSON() {
  const questionsNodes = getQuestionsNodes('get');
  const handles = {
    choose: getChooseAnswer,
    match: getMatchAnswer,
    shortanswer: getShortAnswer,
  };

  const answers = Object.fromEntries(
    questionsNodes.reduce((acc, question) => {
      const answer = question.querySelector('.answer');
      const grade = getAnswerGrade(question);
      const isCorrect = parseInt(grade) !== 0;
      if (isCorrect) {
        const name = question.querySelector('.qtext').innerText;
        const handleForCurrentType = handles[getQuestionType(question)];
        if (!handleForCurrentType) {
          return acc;
        }

        const result = [name, handleForCurrentType(answer, acc?.[name])];
        acc.push(result);
      }
      return acc;
    }, [])
  );

  getJsonWithAnswers(JSON.stringify(answers));
}

function renderUI() {
  const answBtn = document.createElement('button');
  answBtn.innerText = 'Скопировать ответы';
  answBtn.onclick = parseAnswersToJSON;
  answBtn.classList.add('btn', 'btn-primary');
  answBtn.style.margin = '20px 0';
  document.querySelector('.quizreviewsummary').append(answBtn);
}

window.addEventListener('load', () => {
  renderUI();
});
