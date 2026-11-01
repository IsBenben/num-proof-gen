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

export type ExpressionLike = ExpressionTree | number;

const renderExpressionLike = (
  expression: ExpressionLike,
  format: Format,
): string =>
  typeof expression === 'number'
    ? expression.toString()
    : expression.toStringCustom(format);

const applyParentheses = (string: string, format: Format): string =>
  format !== formats.TEX ? `(${string})` : `\\left(${string}\\right)`;

export class ExpressionTree {
  readonly lst: ExpressionLike;
  readonly operator: Operator;
  readonly rst: ExpressionLike;
  private value?: number;
  private stringCache: Partial<Record<Format, string>>;

  constructor(
    lst: ExpressionTree | number,
    operator: Operator,
    rst: ExpressionTree | number,
  ) {
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
    let leftString: string = renderExpressionLike(this.lst, format),
      rightString: string = renderExpressionLike(this.rst, format);

    if (format === formats.TEX) {
      if (this.operator === '^') {
        if (typeof leftString !== 'number') {
          leftString = applyParentheses(leftString, format);
        }
        this.stringCache[format] = `{${leftString}}^{${rightString}}`;
        return this.stringCache[format];
      }
    }

    if (
      typeof this.lst === 'object' &&
      priorities[this.operator] > priorities[this.lst.operator]
    ) {
      leftString = applyParentheses(leftString, format);
    }
    if (
      typeof this.rst === 'object' &&
      priorities[this.operator] > priorities[this.rst.operator]
    ) {
      rightString = applyParentheses(rightString, format);
    } else if (
      typeof this.rst === 'object' &&
      priorities[this.operator] == priorities[this.rst.operator] &&
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
    let leftValue: number, rightValue: number;
    if (typeof this.lst === 'number') {
      leftValue = this.lst;
    } else {
      leftValue = this.lst.calculate();
    }
    if (typeof this.rst === 'number') {
      rightValue = this.rst;
    } else {
      rightValue = this.rst.calculate();
    }
    const operation = operations[this.operator];
    this.value = operation(leftValue, rightValue);
    return this.value;
  }
}
