const copy = data => {
  // helps prevent us from reaching JSON.parse(undefined), which throws an error
  if (!data) {
    return data;
  }
  return JSON.parse(JSON.stringify(data));
};

const delay = (result, time = 1000, error) => {
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

const type = (address) => {
  if (!address) {
    return address;
  }
  return address.split('_')[0];
};

export const utils = {
  copy,
  delay,
  type,
};
