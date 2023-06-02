import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainModule } from './blockchain/blockchain.module';
import { NetworkModule } from './network/network.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { CryptoModule } from './crypto/crypto.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
   imports:[
    	ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),
      EventEmitterModule.forRoot(),
      CryptoModule,
      BlockchainModule,
      NetworkModule,
      WalletModule,
      TransactionModule,
	]
})
export class AppModule{}
