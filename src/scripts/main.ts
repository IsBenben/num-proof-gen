import {
  input,
  mode,
  otherFormats,
  otherFormatsButtons,
  otherFormatsCopies,
  otherFormatsPres,
  otherFormatsChars,
  otherFormatsTabs,
  result,
  settings,
  enableRandom,
} from './dom';
import { homo } from './generator';
import '../style.css';
import { getExpressionsData } from './datagen';
import { formats, type ExpressionTree, type Format } from './expression';

if (import.meta.env.DEV) {
  // @ts-ignore
  window.getExpressionsData = getExpressionsData;
}

const isDigits = (s: string) => /^[0-9]+$/.test(s);
function isValidInput() {
  const isValidMode =
    mode.value.length <= 11 && isDigits(mode.value) && mode.value[0] !== '0';
  return isValidMode && input.value !== '';
}

function generate(
  Nums: Record<string, ExpressionTree>,
  format: Format,
  number: unknown,
): string {
  let best = homo(Nums, format, 1)(number);
  if (!enableRandom.checked) {
    return best;
  }
  for (let i = 1; i > 0.05; i -= 0.05) {
    const string = homo(Nums, format, i)(number);
    if (string.length < best.length) {
      best = string;
    }
  }
  return best;
}

// tabs
function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

otherFormatsButtons.forEach((button, buttonIndex) => {
  button.addEventListener('click', () => {
    otherFormatsTabs.forEach((tab, tabIndex) => {
      if (buttonIndex === tabIndex) {
        tab.style.display = 'block';
      } else {
        tab.style.display = 'none';
      }
    });
  });
});

otherFormatsCopies.forEach((copy, index) => {
  copy.addEventListener('click', () => {
    copyText(otherFormatsPres[index].textContent);
  });
});

const formatsOrder: Format[] = [formats.MATH, formats.PYTHON, formats.TEX];
function updateOtherFormatsPres(
  num: number,
  nums: Record<string, ExpressionTree>,
) {
  otherFormatsPres.forEach((pre, index) => {
    const mappedContent = generate(nums, formatsOrder[index], num);
    pre.textContent = mappedContent;
    otherFormatsChars[index].textContent = mappedContent.length + '字符';
  });
}

function updateInput() {
  if (!isValidInput()) {
    result.textContent = '';
    otherFormats.style.display = 'none';
    return;
  }
  const num = input.value;
  const nums = getExpressionsData(+mode.value);
  result.textContent = `${+num}=${generate(nums, formats.DEFAULT, +num)}`;
  otherFormats.style.display = 'block';
  updateOtherFormatsPres(+num, nums);
}

settings.addEventListener('submit', (e) => {
  e.preventDefault();
  updateInput();
});

mode.addEventListener('input', () => {
  updateInput();
});

enableRandom.addEventListener('input', () => {
  updateInput();
});

input.addEventListener('input', () => {
  updateInput();
});
