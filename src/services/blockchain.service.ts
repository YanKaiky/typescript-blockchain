import hash from "../utils/hash";
import Block from "../utils/interfaces/block";
import validateHash from "../utils/validate.hash";

class Blockchain {
  chain: Block[] = []

  private prefixPoW = '0';

  constructor(private readonly dificult: number = 4) {
    this.chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Initial Block',
      previous_hash: '',
    }

    const data = {
      header: {
        nonce: 0,
        block_hash: hash(JSON.stringify(payload)),
      },
      payload,
    }

    return data;
  }

  private get lastBlock(): Block {
    const index = this.chain.at(-1) as Block;

    return index;
  }

  private hashLastBlock() {
    const last = this.lastBlock.header.block_hash;

    return last;
  }


  createBlock(data: any): Block['payload'] {
    const newBlock: Block['payload'] = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data: data,
      previous_hash: this.hashLastBlock(),
    }

    console.log(`Created Block #${newBlock.sequence}: ${JSON.stringify(newBlock)} `);

    return newBlock;
  }

  mineBlock(block: Block['payload']) {
    let nonce = 0;
    const start = +new Date();

    while (true) {
      const blockHash = hash(JSON.stringify(block));
      const hashPoW = hash(blockHash + nonce);

      if (validateHash({
        hash: hashPoW,
        dificult: this.dificult,
        prefix: this.prefixPoW,
      })) {
        const final = +new Date();
        const reducedHash = blockHash.slice(0, 12);
        const miningTime = (final - start) / 1000;

        console.log(`Block #${block.sequence} mined in ${miningTime}s. Hash ${reducedHash} (${nonce} attempts)`);

        const mined = {
          minedBlock: {
            header: {
              nonce: nonce,
              block_hash: blockHash,
            },
            payload: { ...block },
          }
        }

        return mined;
      }

      nonce++
    }
  }

  blockVerify(block: Block): boolean {
    if (block.payload.previous_hash !== this.hashLastBlock()) {
      console.error(`Invalid block #${block.payload.sequence}.
        The previous hash is ${this.hashLastBlock().slice(0, 12)} and not ${block.payload.previous_hash.slice(0, 12)}`
      );

      return false;
    }

    const hashTest = hash(hash(JSON.stringify(block.payload)) + block.header.nonce)
    
    if (!validateHash({ hash: hashTest, dificult: this.dificult, prefix: this.prefixPoW })) {
      console.error(`Invalid block #${block.payload.sequence}: nonce ${block.header.nonce} is invalid and cannot be verified`);
      
      return false;
    }

    return true;
  }

  sendBlock(block: Block): Block[] {
    if (this.blockVerify(block)) {
      this.chain.push(block)

      console.log(`Block #${block.payload.sequence} has been added to blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.chain;
  }
}

export default Blockchain;
