const recover = require("./src/recover");
const uncompress = require("./src/uncompress");
const fs = require("fs-extra")
const path = require('path')
const sendTx = require('./src/sendTx');
const keysPath =   path.resolve(process.env.HOME)
const homePath = path.resolve(keysPath,"etcbackup/ethereum-keys.tar.gz")
const assert = require('assert');
const {getWeb3} = require("./src/web3");
const web3 = getWeb3();
async function sweepClassic(toAddress, backupPath = null) {
  assert(toAddress)
  if(!backupPath) {
    backupPath = homePath
  }
  assert(path.isAbsolute(backupPath),"backup path must be in absolute format")
  await uncompress(backupPath, "classic");
  const toRecover = await recover();
  for(const [address,vals] of Object.entries(toRecover)){
    const reciept = await sendTx(web3, vals.key, vals.balance,address, toAddress);
    consola.log(reciept.transactionHash)
  }

  await fs.remove("/tmp/keys");
  await fs.remove("/tmp/imported_keys");
}

module.exports = sweepClassic;