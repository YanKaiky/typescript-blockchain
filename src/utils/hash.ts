import { BinaryLike, createHash } from 'crypto';

const hash = (data: BinaryLike) => {
  const hash = createHash('sha256').update(data).digest('hex');

  return hash;
}

export default hash;
