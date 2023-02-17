const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = "0.0.14399";
  const myPrivateKey = "6e5e20e4586e8f09377403216e0dc241bdb02c54489bf0eaf0f13b19f116d42f";

  // If we weren't able to grab it, we should throw a new error
  if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
  }

  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);
 // DONT NEED THIS BECAUSE THE NEW ACCOUNT IS CREATED
 //   0.0.3461110
  //The new account ID is: 0.0.3491398
  //Create new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  //Create a new account with 1,000 tinybar starting balance.
  //To make the account exist you need to send it a transaction
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(100000))
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  console.log("The new account ID is: " +newAccountId);
  console.log("The newAccountPrivateKey is: " +newAccountPrivateKey);
  console.log("The newAccountPublicKey is: " +newAccountPublicKey);

  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

}
main();
