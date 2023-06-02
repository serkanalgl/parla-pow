import { Logger, Controller, Get, Post, Body, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';

@Controller('/transaction')
export class TransactionController {

  private readonly logger:Logger = new Logger('TransactionController');

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() transactionDto: TransactionDto) {
    return this.transactionService.createTransaction(transactionDto.receipent, transactionDto.amount);
  }

}
