import { promises } from 'fs'
import fetch from 'node-fetch'

export default async function mw (req) {
  return await handleRequest(req).catch(e => `- err ${e}`);
}

const txFunctionURL = dev => dev ? 'http://127.0.0.1:8766' :
  'https://tx-functions.alec-missine.workers.dev/'

async function handleRequest(req) {
  const buf = await promises.readFile(req)
  const params = new URLSearchParams()
  params.set('fn', encodeURIComponent(buf.toString()))
  console.log(params)

  const response = await fetch(
    txFunctionURL(true), 
    {
      method: 'POST', 
      body: params
    }
  ).catch(e => `- err ${e}`)

  const contentType = response.headers.get('content-type')
  const data = contentType == 'text/plain;charset=UTF-8' ? await response.text()
    : await response.json();
  return data;
}
