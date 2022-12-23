import axios from 'axios';
import {
  getQuestionsNodes,
  getQuestionType,
  copyJsonWithAnswers,
  getAnswerGrade,
  getChooseAnswer,
  getMatchAnswer,
  getShortAnswer,
  createBtn,
  downloadJson,
} from '../../Helpers';

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

  return answers;
}

async function renderUI() {
  const answBtn = createBtn('Скопировать ответы', ['btn', 'btn-primary', 'copy-btn'], () => {
    const answers = parseAnswersToJSON();
    copyJsonWithAnswers(answers);
  });
  const saveAnswBtn = createBtn('', ['btn', 'btn-primary', 'save-btn'], () => {
    const answers = parseAnswersToJSON();
    downloadJson(answers, 'Ответы');
  });

  const div = document.createElement('div');
  div.className = 'actions-buttons';
  div.append(answBtn, saveAnswBtn);
  document.querySelector('.quizreviewsummary')?.append(div);
}

window.addEventListener('load', () => {
  renderUI();
});
