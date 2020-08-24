# etc-keys-sweeper
Ethereum classic keys sweeper. Scans your parity keys and sweeps to your given address

## Commands

`etcsweep toAddress secretkey backuppath[optional]`
Example:
`etcsweep 0xe9b1a2164368c00fc93e0e749d9b3cafa1bc6ee2 secretkey` - will default to `~/etcbackup/ethereum-keys.tar.gz`
`etcsweep 0xe9b1a2164368c00fc93e0e749d9b3cafa1bc6ee2 secretkey /home/user/etckeys.tar.gz` - will use `/home/user/etckeys.tar.gz`
