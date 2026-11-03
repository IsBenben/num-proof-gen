function requireElement<T extends HTMLElement>(
  selector: string,
  parentNode: ParentNode = document,
): T {
  const el = parentNode.querySelector<T>(selector);
  if (import.meta.env.DEV && !el) {
    throw new Error(`Required element not found: ${selector}`);
  }
  return el!;
}

export const settings = requireElement<HTMLInputElement>('#settings');
export const mode = requireElement<HTMLSelectElement>('#mode');
export const input = requireElement<HTMLInputElement>('#input');
export const enableRandom = requireElement<HTMLInputElement>('#enable-random');
export const result = requireElement<HTMLParagraphElement>('#result');
export const footer = requireElement<HTMLElement>('#footer');
export const randomExample = requireElement<HTMLAnchorElement>('#random-example');
export const exactDivisionOnly = requireElement<HTMLInputElement>('#exact-division-only');

export const otherFormats = requireElement<HTMLDivElement>('#other-formats');
export const otherFormatsButtons: NodeListOf<HTMLButtonElement> =
  otherFormats.querySelectorAll('.tabs button');
export const otherFormatsPre =
  requireElement<HTMLPreElement>('#other-formats pre', otherFormats);
export const otherFormatsChars =
  requireElement<HTMLSpanElement>('#other-formats-chars', otherFormats);
  export const otherFormatsFormat =
  requireElement<HTMLSpanElement>('#other-formats-format', otherFormats);
export const otherFormatsCopy =
  requireElement<HTMLButtonElement>('#other-formats-copy', otherFormats);
