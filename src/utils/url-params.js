export const getURLParameters = (url) => {
    const json = {};
    const arr = url.substr(url.indexOf('?') + 1).split('&');
    arr.forEach((item) => {
        const tmp = item.split('=');
        // @ts-ignore
        json[tmp[0]] = tmp[1];
    });
    return json;
};
//# sourceMappingURL=url-params.js.map