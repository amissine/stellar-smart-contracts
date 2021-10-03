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
  const txF = buf.toString()
  const fee = txF_Fee(txF)
  const params = new URLSearchParams()
  params.set('txF', txF)

  const response = await fetch(
    txfAgentURL(false), 
    {
      headers: {
        Authorization: `Basic ${txF_CreatorAddress()}${await signedFeeXDR(fee)}`,
      },
      method: 'POST', 
      body: params
    })
    .catch(e => `- err ${e}`)

  const contentType = response.headers.get('content-type')
  const data = contentType == 'text/plain;charset=UTF-8' ? await response.text()
    : await response.json();
  return data;
}

async function signedFeeXDR (fee) { // {{{1
  return await sscu.feeXDR(txF_CreatorAddress(), fee)
  .then(xdr => sscu.signXDR(xdr, txF_CreatorSecret()))
}

function txF_Fee (txF) { // {{{1
  return new BigNumber(txF.length).dividedBy(config.UPLOAD_DIVISOR).toFixed(7)
}

function txF_CreatorAddress () { // {{{1
  return process.env.TXF_CREATOR;
}

function txF_CreatorSecret () { // {{{1
  return process.env.TXF_CREATOR_SECRET;
}
// }}}1
export { txF_Fee, txF_CreatorAddress, txF_CreatorSecret, signedFeeXDR } // to test
