const keys = document.getElementById('keys') // {{{1
const cogs = document.getElementById('cogs')
const selectKeyUI = document.getElementById('selectKeyUI')
let owner

listAllKeys()

function deleteKey () { // {{{1
  for (const key of keys.children) {
    if (key.selected) {
      if (key.value.split(' ')[1] != owner) {
        alert('You are not the owner.')
      } else {
        fetch(`${location}delete/${key.value.split(' ')[0]}`)
        .then(response => response.json())
        .then(a => {
          alert(a)
          selectKeyUI.hidden = true
          cogs.hidden = false
          listAllKeys()
        })
      }
    }
  }
}

function listAllKeys () { // {{{1
  fetch(`${location}list-all-keys`)
  .then(response => response.json())
  .then(a => {
    owner = a.pop()
    while (a.length > 0) {
      const key = a.shift(), keyOwner = a.shift()
      let opt = document.createElement("option")
      opt.value = `${key} ${keyOwner}`
      opt.text = `${key.slice(0, 9)}…${key.slice(-9)}`
      keys.add(opt)
    }
    cogs.hidden = true
    selectKeyUI.hidden = false
  })
}

function upload () { // {{{1
  const form = document.getElementById('form')
  const path = document.getElementById('file')
  if (path.value.length > 0) {
    form.submit()
  } else {
    alert('Please select your txFunction.')
  }
}
