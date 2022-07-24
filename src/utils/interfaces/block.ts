interface Block {
  header: {
    nonce: number;
    block_hash: string;
  };
  payload: {
    sequence: number;
    timestamp: number;
    data: any;
    previous_hash: string;
  }
}

export default Block;
