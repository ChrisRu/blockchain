import Block, { generateGenesisBlock } from './Block';
import { WebSocket } from 'clusterws';

export default class BlockChain {
  public chain: Block[];
  public difficulty: number;

  constructor(mineDifficulty: number = 5, chain?: Block[]) {
    this.chain = chain || [generateGenesisBlock()];
    this.difficulty = mineDifficulty;
  }

  get isValid(): boolean {
    return this.chain.every(
      (block, index) =>
        block.isGenesis ||
        BlockChain.newBlockIsValid(this.chain[index + 1], block)
    );
  }

  add(block: Block): Block {
    this.chain.push(block);
    console.log(`Added new block (${block.index}) with hash: ${block.hash}`);
    return block;
  }

  createNewBlock(data: any, add: boolean = true): Block {
    const [latestBlock] = this.chain.slice(-1);
    const index = latestBlock.index + 1;
    const previousHash = latestBlock.hash;

    const newBlock = new Block(index, previousHash, data);
    newBlock.mine(this.difficulty);

    if (add) {
      this.add(newBlock);
    }

    return newBlock;
  }

  static newBlockIsValid(newBlock: Block, previousBlock: Block): boolean {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.warn('Invalid index');
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.warn('Invalid previoushash');
      return false;
    } else if (!newBlock.validate()) {
      console.warn(
        `Invalid hash: ${newBlock.calculateHash()} ${newBlock.hash}`
      );
      return false;
    }

    return true;
  }

  replaceChain(newBlocks: Block[]): Block[] {
    if (this.isValid && newBlocks.length > this.chain.length) {
      console.log(
        'Received blockchain is valid. Replacing current blockchain with received blockchain'
      );
      this.chain = newBlocks;
    } else {
      console.log('Received blockchain invalid');
    }

    return this.chain;
  }
}
