import { Logger, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Transaction } from './transaction';
import { TransactionDto } from './dto/transaction.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TransactionService{

  private readonly logger:Logger = new Logger('TransactionService');

  transactionPool: Array<Transaction>;

  constructor(
    private eventEmitter: EventEmitter2,
    private cryptoService: CryptoService,
    private walletService: WalletService
  ) {
    this.transactionPool = [];
  }

  createTransaction(recipient:string, amount:number): Transaction{

    const { balance, publicKey } = this.walletService.wallet;

    let transaction = this.transactionPool.find(transaction => transaction.input.address === publicKey );
    if(transaction){

      const output = transaction.outputs.find(output => output.address === publicKey);

      if (amount > output.amount) {
        this.logger.error(`Amount: ${amount} exceeds balance`);
        return;
      }

      output.amount = output.amount - amount;
      transaction.outputs.push({ amount, address: recipient });

      transaction.input = this.signTransactionInput(balance, publicKey, transaction);

      this.logger.log(`Transaction is already exist with id=${transaction.id} and updated in the transaction pool`);

    }else{

      transaction = new Transaction(this.cryptoService.generateId(), null, []);
      if(amount > balance){
        this.logger.error(`Amount: ${amount} exceeds balance`);
        return;
      }

      transaction.outputs.push({ amount: balance - amount, address: publicKey });
      transaction.outputs.push({ amount, address: recipient });

      transaction.input = this.signTransactionInput(balance, publicKey, transaction);

      this.transactionPool.push(transaction);

      this.logger.log(`Transaction created with id=${transaction.id} and added to pool`);

    }

    this.eventEmitter.emit('transaction.broadcast', transaction);
    return transaction;

  }

  @OnEvent('transaction.received')
  handleTransactionReceived(transaction: any) {
    var existingTransaction = this.transactionPool.find(t => t.id === transaction.id);
    if(existingTransaction){
      this.transactionPool[this.transactionPool.indexOf(existingTransaction)] = transaction;
    }else{
      this.transactionPool.push(transaction);
    }
  }

  signTransactionInput(balance, address, transaction){

    return {
        timestamp: Date.now(),
        amount: balance,
        address: address,
        signature: this.walletService.sign(this.cryptoService.hash(transaction.outputs))
    };

  }

}
