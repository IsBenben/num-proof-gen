import { ExpressionLeaf, ExpressionNode, ExpressionTree } from './expression';

const constructExpressionTrees = (
  numbers: readonly number[],
  callback: (expression: ExpressionTree) => void,
): void => {
  const dfs = (depth: number, expressions: ExpressionTree[]) => {
    if (expressions.length === 1) {
      callback(expressions[0]);
      return;
    }
    for (let i = 0; i < expressions.length - 1; i++) {
      for (const j of ['+', '-', '*', '/'] as const) {
        const expressionTree = new ExpressionNode(
          expressions[i],
          j,
          expressions[i + 1],
        );
        expressions.splice(i, 2, expressionTree);
        dfs(depth + 1, expressions);
        expressions.splice(i, 1, expressionTree.lst, expressionTree.rst);
      }
    }
  };
  dfs(
    0,
    numbers.map((value) => new ExpressionLeaf(value)),
  );
};

const arrangeNumbers = (
  digits: readonly string[],
  maxParts: number,
  callback: (numbers: number[]) => void,
): void => {
  const arranged: number[] = [];
  const dfs = (index: number): void => {
    if (index === digits.length) {
      callback(arranged);
      return;
    }
    if (arranged.length >= maxParts - 1) {
      const remaining = digits.slice(index).join('');
      if (remaining.length > 1 && remaining[0] === '0') {
        return;
      }
      callback(arranged.concat(parseInt(remaining, 10)));
      return;
    }
    for (let i = 1; i < digits.length - index + 1; i++) {
      const remaining = digits.slice(index, index + i).join('');
      if (remaining.length > 1 && remaining[0] === '0') {
        continue;
      }
      arranged.push(parseInt(remaining, 10));
      dfs(index + i);
      arranged.pop();
    }
  };
  dfs(0);
};

const COMPLETION_TARGETS: number[] = Array.from(
  { length: 18 },
  (_, i) => i - 1,
);

const isEquals = (value: number, target: number) =>
  Math.abs(value - target) <= Math.max(1e-9, Math.abs(target) * 1e-12);

const isBetterThan = (
  newExpression: ExpressionTree,
  oldExpression: ExpressionTree | undefined,
) =>
  oldExpression === undefined ||
  newExpression.toString().length < oldExpression.toString().length;

const completeExpressionData = (
  result: Record<string, ExpressionTree>,
): Record<string, ExpressionTree> => {
  let changed = true;
  while (changed) {
    changed = false;
    const missing = COMPLETION_TARGETS.filter(
      (target) => result[String(target)] === undefined,
    );
    if (missing.length === 0) break;

    for (const target of missing) {
      let best: ExpressionTree | undefined;
      const consider = (expr: ExpressionTree) => {
        if (isBetterThan(expr, best)) {
          best = expr;
        }
      };

      for (const key of Object.keys(result)) {
        const exprA = result[key];
        const a = +key;

        // 加法：A + B = target，B = target - a
        const bAdd = result[String(target - a)];
        if (bAdd !== undefined) {
          consider(new ExpressionNode(exprA, '+', bAdd));
        }

        // 减法正向：A - B = target，B = a - target
        const bSubForward = result[String(a - target)];
        if (bSubForward !== undefined) {
          consider(new ExpressionNode(exprA, '-', bSubForward));
        }

        // 减法反向：B - A = target，B = target + a
        const bSubReverse = result[String(target + a)];
        if (bSubReverse !== undefined) {
          consider(new ExpressionNode(bSubReverse, '-', exprA));
        }

        // 乘法：A * B = target，B = target / a
        if (a !== 0 && target % a === 0) {
          const bMul = result[String(target / a)];
          if (bMul !== undefined) {
            consider(new ExpressionNode(exprA, '*', bMul));
          }
        }

        // 除法正向：A / B = target，B = A / target
        if (target !== 0 && a !== 0 && a % target === 0) {
          const bDivForward = result[String(a / target)];
          if (bDivForward !== undefined) {
            consider(new ExpressionNode(exprA, '/', bDivForward));
          }
        }

        // 除法反向：B / A = target，B = target * A
        if (a !== 0) {
          const bDivReverse = result[String(target * a)];
          if (bDivReverse !== undefined) {
            consider(new ExpressionNode(bDivReverse, '/', exprA));
          }
        }
      }

      if (best !== undefined) {
        result[String(target)] = best;
        changed = true;
      }
    }
  }
  return result;
};

const expressionsData: Record<number, Record<string, ExpressionTree>> = {};

export const getExpressionsData = (
  number: number,
): Record<string, ExpressionTree> => {
  if (expressionsData[number]) {
    return expressionsData[number];
  }
  const result: Record<string, ExpressionTree> = {};
  const stringNumber = number.toString();
  arrangeNumbers(
    [...stringNumber],
    stringNumber.length >= 7 ? 5 : 6,
    (numbers) =>
      constructExpressionTrees(numbers, (expression) => {
        const value = expression.calculate();
        const roundedValue = Math.round(value);
        if (
          Number.isFinite(roundedValue) &&
          roundedValue >= -1 &&
          isEquals(value, roundedValue)
        ) {
          if (isBetterThan(expression, result[roundedValue])) {
            result[roundedValue] = expression;
          }
        }
      }),
  );
  expressionsData[number] = completeExpressionData(result);
  return expressionsData[number];
};
