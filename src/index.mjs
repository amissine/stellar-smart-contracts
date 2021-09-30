import { promises } from 'fs'
import fetch from 'node-fetch'

export default async function mw (req) {
  return await handleRequest(req).catch(e => `- err ${e}`);
}

const txfAgentURL = dev => dev ? 'http://127.0.0.1:8766' :
  'https://txf-agent.alec-missine.workers.dev'

async function handleRequest(req) {
  const buf = await promises.readFile(req)
  const params = new URLSearchParams()
  params.set('fn', encodeURIComponent(buf.toString()))

  const response = await fetch(
    txfAgentURL(false), 
    {
      headers: new Headers([
        ['Authorization', `Basic ${signedFeeXDR()}`],
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
