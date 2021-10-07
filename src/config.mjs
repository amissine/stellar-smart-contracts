import { Asset, Server } from 'stellar-sdk' // {{{1

let config = { // {{{1
  BALANCE_LOW_WATERMARK: 0.001,
  KEY_recurring: '8e02ebcd6adcdbc30c1c5acec399e118866310c6322ebe0f00d8a4bf14f00779',
  HORIZON_URL: process.env.HORIZON_URL,
  STELLAR_NETWORK: process.env.STELLAR_NETWORK,
  TXF_AGENT: process.env.TXF_AGENT,
  UPLOAD_DIVISOR: 1000,
  USER_CB_TTL_SECONDS: '2592000', // 3600 * 24 * 30
  asset: Asset.native(),
  balanceUseTxfMin: balanceUseTxfMin(),
  feeDeleteTxf: feeDeleteTxf(),
  server: new Server(process.env.HORIZON_URL),
}

function feeDeleteTxf () { // {{{1
  return +1;
}

function balanceUseTxfMin() { // {{{1
  return +2; 
}

// }}}1
export { config }
