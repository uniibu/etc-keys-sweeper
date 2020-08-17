const compressing = require('compressing');
const path = require('path')
const walk = require('klaw');
const fs = require('fs-extra')

function getKeysDir(rootKey,network) {
  let keyDir = ''
  return new Promise((resolve) => {
    walk(rootKey, { filter: f => path.basename(f) !== "keys"})
    .on('data', item => {
      keyDir = item.path;
    })
    .on('end', () => {
      resolve(keyDir + "/keys/" + network)
    })
  })
}

module.exports = async function(tgzFile, network) {
  if(!path.isAbsolute(tgzFile)) {
    throw new Error("Invalid absolute path");
  }
  if(path.extname(tgzFile) !== ".gz") {
    throw new Error("Invalid file format");
  }
  const keysFolder = path.resolve( "/tmp/keys");
  const tempFolder = path.resolve("/tmp/imported_keys");
  await fs.remove(keysFolder);
  await fs.remove(tempFolder);
  await compressing.tgz.uncompress(tgzFile, tempFolder);
  const xFolder = await getKeysDir(tempFolder, network);
  await fs.move(xFolder, keysFolder);
  await fs.remove(tempFolder);
}