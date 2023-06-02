import { Logger, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Block } from './block';
import { CryptoService } from 'src/crypto/crypto.service';

const DIFFICULTY = 4;
const MINE_RATE_IN_MS = 30000;

@Injectable()
export class BlockchainService{

  private readonly logger:Logger = new Logger('BlockchainService');

  private chain: Array<Block>;

  constructor(
    private cryptoService:CryptoService,
    private eventEmitter:EventEmitter2) {

    this.chain = [ this.createGenesisBlock() ];

  }

  @OnEvent('chain.sync')
  handleChainSync(payload: any) {
    this.eventEmitter.emit('chain.broadcast', this.chain);
  }

  @OnEvent('chain.received')
  handleChainReceived(payload: any) {
    this.replaceChain(payload);
  }

  createGenesisBlock(){
    const timestamp = Date.now();
    const previousHash = '0';
    const nonce = 0;
    const data = null;
    const hash = this.cryptoService.hash(`${timestamp}${previousHash}${nonce}${DIFFICULTY}${data}`);

    return new Block(timestamp, previousHash, hash, nonce, DIFFICULTY, data);
  }

  async mine(previousBlock, data): Promise<Block>{
    let hash, timestamp, difficulty;
    const previousHash = previousBlock.hash;

    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(previousBlock, timestamp);
      hash = this.cryptoService.hash(`${timestamp}${previousHash}${nonce}${difficulty}${data}`);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new Block(timestamp, previousHash, hash, nonce, difficulty, data);
  }

  adjustDifficulty(previousBlock, currentTimestamp):number{
    let { difficulty } = previousBlock;
    return difficulty = previousBlock.timestamp + MINE_RATE_IN_MS > currentTimestamp ? difficulty+1 : difficulty-1;
  }

  async addBlock(data): Promise<Block>{
    const block = await this.mine(this.chain[this.chain.length-1], data);
    this.chain.push(block);
    console.log(`built block ${block.hash}`);

    this.eventEmitter.emit('chain.broadcast', this.chain);

    return block;
  }

  getChain(): Array<Block>{
    return this.chain;
  }

  isValidChain(chain): boolean{

    if(!chain.length || chain[0].previousHash !== '0') return false;

    for (var i = 1; i < chain.length; i++) {
      const block = chain[i];
      const previousBlock = chain[i-1];

      if(block.previousHash !== previousBlock.hash ||
        block.hash !== this.cryptoService.hash(`${block.timestamp}${block.previousHash}${block.nonce}${block.difficulty}${block.data}`)){
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain: Array<Block>){
    if(newChain.length <= this.chain.length){
      console.log('The received chain is not longer than the current chain.');
      return;
    }else if(!this.isValidChain(newChain)){
      console.log('The received chain is not valid.');
      return;
    }

    console.log('The current chain replaced with the new longest chain.');
    this.chain = newChain;
  }

}
