import algosdk from 'algosdk'

export function generateAlgorandAccount() {
  const account = algosdk.generateAccount()
  return {
    privateKey: Buffer.from(account.sk).toString('base64'),
    address: account.addr.toString()
  }
}

export function mnemonicToAccount(mnemonic: string) {
  return algosdk.mnemonicToSecretKey(mnemonic)
}