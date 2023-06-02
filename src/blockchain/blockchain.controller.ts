import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import * as rawbody from 'raw-body';
import { Block } from './block';
import { BlockchainService } from './blockchain.service';

@Controller('/blockchain')
export class BlockchainController {
  constructor(private readonly blockchain: BlockchainService) {}

  @Get('/blocks')
  async getBlocks(): Promise<Array<Block>> {
    return this.blockchain.getChain();
  }

  @Post('/mine')
  async mine(@Body() data, @Req() req) {
    if (req.readable) {
      const raw = await rawbody(req);
      const text = raw.toString().trim();
      return this.blockchain.addBlock(text);

    } else {
      return this.blockchain.addBlock(data);
    }

  }

}
