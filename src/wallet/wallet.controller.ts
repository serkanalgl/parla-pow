import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/publicKey')
  getPublickKey() {
    return { publicKey: this.walletService.getPublicKey() };
  }

}
