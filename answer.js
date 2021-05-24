function pasteAnsw(val) {
  const answers = JSON.parse(val);
  const answ_nodes = [
    ...document.querySelector("#responseform").children[0].children,
  ].filter((el) => el.classList.contains("que"));

  for (const ans of answ_nodes) {
    const answer = ans.querySelector(".answer");
    if (ans.classList.contains("multichoice")) {
      for (let el of answer.children) {
        let inp = el.querySelector("input");
        if (inp.id == answers[ans.id]) inp.checked = true;
      }
    } else if (ans.classList.contains("match")) {
      const answObj = answers[ans.id];
      if (!answObj) continue;
      const tbody = answer.children[0];

      for (const tr of tbody.children) {
        const choice = tr.querySelector("select");
        choice.selectedIndex = answObj[choice.id];
      }
    }
  }
}

const doc = document.querySelector("#region-main");
if (doc) {
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
  doc.prepend(div);
}
