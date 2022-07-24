const validateHash = ({hash, dificult = 4, prefix = '0'}: {
  hash: string, dificult: number, prefix: string
}) => {
  const check = prefix.repeat(dificult)

  const startWith = hash.startsWith(check);

  return startWith;
}

export default validateHash;
