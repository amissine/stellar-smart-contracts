import { promises } from 'fs' // {{{1
import fetch from 'node-fetch'
import BigNumber from 'bignumber.js'
import { config } from './config.mjs'
import * as sscu from './stellar-smart-contract-utils.mjs'

export default async function mw (path) { // {{{1
  return await handleRequest(path).catch(e => `- err ${e}`);
}

const txfAgentURL = dev => dev ? 'http://127.0.0.1:8766' :
  'https://txf-agent.alec-missine.workers.dev'

async function handleRequest(path) { // {{{1
  const buf = await promises.readFile(path)
  const fn = buf.toString()
  const params = new URLSearchParams()
  params.set('fn', encodeURIComponent(fn))

  const response = await fetch(
    txfAgentURL(false), 
    {
      headers: new Headers([
        ['Authorization', `Basic ${signedFeeXDR(fn)}`],
      ]),
      method: 'POST', 
      body: params
    })
    .catch(e => `- err ${e}`)

  console.log(response)

  const contentType = response.headers.get('content-type')
  const data = contentType == 'text/plain;charset=UTF-8' ? await response.text()
    : await response.json();
  return data;
}

async function signedFeeXDR (fn) { // {{{1
  return await sscu.feeXDR(txF_CreatorAddress(), fee(fn))
  .then(xdr => sscu.signXDR(xdr, txF_CreatorSecret()))
}

function fee (fn) { // {{{1
  return new BigNumber(fn.length).dividedBy(config.UPLOAD_DIVISOR).toFixed(7)
}

function txF_CreatorAddress () { // {{{1
  return process.env.TXF_CREATOR;
}

function txF_CreatorSecret () { // {{{1
  return process.env.TXF_CREATOR_SECRET;
}
// }}}1
export { fee, } // to test
