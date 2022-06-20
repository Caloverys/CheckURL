const result = document.querySelector('#result')
const textarea = document.querySelector('#textarea')
//Add click EventListenr for paste button
document.querySelector('.paste').addEventListener('click', function() {
    textarea.focus()
  navigator.clipboard.readText().then(content => {
    textarea.innerHTML += content
  }).catch(i=>{ return false } )

})
textarea.addEventListener('input', function() {

})
//Add click EventListener for format button which let it trigger format function when user click the button.

document.querySelector('.format').addEventListener('click', format)
//Add click EventListener for clear button
document.querySelector('.clear').addEventListener('click', function() {
  //clear all the value for textarea and result section
  textarea.innerHTML = ""
  result.innerHTML = ''
  //Update the numebr of passed URL section which will set to 0
  update()

})
//Add click EventListenr for check button which will trigger the function check to check if the URL passed
document.querySelector('.check').addEventListener('click', check)
//Add click EventLister for copy button which will copy all the passed URL to clipboard
document.querySelector('#copy').addEventListener('click', () => {
  //put content of result to clipboard
  navigator.clipboard.writeText(result.textContent);
  /*Unfortunately  chrome doesn't support document.selection, it is a microsoft function,
  use window.getSelection instead for Chrome*/

  //Highlight the content in result (the content going to be copied)
  if (document.selection) {
    const range = document.body.createTextRange();

    range.moveToElementText(result);
    range.select();
  } else {
    //highlight all the a tag in  #result 
    console.log('hi')
    const select = window.getSelection();
    const range = document.createRange();
    console.log(result)
    range.selectNodeContents(result);
    select.removeAllRanges();
    select.addRange(range)
  }
})
//Give click EventListener for checkvalid button which will check if the passed URL is a valid image URL
function addEvent(){
document.querySelector('#check_valid').addEventListener('click', function() {
  update();

  //Loop through all the passed URL
  const existedurl = result.querySelectorAll('a')
  const brList = result.querySelectorAll('br')
  if( existedurl == 0)   document.querySelector('#number div').textContent = existedurl.length
  existedurl.forEach((item,i)=>{
    //Check if the URL is valid image URL by assigning each URL to the href of the img tag
    const img = new Image()
    img.src = item.href
    //if img onerror event fire (the url is not valid image URL ), then remove the url and its following br from the result
    img.onerror = () => {
      item.remove()
      brList[i].remove()
    }

    if (i === 0)
      //use setTimeout here in order to give broswer sometimes to load the image 
      setTimeout(() => document.querySelector('#number div').textContent = [...document.querySelector('#result').querySelectorAll('a')].length, 300)

  })

})
}

function update() {
  const content = ''
  if (textarea.innerHTML == "" && !document.querySelector('#wrap')) {
    //Give the check_valid button the parent element wrap which add pointer-events:not-allowed to it
    document.querySelector('#check_valid').outerHTML = `
            <div id='wrap'>
            <button id='check_valid' >Check Valid Image</button>
            </div>
            `
    document.querySelector('.remove_failed').style.display = 'none'

  }
  document.querySelector('#number div').textContent = [...result.querySelectorAll('a')].length
}

