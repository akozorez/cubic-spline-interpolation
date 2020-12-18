import { Parser } from 'expr-eval';

export const Func = (expression: string): Function => {
    return (x: number): number => Parser.evaluate(expression, { x: x });
};

export const Hashify = (size: number): string =>
    [...Array(size)].map((i) => (~~(Math.random() * 36)).toString(36)).join('');

export const Hash = (size: number): string =>
    Hashify(Math.ceil(size / 2)) + Hashify(Math.floor(size / 2));
