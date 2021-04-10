export const getURLParameters = (url: any) => {
  const json = {};
  const arr = url.substr(url.indexOf('?') + 1).split('&');
  arr.forEach((item: any) => {
    const tmp = item.split('=');
    // @ts-ignore
    json[tmp[0]] = tmp[1];
  });
  return json;
};
