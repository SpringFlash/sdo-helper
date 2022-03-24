import {
  getQuestionsNodes,
  getQuestionType,
  getJsonWithAnswers,
  getAnswerGrade,
} from '../../Helpers/getters';
import { getChooseAnswer, getMatchAnswer, getShortAnswer } from '../../Helpers/parsers';

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
  document.querySelector('.quizreviewsummary')?.append(answBtn);
}

window.addEventListener('load', () => {
  renderUI();
});
