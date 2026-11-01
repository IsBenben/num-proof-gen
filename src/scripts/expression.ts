export const operators = ['+', '-', '*', '/', '^'] as const;
type Operator = (typeof operators)[number];

export const formats = {
  DEFAULT: 'DEFAULT',
  MATH: 'MATH',
  PYTHON: 'PYTHON',
  TEX: 'TEX',
} as const;

const displayOperators: Record<Format, Record<Operator, string>> = {
  DEFAULT: {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '^': '^',
  },
  MATH: {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
    '^': '^',
  },
  PYTHON: {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '^': '**',
  },
  TEX: {
    '+': '+',
    '-': '-',
    '*': ' \\times ',
    '/': ' \\div ',
    '^': '^',
  },
} as const;

export type Format = (typeof formats)[keyof typeof formats];

const priorities: Record<Operator, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
} as const;

export const operations: Record<Operator, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '^': (a, b) => Math.pow(a, b),
} as const;

const applyParentheses = (string: string, format: Format): string =>
  format !== formats.TEX ? `(${string})` : `\\left(${string}\\right)`;

export abstract class ExpressionTree {
  abstract calculate(): number;
  abstract toStringCustom(format: Format): string;
  abstract getPriority(): number;

  toString(): string {
    return this.toStringCustom(formats.DEFAULT);
  }
}

export class ExpressionNode extends ExpressionTree {
  readonly lst: ExpressionTree;
  readonly operator: Operator;
  readonly rst: ExpressionTree;
  private value?: number;
  private stringCache: Partial<Record<Format, string>>;

  constructor(lst: ExpressionTree, operator: Operator, rst: ExpressionTree) {
    super();
    this.lst = lst;
    this.operator = operator;
    this.rst = rst;
    this.stringCache = {};
  }

  toString(): string {
    return this.toStringCustom(formats.DEFAULT);
  }

  toStringCustom(format: Format): string {
    if (typeof this.stringCache[format] === 'string') {
      return this.stringCache[format];
    }
    // 仅考虑论证中出现的正整数表达式
    // 此处简化处理^，不考虑从右至左运算
    let leftString: string = this.lst.toStringCustom(format),
      rightString: string = this.rst.toStringCustom(format);

    if (format === formats.TEX) {
      if (this.operator === '^') {
        if (this.getPriority() > this.lst.getPriority()) {
          leftString = applyParentheses(leftString, format);
        }
        this.stringCache[format] = `{${leftString}}^{${rightString}}`;
        return this.stringCache[format];
      }
    }

    if (this.getPriority() > this.lst.getPriority()) {
      leftString = applyParentheses(leftString, format);
    }
    if (this.getPriority() > this.rst.getPriority()) {
      rightString = applyParentheses(rightString, format);
    } else if (
      this.getPriority() == this.rst.getPriority() &&
      !(this.operator === '+' || this.operator === '*')
    ) {
      // 不满足交换律
      rightString = applyParentheses(rightString, format);
    }

    const displayOperator = displayOperators[format][this.operator];
    this.stringCache[format] = `${leftString}${displayOperator}${rightString}`;
    return this.stringCache[format];
  }

  calculate(): number {
    if (typeof this.value === 'number') {
      return this.value;
    }
    const leftValue = this.lst.calculate();
    const rightValue = this.rst.calculate();
    const operation = operations[this.operator];
    this.value = operation(leftValue, rightValue);
    return this.value;
  }

  getPriority() {
    return !this.rst ? 4 : priorities[this.operator];
  }
}

export class ExpressionLeaf extends ExpressionTree {
  readonly value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  toStringCustom(_: Format): string {
    return this.value.toString();
  }

  calculate(): number {
    return this.value;
  }

  getPriority() {
    return 99;
  }
}
