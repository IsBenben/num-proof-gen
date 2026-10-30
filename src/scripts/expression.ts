export const operators = ['+', '-', '*', '/', '^'] as const;
type Operator = (typeof operators)[number];

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

export class ExpressionTree {
  readonly lst: ExpressionLike;
  readonly operator: Operator;
  readonly rst: ExpressionLike;
  string?: string;

  constructor(
    lst: ExpressionTree | number,
    operator: Operator,
    rst: ExpressionTree | number,
  ) {
    this.lst = lst;
    this.operator = operator;
    this.rst = rst;
  }

  toString(): string {
    if (typeof this.string === 'string') {
      return this.string;
    }
    // 仅考虑论证中出现的正整数表达式
    // 此处简化处理^，不考虑从右至左运算
    let leftString: string = this.lst.toString(),
      rightString: string = this.rst.toString();
    if (
      typeof this.lst === 'object' &&
      priorities[this.operator] > priorities[this.lst.operator]
    ) {
      leftString = `(${leftString})`;
    }
    if (
      typeof this.rst === 'object' &&
      priorities[this.operator] > priorities[this.rst.operator]
    ) {
      rightString = `(${rightString})`;
    } else if (
      typeof this.rst === 'object' &&
      priorities[this.operator] == priorities[this.rst.operator] &&
      !(this.operator === '+' || this.operator === '*')
    ) {
      // 不满足交换律
      rightString = `(${rightString})`;
    }
    this.string = `${leftString}${this.operator}${rightString}`;
    return this.string;
  }

  calculate(): number {
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
    return operation(leftValue, rightValue);
  }
}
