import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { WalletService } from './wallet/wallet.service';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('main');

  await app.listen(configService.get('HTTP_PORT') || 3000);

  logger.log(`Application started on ${await app.getUrl()}`);

  const walletService = app.get(WalletService);
  walletService.createWallet();

}

bootstrap();
