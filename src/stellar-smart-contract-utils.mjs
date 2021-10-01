import { config } from './config.mjs' // {{{1
import moment from 'moment'
import { BASE_FEE, Claimant, Keypair, Networks, Operation, TransactionBuilder } from 'stellar-sdk'

const now = moment.utc().startOf('minute') // {{{1
const minTime = now.clone().startOf('month')
const maxTime = minTime.clone().endOf('month')

function opts ( // {{{1
  fee = BASE_FEE,
  networkPassphrase = Networks[config.STELLAR_NETWORK],
  timebounds = { minTime: minTime.unix(), maxTime: maxTime.unix()},
  memo, withMuxing
)
{
  return { fee, networkPassphrase, timebounds, memo, withMuxing };
}

function tx (txXDR) { // {{{1
  return TransactionBuilder.fromXDR(txXDR, Networks[config.STELLAR_NETWORK])
}

/** {{{1
 * Create Claimable Balance (with reclaim) unsigned XDR: SRC → config.TXF_AGENT
 * https://medium.com/aquarius-aqua/claimable-balances-on-the-stellar-network-47c5cdf8a1e
 *
 * TxFunctions Agent exposes API for TxF Users to:
 * - request Create Claimable Balance XDR
 * GET /:txfCustomerAddress?balance=< CCB ≥ config.balanceUseTxfMin >
 * << CCB XDR | 400
 */
async function ccbXDR (src, amount, ttlSeconds) { // {{{1
  if (amount < config.balanceUseTxfMin) {
    return new Response(`Bad request GET /${src}?balance=${amount}:
- balance must not be lower than ${config.balanceUseTxfMin}`, {status: 400});
  }
  const predicateClaim = Claimant.predicateBeforeRelativeTime(ttlSeconds)
  const predicateReclaim = Claimant.predicateNot(predicateClaim)
  const claimants = [
    new Claimant(config.TXF_AGENT, predicateClaim), 
    new Claimant(src, predicateReclaim)
  ]
  return await fetch(`${config.HORIZON_URL}/accounts/${src}`)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw res 
  })  
  .then(account => new TransactionBuilder(account, opts())
    .addOperation(Operation.createClaimableBalance({
      asset: config.asset, amount: amount, claimants: claimants
    })).build().toXDR())
  .then(xdr => new Response(xdr))
}

function signXDR (unsignedXDR, secret) { // {{{1
  const transaction = tx(unsignedXDR)
  transaction.sign(Keypair.fromSecret(secret))
  return transaction.toXDR();
}

async function feeXDR (src, amount) { // {{{1
  return await config.server.loadAccount(src)
  .then(account => new TransactionBuilder(account, opts())
    .addOperation(Operation.payment({
       asset: config.asset, amount: amount, destination: config.TXF_AGENT
    })).build().toXDR())
} // }}}1
export { ccbXDR, feeXDR, signXDR, }
