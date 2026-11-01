import { ExpressionNode, ExpressionTree, type Format } from './expression';
import { SeedRandom } from './seedrandom';

export const homo = (
  Nums: Record<string, ExpressionTree>,
  format: Format,
  prob: number,
): ((num: unknown) => string) => {
  /*!
   * This function contains modified third-party code from itorr/homo (the Homo Number Argument Generator).
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
  const random = new SeedRandom();
  const numsReversed: number[] = Object.keys(Nums)
    .map((x) => +x)
    .filter((x) => x > 0);
  const getMinDiv = (num: number): number => {
    for (let i = numsReversed.length - 1; i >= 0; i--)
      if (num >= numsReversed[i] && random.next() < prob)
        return numsReversed[i];
    return 1;
  };
  const isDotRegex = /\.(\d+?)0{0,}$/;
  const demolish = (num: number): ExpressionTree => {
    if (num < 0) {
      if (num == -1) {
        return Nums[-1];
      } else {
        return new ExpressionNode(Nums[-1], '*', demolish(num * -1));
      }
    }

    if (!Number.isInteger(num)) {
      // abs(num) is definitely smaller than 2**51
      // rescale
      const matched = num.toFixed(16).match(isDotRegex);
      if (!matched) {
        return new ExpressionNode(demolish(num * 10), '/', Nums[10]);
      }
      const n = matched[1].length;
      if (n !== 1) {
        return new ExpressionNode(
          demolish(num * Math.pow(10, n)),
          '/',
          new ExpressionNode(Nums[10], '^', Nums[n]),
        );
      }
      if (!matched) {
        return new ExpressionNode(demolish(num * 10), '/', Nums[10]);
      }
    }

    if (Nums[num]) return Nums[num];

    const div = getMinDiv(num);
    const quotient = Math.floor(num / div);
    const remainder = num % div;

    let result = Nums[div];
    if (quotient !== 1) {
      result = new ExpressionNode(result, '*', demolish(quotient));
    }
    if (remainder !== 0) {
      result = new ExpressionNode(result, '+', demolish(remainder));
    }
    return result;
  };

  return (num: unknown) => {
    if (typeof num !== 'number') return '';
    if (!Number.isFinite(num)) return `这么恶臭的${num}有必要论证吗`;
    return demolish(num).toStringCustom(format);
  };
};
