function requireElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (import.meta.env.DEV && !el) {
    throw new Error(`Required element not found: ${selector}`);
  }
  // @ts-ignore
  return el;
}

export const settings = requireElement<HTMLInputElement>('#settings');
export const mode = requireElement<HTMLSelectElement>('#mode');
export const input = requireElement<HTMLInputElement>('#input');
export const enableRandom = requireElement<HTMLInputElement>('#enable-random');
export const result = requireElement<HTMLParagraphElement>('#result');

export const otherFormats = requireElement<HTMLDivElement>('#other-formats');
export const otherFormatsButtons: NodeListOf<HTMLButtonElement> =
  otherFormats.querySelectorAll('.tabs button');
export const otherFormatsTabs: NodeListOf<HTMLDivElement> =
  otherFormats.querySelectorAll('.tab');
export const otherFormatsPres: NodeListOf<HTMLPreElement> =
  otherFormats.querySelectorAll('.tab pre');
export const otherFormatsChars: NodeListOf<HTMLSpanElement> =
  otherFormats.querySelectorAll('.tab .chars');
export const otherFormatsCopies: NodeListOf<HTMLSpanElement> =
  otherFormats.querySelectorAll('.tab button');
