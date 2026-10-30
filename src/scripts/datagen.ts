import { ExpressionTree, operations, operators, type ExpressionLike } from "./expression";

const constructExpressionTrees = (
  numbers: readonly number[],
  callback: (expression: ExpressionLike) => any,
): void => {
  const dfs = (depth: number, expressions: ExpressionLike[]) => {
    if (expressions.length === 1) {
      callback(expressions[0]);
      return;
    }
    for (let i = 0; i < expressions.length - 1; i++) {
      for (const j of ['+', '-', '*', '/'] as const) {
        const expressionTree = new ExpressionTree(
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
  dfs(0, [...numbers]);
};

const arrangeNumbers = (
  numbers: readonly string[],
  callback: (numbers: number[]) => any,
): void => {
  let arrange: number[] = [];
  const dfs = (index: number): void => {
    if (index === numbers.length) {
      callback(arrange);
      return;
    }
    for (let i = 1; i < numbers.length - index + 1; i++) {
      arrange.push(parseInt(numbers.slice(index, index + i).join(''), 10));
      dfs(index + i);
      arrange.pop();
    }
  };
  dfs(0);
};

const COMPLETION_TARGETS: number[] = Array.from(
  { length: 18 }, // -1 到 16，共 18 个
  (_, i) => i - 1,
);

const completeExpressionData = (
  result: Record<string, ExpressionLike>,
): Record<string, ExpressionLike> => {
  const EPSILON = 1e-6;
  let changed = true;
  while (changed) {
    changed = false;
    const missing = COMPLETION_TARGETS.filter(
      (target) => result[target] === undefined,
    );
    if (missing.length === 0) break;

    const entries = Object.keys(result).map((key) => {
      const expr = result[key];
      const value = typeof expr === 'number' ? expr : expr.calculate();
      return { value, expr };
    });

    for (const target of missing) {
      let best: ExpressionTree | undefined;
      const consider = (value: number, make: () => ExpressionTree) => {
        if (!Number.isFinite(value) || Math.abs(value - target) >= EPSILON)
          return;
        const expr = make();
        const length = expr.toString().length;
        if (best === undefined || length < best.toString().length) {
          best = expr;
        }
      };

      for (const A of entries) {
        for (const B of entries) {
          for (const op of ['+', '-', '*', '/'] as const) {
            const forward = operations[op](A.value, B.value);
            consider(forward, () => new ExpressionTree(A.expr, op, B.expr));
            if (op === '-' || op === '/') {
              const reverse = operations[op](B.value, A.value);
              consider(reverse, () => new ExpressionTree(B.expr, op, A.expr));
            }
          }
        }
      }

      if (best !== undefined) {
        result[target] = best;
        changed = true;
      }
    }
  }
  return result;
};

const epsilon = 1e-6;

const expressionsData: Record<number, Record<string, ExpressionLike>> = {};

export const getExpressionsData = (
  number: number,
): Record<string, ExpressionLike> => {
  if (expressionsData[number]) {
    return expressionsData[number];
  }
  const result: Record<string, ExpressionLike> = {};
  arrangeNumbers([...number.toString()], (numbers) =>
    constructExpressionTrees(numbers, (expression) => {
      const value =
        typeof expression === 'number' ? expression : expression.calculate();
      const roundedValue = Math.round(value);
      if (
        Number.isFinite(roundedValue) &&
        roundedValue >= -1 &&
        Math.abs(value - roundedValue) < epsilon
      ) {
        const string = expression.toString();
        if (
          result[roundedValue] === undefined ||
          string.length < result[roundedValue].toString().length
        ) {
          result[roundedValue] = expression;
        }
      }
    }),
  );
  expressionsData[number] = completeExpressionData(result);
  return expressionsData[number];
};
