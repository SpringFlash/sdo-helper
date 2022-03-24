export function getQuestionsNodes(type) {
  const selectors = {
    get: '.questionflagsaveform',
    paste: '#responseform',
  };
  return [...document.querySelector(selectors[type]).children[0].children].filter((el) =>
    el.classList.contains('que')
  );
}

export function getQuestionType(question) {
  const variants = {
    multichoice: 'choose',
    truefalse: 'choose',
    match: 'match',
    shortanswer: 'shortanswer',
    numerical: 'shortanswer',
  };

  return Object.entries(variants).find((variant) => question.classList.contains(variant[0]))?.[1];
}

export function getJsonWithAnswers(text) {
  writeToClipboard({
    text,
    thenFunc: () => alert('Скопировано!'),
    catchFunc: (e) => {
      console.error(e);
    },
  });
}

export function writeToClipboard({ text, thenFunc, catchFunc }) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(thenFunc).catch(catchFunc);
  } else {
    window.clipboardData.setData('text', text);
  }
}

export function getAnswerGrade(question) {
  return question
    .querySelector('.grade')
    .innerText.split(':')[1]
    .split('из')
    .map((el) => parseInt(el));
}

export function getLabel(element) {
  const labelNode = element.querySelector('label').cloneNode(true);
  labelNode.children[0]?.remove();
  return labelNode.innerText.replace(/\u00A0|^\s+|\s+$/g, '').trim();
}

export function getConcateAnswers(answers) {
  return answers.reduce((acc, el) => {
    console.log(acc);
    if (!el) {
      return acc;
    }

    const base = JSON.parse(acc);
    const blockAnswers = JSON.parse(el);
    console.log(blockAnswers);

    const temp = insertAnswersToBase(base, blockAnswers);
    console.log(temp);
    return JSON.stringify(temp);
  }, '{}');
}

/**
 * @param {Object.<string, string|string[]|Object.<string, string>>} base база ответов
 * @param {Object.<string, string|string[]|Object.<string, string>>} answers новый блок ответов
 * @returns {Object.<string, string|string[]|Object.<string, string>>} Новый соединенный объект
 */
export function insertAnswersToBase(base, answers) {
  const newBase = Object.assign({}, base);
  Object.entries(answers).forEach(([name, answer]) => {
    const isExists = Object.keys(newBase).includes(name);
    if (!isExists) {
      newBase[name] = answer;
      return;
    }

    if (answer instanceof Array) {
      newBase[name] = [...newBase[name], ...answer];
    } else if (answer instanceof Object) {
      newBase[name] = { ...newBase[name], ...answer };
    } else {
      newBase[name] = answer;
    }
  });

  return newBase;
}
