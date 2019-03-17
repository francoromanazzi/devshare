export const base64SrcFormat = base64 => {
  const result = /^(data)/.test(base64);

  return !result ? `data:image/jpeg;base64,${base64}` : base64;
};

export default base64SrcFormat;
