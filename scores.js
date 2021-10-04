function getAnsw() {
  const answ_nodes = [
    ...document.querySelector(".questionflagsaveform").children[0].children,
  ].filter((el) => el.classList.contains("que"));

  let answers = {};
  for (let ans of answ_nodes) {
    const answer = ans.querySelector(".answer");
    const name = ans.querySelector(".qtext").innerText;
    if (ans.classList.contains("multichoice")) {
      let answObj = [];
      for (let el of answer.children) {
        let inp = el.querySelector("input");
        const labelNode = el.querySelector("label");
        const label = labelNode.cloneNode(true);
        label.children[0].remove();
        const lab = label.innerText.replace(/\u00A0|^\s+|\s+$/g, "");
        if (inp.checked) answObj.push(lab);
      }
      answers[name] = answObj;
    } else if (ans.classList.contains("match")) {
      let answObj = {};
      const tbody = answer.children[0];

      for (const tr of tbody.children) {
        const p = tr.querySelector(".text p").innerText;
        const choice = tr.querySelector("select");
        answObj[p] = choice.children[choice.selectedIndex].innerText;
      }
      answers[name] = answObj;
    }
  }

  navigator.clipboard
    .writeText(JSON.stringify(answers))
    .then(alert("Скопировано!"))
    .catch((e) => console.error(e));
}

const answBtn = document.createElement("button");
answBtn.innerText = "Скопировать ответы";
answBtn.onclick = getAnsw;
answBtn.classList.add("btn", "btn-primary");
answBtn.style.margin = "20px";
document.querySelector(".quizreviewsummary").append(answBtn);
