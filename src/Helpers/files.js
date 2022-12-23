export function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function downloadJson(content, name) {
  try {
    const json = JSON.stringify(content);
    download(json, `${name}.json`, 'application/json');
  } catch (e) {
    console.error('Downloading JSON error:', e);
  }
}

export function upload() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.addEventListener('change', () => {
      const file = input.files[0];
      readFile(file).then(resolve);
    });
  });
}

export function readFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
    }

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.addEventListener('load', (e) => resolve(e.target.result));
  });
}
