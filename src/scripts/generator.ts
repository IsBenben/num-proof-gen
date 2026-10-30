export const homo = (
  Nums: Record<string, { toString(): string }>,
): ((num: unknown) => string) => {
  /*!
   * This function contains third-party code from itorr/homo (the Homo Number Argument Generator).
   *
   * - Source: https://github.com/itorr/homo
   * - Homepage: https://lab.magiconch.com/homo/
   * - License: MIT
   *
   * MIT License
   *
   * Copyright (c) 2020 https://github.com/itorr/homo
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  const numsReversed: number[] = Object.keys(Nums)
    .map((x) => +x)
    .filter((x) => x > 0);
  const getMinDiv = (num: number): number => {
    for (let i = numsReversed.length - 1; i >= 0; i--)
      if (num >= numsReversed[i]) return numsReversed[i];
    return 1;
  };
  const isDotRegex = /\.(\d+?)0{0,}$/;
  const demolish = (num: unknown): string => {
    if (typeof num !== 'number') return '';

    if (num === Infinity || Number.isNaN(num))
      return `这么恶臭的${num}有必要论证吗`;

    if (num < 0) return `(负)*(${demolish(num * -1)})`.replace(/\*\(1\)/g, '');

    if (!Number.isInteger(num)) {
      // abs(num) is definitely smaller than 2**51
      // rescale
      const matched = num.toFixed(16).match(isDotRegex);
      if (!matched) {
        return `(${demolish(num * 10)})/(10)`;
      }
      const n = matched[1].length;
      console.log(n);
      if (n !== 1) {
        return `(${demolish(num * Math.pow(10, n))})/(10)^(${n})`;
      }
      return `(${demolish(num * Math.pow(10, n))})/(10)`;
    }

    if (Nums[num]) return String(num);

    const div = getMinDiv(num);
    return (
      `${div}*(${demolish(Math.floor(num / div))})+` +
      `(${demolish(num % div)})`
    ).replace(/\*\(1\)|\+\(0\)$/g, '');
  };
  //Finisher
  const finisher = (expr: string): string => {
    expr = expr.replace(/\d+/g, (n) => Nums[n].toString());
    expr = expr.replace('负', Nums[-1].toString()).replace('^', '**');
    //As long as it matches ([\*|\/])\(([^\+\-\(\)]+)\), replace it with $1$2
    // while (expr.match(/[\*|\/]\([^\+\-\(\)]+\)/))
    //   expr = expr.replace(
    //     /([\*|\/])\(([^\+\-\(\)]+)\)/,
    //     (_m, $1, $2) => $1 + $2,
    //   );
    //As long as it matches ([\+|\-])\(([^\(\)]+)\)([\+|\-|\)]), replace it with $1$2$3
    // while (expr.match(/[\+|\-]\([^\(\)]+\)[\+|\-|\)]/))
    //   expr = expr.replace(
    //     /([\+|\-])\(([^\(\)]+)\)([\+|\-|\)])/,
    //     (_m, $1, $2, $3) => $1 + $2 + $3,
    //   );
    //As long as it matches ([\+|\-])\(([^\(\)]+)\)$, replace it with $1$2
    // while (expr.match(/[\+|\-]\(([^\(\)]+)\)$/))
    //   expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)$/, (_m, $1, $2) => $1 + $2);
    //If there is a bracket in the outermost part, remove it
    // if (expr.match(/^\([^\(\)]+?\)$/))
    //   expr = expr.replace(/^\(([^\(\)]+)\)$/, '$1');

    // expr = expr.replace(/\+-/g, '-');
    return expr;
  };
  return (num: unknown) => finisher(demolish(num));
};
