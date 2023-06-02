export class Block{

  timestamp: number;
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  data: string;

  constructor(timestamp: number, previousHash: string, hash: string, nonce: number, difficulty: number, data: string) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
  }

  toString(){
    return `Block -
      timestamp: ${this.timestamp}
      previous hash: ${this.previousHash}
      hash: ${this.hash}
      nonce: ${this.nonce}
      difficulty: ${this.difficulty}
      data: ${this.data}`;
  }
}
