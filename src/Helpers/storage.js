export function setAreaValueToStorage(text, index) {
  const storage = window.localStorage;
  const newAreas = JSON.parse(storage.getItem('areas') || '[]');
  newAreas[index] = text;
  storage.setItem('areas', JSON.stringify(newAreas));
}

export function removeAreaValueFromStorage(index) {
  const storage = window.localStorage;
  const newAreas = JSON.parse(storage.getItem('areas') || '[]');
  newAreas.splice(index, 1);
  storage.setItem('areas', JSON.stringify(newAreas));
}

export function clearAreasStorage() {
  window.localStorage.setItem('areas', '[]');
}
