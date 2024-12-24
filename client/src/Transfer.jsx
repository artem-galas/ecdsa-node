import { useState } from "react";
import server from "./server";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils.js";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const messageHash = await sha256(utf8ToBytes(sendAmount));

    let signature = secp256k1.sign(messageHash, privateKey);
    signature = signature.addRecoveryBit(1);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature.toCompactHex(),
        messageHash: toHex(messageHash),
        recipient,
        amount: parseInt(sendAmount),
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      console.log(ex.re.data.message);
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
