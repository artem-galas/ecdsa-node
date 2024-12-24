## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.


### Addresses with private/public keys

Generated with 

```js
import * as secp from 'ethereum-cryptography/secp256k1.js';
import { keccak256 } from "ethereum-cryptography/keccak.js";
import * as utils from 'ethereum-cryptography/utils';

const privKey = secp.secp256k1.utils.randomPrivateKey();
const pubKey = secp.secp256k1.getPublicKey(privKey, false);

const sliceFirstByte = pubKey.slice(1, pubKey.length);
const keccakUit = keccak256(sliceFirstByte)
const kecc = keccakUit.slice(keccakUit.length - 20, keccakUit.length);

console.log(utils.toHex(privKey));
console.log(utils.toHex(pubKey));
console.log(utils.toHex(kecc));

// Private: 51f91a2888e2de6408dc276b3044c325d7aa85939e92f0bc4821128d8f636c81
// Public: 041792cd9b658d255bc50a9cd3d2fcf0f7c40fee01970c5d57a54d211b8873aefbed0d03d636b27087e05e3d0b8dea2a374509c37442bd7a36ed63fc92dcd781a7
// Address: 3d20b8494654f44e8fedae4c2cb1f2b86fb6c818
// 
// Private: e87f3bf013e93c39c3a445c9720469bf900faa1e6a315ed4085b740ce3ff355b
// Public: 04b4723740b0889231fcbd1196a882b17798332f237147d3c204cfde549ca0d44b037b64c95619f3a9c862acd7765177ab2f0d67faf01bfcf8fd40cf7d762c137d
// Address: 0e4003d1153858f3d3a81cc732c7302efbf6c34b
// 
// Private: 930720a39fec3aaa263fa15041868edf0f5af55aa849c76a1d06ff26414cbec9
// Public: 043072bd9d4e452d329be2a00d1538cbefb723f08c049d076c07173e30b23350a57dbacf8a320f02ab960ee1dbbab35ef93c584bd4ea993f17caddc6e16b84c6bd
// Address: f7fe3b17f9137eea151829dd6df7cb9b27e311df
```
