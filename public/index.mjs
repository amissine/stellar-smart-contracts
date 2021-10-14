const keys = document.getElementById('keys') // {{{1
const cogs = document.getElementById('cogs')
const selectKeyUI = document.getElementById('selectKeyUI')
let owner

listAllKeys()

function getInfo () { // {{{1
  const info = keys.value.split(' ')[1]
  console.log(info)
  alert(info)
}

function deleteKey () { // {{{1
  const v = keys.value.split(' '), info = JSON.parse(v[1])
  const key = v[0], keyOwner = info.signer
  if (keyOwner != owner) {
    alert('You are not the owner.')
  } else {
    selectKeyUI.hidden = true
    cogs.hidden = false
    fetch(`${location}delete/${key}`)
    .then(response => response.text())
    .then(result => {
      if (result == 'OK') {
        keys.options[keys.selectedIndex].remove()
        cogs.hidden = true
        selectKeyUI.hidden = false
      } else {
        alert(result)
      }
    })
  }
}

function listAllKeys () { // {{{1
  fetch(`${location}list-all-keys`)
  .then(response => response.json())
  .then(a => {
    owner = a.pop()
    while (a.length > 0) {
      const key = a.shift(), keyInfo = JSON.stringify(a.shift())
      let opt = document.createElement("option")
      opt.value = `${key} ${keyInfo}`
      opt.text = `${key.slice(0, 9)}…${key.slice(-9)}`
      keys.add(opt)
    }
    cogs.hidden = true
    selectKeyUI.hidden = false
  })
}

function upload () { // {{{1
  selectKeyUI.hidden = true
  cogs.hidden = false
  const form = document.getElementById('form')
  const path = document.getElementById('file')
  if (path.value.length > 0) {
    form.submit()
  } else {
    alert('Please select your txFunction.')
  }
}
