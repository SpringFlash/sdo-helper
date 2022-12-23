export function copyJsonWithAnswers(text) {
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
