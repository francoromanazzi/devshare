const base64SrcFormat2 = base64 =>
  base64.match(/^(data:image\/(bmp|jpeg|png);base64,)/).length === 0
    ? `data:image/jpeg;base64,${base64}`
    : base64;

const base64SrcFormat = base64 => {
  console.log(base64);
  const result = /^(data)/.test(base64);
  console.log(result);

  return !result ? `data:image/jpeg;base64,${base64}` : base64;
};

export default base64SrcFormat;
