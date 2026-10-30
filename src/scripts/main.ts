import data from './data';
import { input, mode, result, settings } from './dom';
import { homo } from './generator';
import '../style.css';

function updateInput() {
  const num = input.value;
  if (num === '') {
    result.textContent = '';
    return;
  }
  const option = mode.selectedOptions[0];
  if (option === null) {
    return;
  }
  const nums = data[option.value as unknown as keyof typeof data];
  result.textContent = `${num}=${homo(nums)(+num)}`;
}

settings.addEventListener('submit', (e) => {
  e.preventDefault();
  updateInput();
});

mode.addEventListener('change', () => {
  updateInput();
});

input.addEventListener('input', () => {
  updateInput();
});
