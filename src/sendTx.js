const consola = require('consola')
async function signTransaction(web3, privKey, txObj) {
  const account = await web3.eth.accounts.privateKeyToAccount(privKey);
  txObj.gas =  web3.utils.toHex(txObj.gas),
  txObj.value = web3.utils.toHex(txObj.value);
  txObj.data = '0x'
  txObj.gasPrice = web3.utils.toHex(web3.utils.toHex(txObj.gasPrice))


  console.log(txObj)
  return await account.signTransaction(txObj);
}

module.exports = function(web3, privkey, amount, fromAddress, toAddress) {
  return new Promise(async resolve => {
    consola.log("Sweeping Balance...")
    var gasPrice = 2000000000;
    const txParams = {
      gas: 21000,
      gasPrice: gasPrice,
      from: fromAddress,
      to: toAddress
    }

    consola.log("Estimating fee...")

    txParams.value = amount - (txParams.gasPrice * txParams.gas)
    consola.log(` total value ${web3.utils.fromWei(txParams.value.toString())} `)
    consola.log("Signing Tx")

    const signedTx =await signTransaction(web3, privkey, txParams);
    web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', resolve);
  })
}
