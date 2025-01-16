const refineUrlAr7 = (url: string) => {
  const indexToStart = url.indexOf('images');
  const refinedUrl = '\\' + url.substring(indexToStart);
  return refinedUrl;
};

export default refineUrlAr7;
