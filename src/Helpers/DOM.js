export const createBtn = (text, classes, onClick) => {
  const btn = document.createElement('button');
  btn.innerText = text;
  btn.onclick = onClick;
  btn.classList.add(...classes);
  return btn;
};
