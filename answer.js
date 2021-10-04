function pasteAnsw(val) {
  const answers = JSON.parse(val);
  const answ_nodes = [
    ...document.querySelector("#responseform").children[0].children,
  ].filter((el) => el.classList.contains("que"));

  for (const ans of answ_nodes) {
    const answer = ans.querySelector(".answer");
    const name = ans.querySelector(".qtext").innerText;
    const answObj = answers[name];
    if (!answObj) continue;
    if (ans.classList.contains("multichoice")) {
      for (let el of answer.children) {
        let inp = el.querySelector(`input:not([type="hidden"])`);
        const labelNode = el.querySelector("label");
        const label = labelNode.cloneNode(true);
        label.children[0].remove();
        const lab = label.innerText.replace(/\u00A0|^\s+|\s+$/g, "");
        if (answObj.includes(lab)) {
          inp.checked = true;
        }
      }
    } else if (ans.classList.contains("match")) {
      const tbody = answer.children[0];

      for (const tr of tbody.children) {
        const p = tr.querySelector(".text p").innerText;
        const choice = tr.querySelector("select");
        [...choice.children].forEach((el, ind) => {
          if (el.innerText == answObj[p]) choice.selectedIndex = ind;
        });
      }
    }
  }
}

const ta = document.createElement("textarea");
ta.style.height = "40px";
const btn = document.createElement("button");
btn.innerText = "Вставить ответы";
btn.classList.add("btn", "btn-secondary");
btn.style.margin = "2px 20px";
btn.onclick = () => pasteAnsw(ta.value);
const div = document.createElement("div");
Object.assign(div.style, {
  display: "flex",
  margin: "20px auto",
});
div.append(ta, btn);
document.querySelector("#region-main").prepend(div);
