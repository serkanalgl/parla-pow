import { Logger, Injectable } from '@nestjs/common';

import * as forge from 'node-forge';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CryptoService{

    hash(data): string{
      const a = forge.md.sha256.create();
      a.update(JSON.stringify(data));
      return a.digest().toHex();
    }

    async generateKeyPair(): Promise<any> {

      return await this.generateKeyPairAsync().then(keypair => {

        return {
          _publicKey: keypair.publicKey,
          _privateKey: keypair.privateKey,
          publicKey: forge.pki.getPublicKeyFingerprint(keypair.publicKey, { encoding: 'hex' }).toString('hex')
        };

      });

    }

    async generateKeyPairAsync() {
       return await forge.pki.rsa.generateKeyPair({bits: 2048});
    }

    generateId() {
       return uuidv4();
    }

    sign(privateKey, data){

      var md = forge.md.sha1.create();
      md.update(JSON.stringify(data), 'utf8');
      return privateKey.sign(md);

    }

    verify(data, publicKey, signature){

      const _publicKey = forge.pki.publicKeyFromPem(publicKey);

      var md = forge.md.sha1.create();
      md.update(JSON.stringify(data), 'utf8');

      var verified = _publicKey.verify(md.digest().bytes(), signature);
      console.log('verified', verified);
      return verified;
    }

}
