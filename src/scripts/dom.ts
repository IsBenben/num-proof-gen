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
export const result = requireElement<HTMLParagraphElement>('#result');
