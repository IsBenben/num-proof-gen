import {
  input,
  mode,
  otherFormats,
  otherFormatsButtons,
  result,
  settings,
  enableRandom,
  otherFormatsCopy,
  otherFormatsPre,
  otherFormatsChars,
  otherFormatsFormat,
  footer,
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
  number: number,
): number {
  if (!enableRandom.checked) {
    return 1;
  }
  let best = homo(Nums, format, 1)(number),
    bestI = 1;
  for (let i = 1; i > 0.01; i -= 0.01) {
    const string = homo(Nums, format, i)(number);
    if (string.length < best.length) {
      best = string;
      bestI = i;
    }
  }
  return bestI;
}

// other formats
function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

let currentTab: number = 0;

otherFormatsButtons.forEach((button, buttonIndex) => {
  button.addEventListener('click', () => {
    currentTab = buttonIndex;
    updateOutput();
  });
});

otherFormatsCopy.addEventListener('click', () => {
  copyText(otherFormatsPre.textContent);
});

const formatsOrder: Format[] = [formats.MATH, formats.PYTHON, formats.TEX];

function updateOutput() {
  const num = input.value;
  const nums = getExpressionsData(+mode.value);
  const bestProb = generate(nums, formats.DEFAULT, +num);

  result.textContent = `${+num}=${homo(nums, formats.DEFAULT, bestProb)(+num)}`;
  footer.style.paddingTop = '0';

  otherFormats.style.display = 'block';
  const otherFormatsContent = homo(
    nums,
    formatsOrder[currentTab],
    bestProb,
  )(+num);
  otherFormatsPre.textContent = otherFormatsContent;
  otherFormatsChars.textContent = otherFormatsContent.length + '字符';
  otherFormatsFormat.textContent = otherFormatsButtons[currentTab].textContent;
}

function updateInput() {
  if (!isValidInput()) {
    result.textContent = '';
    footer.style.paddingTop = '50px';
    otherFormats.style.display = 'none';
    return;
  }
  updateOutput();
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
