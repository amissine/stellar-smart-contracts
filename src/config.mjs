import { Asset } from 'stellar-sdk' // {{{1

let config = { // {{{1
  BALANCE_LOW_WATERMARK: 0.001,
  HORIZON_URL: process.env.HORIZON_URL,
  STELLAR_NETWORK: process.env.STELLAR_NETWORK,
  UPLOAD_DIVISOR: 1000,
  USER_CB_TTL_SECONDS: '2592000', // 3600 * 24 * 30
  asset: Asset.native(),
  balanceUseTxfMin: balanceUseTxfMin(),
  txFeeCreateTxfMin: txFeeCreateTxfMin(),
}

function balanceUseTxfMin() { // {{{1
  return +2; 
}

function txFeeCreateTxfMin () { // {{{1
  return +4;
}

// }}}1
export { config }
