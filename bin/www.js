#!/usr/bin/env node
// See also:
// https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

app.use(express.static('public'))
app.use(fileUpload())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.post('/upload', (req, res) => {
  let myfile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "myfile") is used to retrieve the uploaded file
  myfile = req.files.myfile;
  uploadPath = __dirname + '/../uploaded/' + myfile.name;

  // Use the mv() method to place the file somewhere on your server
  myfile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
})

const server = app.listen(5000, () => {
  let sa = server.address()
  console.log('- listening at http://%s:%s', sa.address, sa.port)
})
