#!/usr/bin/env node

// See also: {{{1
// https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm

import express from 'express'
import fileUpload from 'express-fileupload'
import mw from '../src/index.mjs'

const app = express()

app.use(express.static('public'))
app.use(fileUpload())

app.get('/', (req, res) => { // {{{1
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => { // {{{1
  let myfile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "myfile") is used to retrieve the uploaded file
  myfile = req.files.myfile;
  uploadPath = './uploaded/' + myfile.name;

  // Use the mv() method to place the file somewhere on your server
  myfile.mv(uploadPath, async err => {
    if (err)
      return res.status(500).send(err);

    let result = await mw(uploadPath).catch(e => console.error(e))
    console.log(`- result: ${result}`)
    res.send(`File uploaded: ${uploadPath}`);
  })
})

const server = app.listen(5000, () => { // {{{1
  let sa = server.address()
  console.log('- listening at http://%s:%s', sa.address, sa.port)
})