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
