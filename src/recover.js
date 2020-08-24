const fs = require('fs-extra')
const keythereum = require('keythereum')
const path = require('path')
const consola = require('consola')
const {getWeb3} = require("./web3");
const web3 = getWeb3();
const Contract = web3.eth.Contract;
const abi = require('./abi.json')
const keysPath = path.resolve("/tmp/keys");
const addressesKeys = {}
let addressesWithBalance = {}
let addressTotalBalance = 0
let toRecover = {};
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

async function retrieveKeys() {
  const addresses = [];
  consola.log("Retrieving keys...")
  const keyFile = await fs.readdir(keysPath);
  for (let key of keyFile) {
    if (key == "address_book.json") continue;
    const jsonPath = path.resolve(keysPath, key);
    const jsonKey = await fs.readJson(jsonPath);
    addresses.push('0x'+jsonKey.address);
    addressesKeys['0x'+jsonKey.address] = jsonKey;
  }
  consola.log(`Found ${addresses.length} ETC addresses`)
  return addresses;
}

async function getBalance(addrArray) {
  const contract = new Contract(abi, "0x3446c36Cfd505e89dD7E2E63b8A7F384Ba6e5F19");
  const r = await contract.methods.balances(addrArray,'0x0000000000000000000000000000000000000000').call({from: '0x0000000000000000000000000000000000000000'});
    const addr = r.reduce((prev,curr,i) => {
      curr = parseInt(curr);
      if(curr > 0) {
        addressTotalBalance+=curr
        prev[addrArray[i]] = curr;
      }
      return prev;
    },{})
    if(Object.keys(addr).length) {
      consola.log(`Found ${Object.keys(addr).length} addresses with balance`)
      addressesWithBalance = Object.assign({},addressesWithBalance,addr);
    }
}

function retrievePrivateKey(password,addr) {
  const encryptedKey = addressesKeys[addr]
  return keythereum.recover(password, encryptedKey).toString('hex')
}

async function recover(secretkey) {
  let addr = await retrieveKeys();
  addr = chunk(addr,100);
  consola.log(`Checking ${addr.length} address chunks of 100`)
  for(let arrChunk of addr) {
    await getBalance(arrChunk);
  }
  consola.log(`A total of ${Object.keys(addressesWithBalance).length} ETC addresses found with a Total balance of ${addressTotalBalance / 1e16}`)
  for(let a of Object.keys(addressesWithBalance)) {
     const privKey = retrievePrivateKey(secretkey,a)
     console.log(privKey)
     toRecover[a] = {
       key: privKey,
       balance: "0x"+addressesWithBalance[a].toString(16)
     }
  }
  return toRecover;
}
module.exports = recover;
