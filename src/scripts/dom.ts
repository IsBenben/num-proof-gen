function requireElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Required element not found: ${selector}`);
  }
  return el;
}

export const input = requireElement<HTMLInputElement>('#input');
export const settings = requireElement<HTMLFormElement>('#settings');
export const mode = requireElement<HTMLSelectElement>('#mode');
export const result = requireElement<HTMLParagraphElement>('#result');
