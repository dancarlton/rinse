const reverse = (string) => string.split("").reverse().join("");

const average = (array) => {
  const reducer = (sum, item) => sum + item;
  return array.length ? array.reduce(reducer, 0) / array.length : 0;
};

export { reverse, average };
