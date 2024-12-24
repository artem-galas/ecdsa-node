import express from "express";
const app = express();
import cors from "cors";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak.js";

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "3d20b8494654f44e8fedae4c2cb1f2b86fb6c818": 100,
  "0e4003d1153858f3d3a81cc732c7302efbf6c34b": 50,
  "f7fe3b17f9137eea151829dd6df7cb9b27e311df": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// ethereum wallet contains 20 last-bit of public key
function getAddressFromPublicKey(publicKey) {
  const sliceFirstByte = publicKey.slice(1, publicKey.length);
  const keccakUit = keccak256(sliceFirstByte)

  return toHex(keccakUit.slice(keccakUit.length - 20, keccakUit.length));
}

app.post("/send", (req, res) => {
  const { signature, messageHash, recipient, amount } = req.body;

  let sig = secp256k1.Signature.fromCompact(signature);
  sig = sig.addRecoveryBit(1);

  const publicKey = sig.recoverPublicKey(messageHash);

  const isSigned = secp256k1.verify(sig, messageHash, publicKey.toHex(false));

  if (!isSigned) {
    res.status(400).send({message: "Not signed"});
  }

  const sender = getAddressFromPublicKey(publicKey.toRawBytes(false));

  if (!balances[sender]) {
    res.status(400).send({message: "Sender is not valid"});
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
