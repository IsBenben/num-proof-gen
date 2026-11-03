import '../style.css';
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
  exactDivisionOnly,
  gettingStarted,
} from './dom';
import { homo } from './generator';
import { getExpressionsData } from './datagen';
import { formats, type ExpressionTree, type Format } from './expression';

declare global {
  interface Window {
    getExpressionsData: typeof getExpressionsData;
  }
}
if (import.meta.env.DEV) {
  window.getExpressionsData = getExpressionsData;
}

const isDigits = (s: string) => /^[0-9]+$/.test(s);
function isValidInput() {
  const isValidMode =
    mode.value.length <= 13 && isDigits(mode.value) && mode.value[0] !== '0';
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

function updateHash() {
  if (input.value === '' && mode.value === '1234') {
    window.location.hash = '';
    return;
  }
  let hash: string = `#${input.value},${mode.value}`;
  const checkBoxValue =
    (+exactDivisionOnly.checked << 1) | +enableRandom.checked;
  if (checkBoxValue) {
    hash = hash + ',' + checkBoxValue;
  }
  window.location.hash = hash;
}

function updateOutput() {
  if (!isValidInput()) {
    result.textContent = '';
    footer.style.paddingTop = '50px';
    otherFormats.style.display = 'none';
    return;
  }

  const num = input.value,
    modeValue = +mode.value;
  const nums = getExpressionsData(modeValue, exactDivisionOnly.checked);
  const bestProb = generate(nums, formats.DEFAULT, +num);

  result.textContent = `${+num}=${homo(nums, formats.DEFAULT, bestProb)(+num)}`;
  footer.style.paddingTop = '0';

  otherFormats.style.display = 'block';
  let otherFormatsContent;
  if (currentTab !== 3) {
    // 分享链接
    otherFormatsContent = homo(nums, formatsOrder[currentTab], bestProb)(+num);
  } else {
    otherFormatsContent = window.location.toString();
  }
  otherFormatsPre.textContent = otherFormatsContent;
  otherFormatsChars.textContent = otherFormatsContent.length + '字符';
  otherFormatsFormat.textContent = otherFormatsButtons[currentTab].textContent;
}

function onInputChanged() {
  updateHash();
  updateOutput();
}

// share link
const getTodayDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

const partToValue = (part: string): string =>
  part === 'date'
    ? getTodayDate()
    : part === 'year'
      ? getCurrentYear()
      : part === 'random'
        ? Math.floor(1e5 + Math.random() * 9e5).toString()
        : isNaN(+part)
          ? ''
          : part;

function loadShareLink() {
  const parts = window.location.hash.slice(1).split(',');
  if (parts.length === 0) return;
  const num = partToValue(parts[0]),
    modeValue = partToValue(parts[1]),
    checkboxValue = +parts[2];
  let changed = false;
  if (num !== '') {
    input.value = num;
    changed = true;
  }
  if (modeValue !== '') {
    mode.value = modeValue;
    changed = true;
  }
  if (0 <= checkboxValue && checkboxValue <= 3) {
    if ((checkboxValue & 1) !== 0) {
      enableRandom.checked = true;
    }
    if ((checkboxValue & 2) !== 0) {
      exactDivisionOnly.checked = true;
    }
    changed = true;
  }
  if (changed) {
    updateOutput();
  }
}

loadShareLink();
window.addEventListener('hashchange', () => {
  loadShareLink();
});

gettingStarted.forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const [num, modeValue] = anchor.hash.slice(1).split(',');
    input.value = partToValue(num);
    mode.value = partToValue(modeValue);
    onInputChanged();
    result.scrollIntoView();
  });
});

// events
settings.addEventListener('submit', (e) => {
  e.preventDefault();
  onInputChanged();
});

input.addEventListener('input', () => {
  onInputChanged();
});

mode.addEventListener('input', () => {
  onInputChanged();
});

enableRandom.addEventListener('input', () => {
  onInputChanged();
});

exactDivisionOnly.addEventListener('input', () => {
  onInputChanged();
});
