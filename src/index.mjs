import { promises } from 'fs' // {{{1
import fetch from 'node-fetch'
import BigNumber from 'bignumber.js'
import { config } from './config.mjs'
import * as sscu from './stellar-smart-contract-utils.mjs'

export default async function mw (path, ...args) { // {{{1
  switch (path) {
    case '/list-all-keys':
      return await listAllKeys().catch(e => `- err ${e}`);
    case '/delete':
      return await deleteKey(args[0]).catch(e => `- err ${e}`);
  }
  return await handleRequest(path).catch(e => `- err ${e}`);
}

const txfAgentURL = dev => dev ? 'http://127.0.0.1:8766' :
  'https://txf-agent.alec-missine.workers.dev'

const txF_CreatorUrl = dev => dev ? 'http://127.0.0.1:6000' : 'FIXME: txF_CreatorUrl'

async function deleteKey (key) { // {{{1
  const fee = new BigNumber(config.feeDeleteTxf).toFixed(7)
  return await fetch(`${txfAgentURL(false)}/${key}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${await signedFeeXDR(fee)}`,
      },
    })
  .then(async response => await response.text());
}

async function listAllKeys () { // {{{1
  return await fetch(`${txfAgentURL(false)}/list`)
  .then(async res => (await res.json()).concat([process.env.TXF_CREATOR]));
}

async function handleRequest(path) { // {{{1
  const buf = await promises.readFile(path)
  const txF = buf.toString()
  const fee = txF_Fee(txF)
  console.log(`- txF_Fee is ${fee}`)

  const params = new URLSearchParams()
  params.set('txF', txF)

  const response = await fetch(
    txfAgentURL(false), 
    {
      headers: {
        Authorization: `Basic ${await signedFeeXDR(fee)}`,
      },
      method: 'POST', 
      body: params
    })

  const contentType = response.headers.get('content-type')
  const data = contentType == 'text/plain;charset=UTF-8' ? await response.text()
    : await response.json();
  return data;
}

async function signedFeeXDR (fee) { // {{{1
  const params = new URLSearchParams()
  params.set('fee', fee.toString())
  return await fetch(txF_CreatorUrl(true), { method: 'POST', body: params })
  .then(async response => await response.text());
}

function txF_Fee (txF) { // {{{1
  return new BigNumber(txF.length).dividedBy(config.UPLOAD_DIVISOR).toFixed(7)
}
// }}}1
export { txF_Fee, signedFeeXDR } // to test
