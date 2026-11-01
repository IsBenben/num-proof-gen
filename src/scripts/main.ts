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
} from './dom';
import { homo } from './generator';
import '../style.css';
import { getExpressionsData } from './datagen';
import { formats, type ExpressionLike, type Format } from './expression';

if (import.meta.env.DEV) {
  // @ts-ignore
  window.getExpressionsData = getExpressionsData;
}

const isDigits = (s: string) => /^[0-9]+$/.test(s);
function isValidInput() {
  return mode.value.length <= 11 && isDigits(mode.value) && input.value !== '';
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
  nums: Record<string, ExpressionLike>,
) {
  otherFormatsPres.forEach((pre, index) => {
    const mappedContent = homo(nums, formatsOrder[index])(num);
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
  result.textContent = `${+num}=${homo(nums, formats.DEFAULT)(+num)}`;
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

input.addEventListener('input', () => {
  updateInput();
});
