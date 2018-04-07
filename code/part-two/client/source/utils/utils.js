export const utils = {};

utils.copy = data => {
  // helps prevent us from reaching JSON.parse(undefined), which throws an error
  if (!data) {
    return data;
  }
  return JSON.parse(JSON.stringify(data));
};

utils.delay = (result, time = 1000, error) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result === undefined) {
        reject(error);
      } else {
        resolve(result);
      }
    }, time);
  });
};
