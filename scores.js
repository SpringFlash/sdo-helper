function getAnsw() {
  const answ_nodes = [
    ...document.querySelector(".questionflagsaveform").children[0].children,
  ].filter((el) => el.classList.contains("que"));

  let answers = {};
  for (let ans of answ_nodes) {
    let answer = ans.querySelector(".answer");
    if (ans.classList.contains("multichoice")) {
      for (let el of answer.children) {
        let inp = el.querySelector("input");
        if (inp.checked) answers[ans.id] = inp.id;
      }
    } else if (ans.classList.contains("match")) {
      let answObj = {};
      const tbody = answer.children[0];

      for (const tr of tbody.children) {
        const choice = tr.querySelector("select");
        answObj[choice.id] = choice.selectedIndex;
      }
      answers[ans.id] = answObj;
    }
  }

  navigator.clipboard
    .writeText(JSON.stringify(answers))
    .then(alert("Скопировано!"))
    .catch((e) => console.error(e));
}

const doc = document.querySelector(".quizreviewsummary");
if (doc) {
  const answBtn = document.createElement("button");
  answBtn.innerText = "Скопировать ответы";
  answBtn.onclick = getAnsw;
  answBtn.classList.add("btn", "btn-primary");
  answBtn.style.margin = "20px";
  doc.append(answBtn);
}
