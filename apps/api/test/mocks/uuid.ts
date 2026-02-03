// Mock for uuid package to avoid ESM issues in Jest
let counter = 0;

export const v4 = () => {
  counter++;
  return `00000000-0000-0000-0000-00000000${counter.toString().padStart(4, '0')}`;
};

export const v1 = () => {
  counter++;
  return `00000000-0000-1000-0000-00000000${counter.toString().padStart(4, '0')}`;
};

export const v5 = () => {
  counter++;
  return `00000000-0000-5000-0000-00000000${counter.toString().padStart(4, '0')}`;
};

export default { v4, v1, v5 };
