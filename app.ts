import express from 'express';
import Blockchain from './src/services/blockchain.service';

const app = express();

// BLOCKCHAIN
const dificult  = Number(process.argv[2]) || 4;
const blockchain = new Blockchain(dificult);

const blockNumbers  = Number(process.argv[3]) || 10;
let chain = blockchain.chain;

for (let i = 0; i < blockNumbers; i++) {
  const block = blockchain.createBlock(`Block ${i}`);
  const mine = blockchain.mineBlock(block);
  chain = blockchain.sendBlock(mine.minedBlock)
}

console.log('==========BLOCKCHAIN==========')
console.log(chain)

app.listen(3000, () => console.log('Server is running'));
