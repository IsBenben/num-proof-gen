import { input, mode, result } from './dom';
import { homo } from './generator';
import '../style.css';
import { getExpressionsData } from './datagen';

if (import.meta.env.DEV) {
  // @ts-ignore
  window.getExpressionsData = getExpressionsData;
}

const isDigits = (s: string) => /^[0-9]+$/.test(s);
function isValidInput() {
  return mode.value.length <= 5 && isDigits(mode.value) && input.value !== '';
}

function updateInput() {
  if (!isValidInput()) {
    result.textContent = '';
    return;
  }
  const num = input.value;
  const nums = getExpressionsData(+mode.value);
  result.textContent = `${+num}=${homo(nums)(+num)}`;
}

mode.addEventListener('input', () => {
  updateInput();
});

input.addEventListener('input', () => {
  updateInput();
});