function format() {

  //update()
  let allcontent = textarea.textContent.trim().toLowerCase()

  //remove empty item in array caused by the split
  //use /(https:\/\/)/g (\/\/ is //)capture group in regular expression, we are able to run the split method  without removing the delimiters which is https:// 
  const splitarray = allcontent.split(/(https:\/\/)/g)
  //remove the first item in splitarray, which is either nothing ("") or strings that does't have https
  splitarray.shift()
  const urlarray = []
  //now the splitarray contain array like [delimiter, followingstring] (e.g. ['https://', 'www.google.com']), sowe need to combine them
  for (let i = 0; i < splitarray.length; i += 2) urlarray.push(splitarray[i] + splitarray[i + 1])
  textarea.innerHTML = ""
  //loop over the urlarray and put each item in urlarray to span
  for (let i in urlarray) {
    let spantag = document.createElement('span')
    spantag.id = `span${i}`
    spantag.innerHTML = urlarray[i]
    textarea.appendChild(spantag)
    textarea.appendChild(document.createElement('br'))
    textarea.appendChild(document.createElement('br'))

  }
}
async function check() {
  await checkurl();
  result.innerHTML = ''
  //loop through every passed item and put it to the a tag 
  document.querySelectorAll('.pass').forEach(item => {
    let a = document.createElement('a')
    a.href = item.textContent
    a.target = "_blank"
    a.textContent = item.textContent
    //item.textContent.length < width ? a.textContent = item.textContent : a.textContent = item.textContent.substring(0,width)+"..."
    result.appendChild(a)
    result.appendChild(document.createElement('br'))
  })
  update()

}
async function checkurl() {
  //wait for format function to finish and then execute following function 
  await format()
  const allvalue = document.querySelectorAll('#textarea span')
  allvalue.forEach((i, index) => {
    const content = i.innerText
    let isValid = false;


    /*
    https? (could also be written as http(s)? where "s" is optional. This matches http or https (the URL scheme)
    two '\/' ('\/\/') match two "//" (the \ (backslash) is escaping character in regular expression
    (https?:\/\/.)?(www\.) match https:// or www. or http://
    ? is the optional quantifier in regular expression
    [-a-zA-Z0-9@:%._\+~#=] refers to all the character set that possible appear in the domain name  that include A - Z a - z 0 - 9 @ : % . _ \ + ~ # =
    {2,256} refers to 2 - 256 times which means the regular expression will only match URL with domain name that less than 256 length 
    \. is refers to dot  (.) which is the segmentation  between top-level domain and domain name
    the "\" (backslash) is escaping character in regular expression
    [a-z]{2,6} refers to the character possible（a-z)  (length between 2 to 6 character) appear in top level domains (TLDs) like .com/.ca/.org
    [-a-zA-Z0-9@:%_\+.~#?&//=] match subdirectory (parameter) that includes A - Z a - z 0 - 9 @ : % . _ \ + ~ # = 
    * match 0 or more characters
    [-a-zA-Z0-9@:%_\+.~#?&//=]* match any length of A - Z a - z 0 - 9 @ : % . _ \ + ~ # =  for infinite times
    /g matches a global search that matches all occurrences. Since my above code has split the URL one by one, it is not necessary here
    */

    // The '/' at beginning to represent the regular expression
    const reg = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g


    //The above regular expression have a problem where it will still return true if we miss the top-level domain (like https://googl will still be right)
    const a = document.createElement('a')
    a.href = content;
    //a.host name return something like www.google.comm.
    //check if the hostname has www., if has remove it (replace with nothing)     
    const hostname = a.hostname.includes('www.') ? a.hostname.replace('www.', "") : a.hostname
    //by checking if the top level domain existed (com), the result will be more accurate
    if (hostname.split('.').length === 2) isValid = true
    //String.match() return an an array with the macthed part and return null if no content matched
    //check first here to avoid error in the next if statement (content.match(reg)[0] === content)
    if (!content.match(reg)) i.classList.add('fail')
    else 
      //use [0] here because content.match return array which is different than string so need to convert to string
      content.match(reg)[0] === content && isValid ? i.classList.add('pass') : i.classList.add('fail')
    


    const failed = document.querySelector('.remove_failed')
    //make remove_failed item visible
    failed.style.display = 'revert'
    //Add click EventListener for failed button which will remove all the item in textarea with failed class
    failed.addEventListener('click', function() {
      const faileditem = textarea.querySelectorAll('.fail')
      if (faileditem) faileditem.forEach(i => i.remove())
    })
  })
  //Check if wrap existed
  if (document.querySelector('#wrap')) {
    //remove the parent element but keep the child element, the goal of it is to remove the parent div for check valid image
    //By removing the parent wrap, we remove the cursor: not-allowed for the check_valid button
    document.querySelector('#wrap').replaceWith(...wrap.childNodes)
    document.querySelector('#check_valid').style.cssText = `
         position: absolute;
         left: 50%;
         top: 90%;
         `
    addEvent()
  }
}










