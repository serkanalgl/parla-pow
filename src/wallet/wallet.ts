export class Wallet{

  balance: number;
  keyPair: any;
  publicKey: string;

  constructor(keyPair) {

    this.balance = 100;
    this.keyPair = keyPair;
    this.publicKey = keyPair.publicKey;

  }

  toString(){
    return `Wallet -
      balance: ${this.balance}
      publicKey: ${this.publicKey}`;
  }

}
