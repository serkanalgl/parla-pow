
# Parla Pow

A simple blockchain implementation for learning purpose. Proof of work (PoW) is used as a decentralized consensus mechanism.



## Tech Stack

Nestjs, TypeScript, Websockets


## Layers

### Network

Network layer is able to connect and listen peers. After successfully connected to peers, syncs the chain. Network layer broadcasts transaction or a newly mined block to other connected peers.

### Crypto

Generate key-pairs, sign and verify data. 

### Blockchain

Blockchain layer is provide confidence in the accuracy of chain. Creates a first block which is called as Genesis Block. 
Validate and replace chain.
Mine block and adjust difficulty

### Wallet and Transaction

Create a wallet, sign or verify data. Create a new transaction with wallet key-pair.  


## Installation

```bash
$ npm install
```
    
## Run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

