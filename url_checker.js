let response;
const result = document.querySelector('#result')
const textarea = document.querySelector('#textarea')

document.querySelector('.paste').addEventListener('click', function() {
  navigator.clipboard.readText().then(content => {
    textarea.innerHTML = content
  })

})
document.querySelector('.format').addEventListener('click', format)
document.querySelector('.clear').addEventListener('click', function() {
  textarea.innerHTML = ""
  result.innerHTML = ''
  update()
  changebutton()

})
document.querySelector('.check').addEventListener('click', check)
document.querySelector('#copy').addEventListener('click', () => {
  changebutton()
  navigator.clipboard.writeText(result.textContent);
  /*Unforunately chrome doesn't support document.selection, it is a microsoft function, use window.getSelection instead for Chrome*/
  if (document.selection) {
    const range = document.body.createTextRange();
    range.moveToElementText(result);
    range.select();
  } else {
    const select = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(result);
    select.removeAllRanges();
    select.addRange(range)
  }
  result.textContent == "" ? create('No Content') : create("Copied" + result.textContent)

})
document.querySelector('#check_valid').addEventListener('click', function() {
  changebutton();
  result.querySelectorAll('a').forEach((i, index) => {
    const img = new Image()
    img.src = i.href
    img.onerror = () => {
      result.querySelectorAll('a')[index].remove()
      result.querySelectorAll('br')[index].remove()
    }
    if (index === result.querySelectorAll('a').length - 1)
      document.querySelector('#number div').textContent = [...document.querySelector('#result').querySelectorAll('a')].length
  })
})

function changebutton() {
  let content = ''
  if (textarea.innerHTML == "" && !document.querySelector('#wrap')) {
    console.log(document.querySelector('#check_valid').outerHTML)
    document.querySelector('#check_valid').outerHTML = `
            <div id='wrap'>
            <button id='check_valid' >Check Valid Image</button>
            </div>
            `
    document.querySelector('.remove_failed').style.display = 'none'
  }
}

function update() {
  changebutton()
  document.querySelector('#number div').textContent = [...result.querySelectorAll('a')].length
}

function format() {
  changebutton()
  let allcontent = textarea.textContent.trim().toLowerCase()
  const data = [...allcontent.matchAll(new RegExp('http', "gi"))].map(i => i.index)
  if (data.length === 0) {
    create("No Content or valid URL with right starting (HTTP)")
    return
  }
  let urlarray = allcontent.split("http")
  //remove empty item in array caused by the spit
  urlarray = urlarray.filter(i => i !== "")
  console.log(urlarray)
  urlarray = urlarray.map((item, index) => {
    return (data[0] !== 0 && index === 0 ? item : `http${item}`)
  })
  textarea.innerHTML = ""
  for (let i in urlarray) {
    let spantag = document.createElement('span')
    spantag.id = `span${i}`
    spantag.className = 'element'
    spantag.innerHTML = urlarray[i]
    textarea.appendChild(spantag)
    //let br =document.createElement('br')
    //br.className = 'customlinebreak'
    textarea.appendChild(document.createElement('br'))
    textarea.appendChild(document.createElement('br'))

  }
}
async function check() {
  await checkurl();
  result.innerHTML = ''
  document.querySelectorAll('.pass').forEach(item => {
    let a = document.createElement('a')
    a.href = item.textContent
    a.target =
      item.textContent.length < 93 ? a.textContent = item.textContent : a.textContent = item.textContent.substring(0, 93) + "..."
    result.appendChild(a)
    result.appendChild(document.createElement('br'))
  })
  changebutton()
  update()

}
async function checkurl() {
  await format()
  const allvalue = document.querySelectorAll('.element')
  allvalue.forEach((i, index) => {
    let content = i.textContent
    if (content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))
      i.classList.add('pass')
    else
      i.classList.add('fail')
    let failed = document.querySelector('.remove_failed')
    failed.style.display = 'revert'
    failed.addEventListener('click', function() {
      const faileditem = textarea.querySelectorAll('.fail')
      if (faileditem.length === 0)
        create("No failed item")
      faileditem.forEach(i => {
        i.remove();
        create("All Red URL Removed")
      })
    })
  })
  const wrap = document.querySelector('#wrap')
  if (wrap) {
    wrap.replaceWith(...wrap.childNodes)
    document.querySelector('#check_valid').style.cssText = 'position: relative; left: calc(56vw);'
  }
  textarea.textContent == "" ? create('No Content') : create("Finished")
}

const create = mes => {
  if (document.querySelector('.message'))
    document.querySelector('.message').remove()
  if (mes.length > 80)
    mes = mes.substring(0, 80) + '...'
  const message = document.createElement('div')
  message.className = 'message'
  message.textContent = mes || "No Content Received"
  document.body.appendChild(message)
  const timeout = setTimeout(() => message.remove(), 1500)
}
