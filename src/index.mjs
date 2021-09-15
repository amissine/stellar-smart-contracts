
export default async req => await handleRequest(req).
  then(res => res).
  catch(e => `- err ${e}`)

async function handleRequest(req) {
  return req;
}
