import { sha256 } from 'js-sha256';

export default class Block {
  public index: number;
  public previousHash: string;
  public data: any;
  public hash: string;
  public timestamp: string;
  public isGenesis: boolean;
  private nonce: number;

  constructor(
    index: number,
    previousHash: string,
    data: any,
    timestamp: string = '',
    hash: string = '',
    isGenesis: boolean = false
  ) {
    this.index = index;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp || new Date().toISOString();
    this.hash = hash || this.calculateHash();
    this.isGenesis = isGenesis;
    this.nonce = 0;
  }

  validate = () => this.hash === this.calculateHash();

  calculateHash = (): string =>
    Block.calculateHash(
      this.index,
      this.previousHash,
      this.data,
      this.timestamp,
      this.nonce
    );

  mine = (difficulty: number): Promise<string> =>
    new Promise(resolve => {
      console.log(`Mining block ${this.index}...`);

      while (!this.hash.startsWith(Array(difficulty + 1).join('0'))) {
        this.nonce++;
        this.hash = this.calculateHash();
      }

      console.log(`Mined block ${this.index}: ${this.hash}`);

      resolve(this.hash);
    });

  static calculateHash(
    index: number,
    previousHash: string,
    data: any,
    timestamp: string,
    nonce: number = 0
  ) {
    return sha256(
      Array.from(arguments)
        .map(value => JSON.stringify(value))
        .join('')
    );
  }
}

export function generateGenesisBlock() {
  return new Block(0, sha256('start'), {}, '', '', true);
}
