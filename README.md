# 数字论证生成器 —— NumProof Gen

本应用可以使用整数（11 位内）论证任意实数。

$$
114514=(1+9+1)\times 9810+(1/9-1+9)\times 810+(19+1)\times(9+8)\div 10
$$

## 使用方法

本应用可自动搜索数字构成的表达式，并实时论证数字。在页面中：

- “要论证的结果为”输入框中，输入任意实数。
- “用于论证的数字”输入框中，输入不超过11位的非负整数。

页面会实时显示论证结果，形如 `“要论证的结果为”=“用于论证的数字”构成的表达式`，例如 `1=12/3/4`。

## 工作原理

本应用的工作原理为，根据输入，将用于论证的数字分割成最多 $5\sim 6$ 个部分，然后每次合并两个表达式并枚举运算符，将数字的部分组成为一个表达式。此时，根据表达式的运算结果，更新得到相同结果且长度最短的表达式，并补充 $-1\sim 16$ 的常用数字，最终处理出已知整数与短表达式的对应关系。

分解实数时，对于负数，将其修改为 $f(x)=-1\times f(-x)$；对于小数，计其小数位数 $n$，将其修改为 $f(x)=f(10^n x)\div 10^n$；对于未覆盖的正整数，找到不超过该数的最大有效数 $n$，根据商和余数分解为 $f(x)=n\left\lfloor\frac x n\right\rfloor\left(x\bmod n\right)$。将三条规则合并后，可将实数分解为已知整数，从而分解任意实数。

## 技术架构

- Node 24
- 包管理器：pnpm 10
- 构建工具：Vite 8
- 编程语言：HTML + CSS + TypeScript
- 语法检查器：ESLint

## 快速开始

在 `node` 环境下，使用 `pnpm` 安装，并启动开发服务器：

```bash
git clone https://github.com/IsBenben/num-proof-gen.git
cd num-proof-gen
pnpm install
pnpm run dev
```

随后打开 [`http://localhost:5173/`](http://localhost:5173/) 即可进入开发页面。

### 可用命令

- `pnpm run deev`：启动开发服务器。
- `pnpm run build`：构建发布包到 `dist` 目录。
- `pnpm run preview`：预览构建产物。

## 鸣谢

本应用中部分代码包含修改版的 itorr/homo（恶臭数字论证器），关于其说明请见 <https://github.com/itorr/homo>。

## 许可证

MIT License
