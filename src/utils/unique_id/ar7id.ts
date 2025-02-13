const A: string[] = [
  'a',
  's',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'z',
  'x',
  'c',
  'v',
  'b',
  'n',
  'm',
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
];

const B: string[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

const f1: () => string = () => {
  const index: number = Math.floor(Math.random() * A.length);
  return A[index];
};

const f2: () => string = () => {
  const index: number = Math.floor(Math.random() * B.length);
  return B[index];
};

const id: () => string = () => {
  return f1() + f2() + f2() + f2() + f2() + f2() + f2() + f2() + f2() + f1();
};

const ar7id: () => string = () => {
  return id() + id() + id() + id() + id() + id() + id() + 'ar7';
};

export { ar7id };
