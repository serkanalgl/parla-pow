import { Logger, Injectable } from '@nestjs/common';
import * as forge from 'node-forge';
import { Wallet } from './wallet';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class WalletService{

  private readonly logger:Logger = new Logger('WalletService');

  wallet: Wallet;

  constructor(private readonly cryptoService: CryptoService) {}

  async createWallet(): Promise<void>{
    const keyPair = await this.cryptoService.generateKeyPair();
    this.wallet = new Wallet(keyPair);
    console.log(`New wallet created. ${this.wallet.toString()}`);
  }

  sign(data){
    return this.cryptoService.sign(this.wallet.keyPair._privateKey, data);
  }

  verify(data, publicKey, signature){
    return this.cryptoService.verify(data, publicKey, signature);
  }

  getPublicKey(){
    return this.wallet.publicKey;
  }

}
