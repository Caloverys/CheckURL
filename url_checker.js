
        let response;
        const result = document.querySelector('#result')
        const textarea = document.querySelector('#textarea')
//Add click EventListenr for paste button 
document.querySelector('.paste').addEventListener('click',function(){   
        navigator.clipboard.readText().then(content=>{
               textarea.innerHTML = content
            })
       
        })
//Add click EventListener for format button which let it trigger format function when user click the button 
        document.querySelector('.format').addEventListener('click',format)
        //Add click EventListener for clear button 
        document.querySelector('.clear').addEventListener('click',function(){
            //clear all the value for textarea and result section 
               textarea.innerHTML = ""
               result.innerHTML = ''
               //Update the numebr of passed URL section which will set to 0
               update()
               changebutton()
            
        })
        //Add click EventListenr for check button which will trigger the function check to check if the URL passed
        document.querySelector('.check').addEventListener('click',check)
        //Add click EventLister for copy button which will copy all the passed URL to clipboard
        document.querySelector('#copy').addEventListener('click',()=>{
            changebutton()
            //put content of result to clipboard
            navigator.clipboard.writeText(result.textContent);
            /*Unforunately chrome doesn't support document.selection, it is a microsoft function, 
            use window.getSelection instead for Chrome*/

            //Highlight the content in result (the content going to be copied)
            if (document.selection) { 
                const range = document.body.createTextRange();
                range.moveToElementText(result);
                range.select();
            }else{
                const select = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(result);
                select.removeAllRanges();
                select.addRange(range)
            }
            result.textContent === "" ? create('No Content') : create("Copied"+result.textContent)
        })
        //Give click EventListener for checkvalid button which will check if the passed URL is a valid image URL 
        document.querySelector('#check_valid').addEventListener('click',function(){
            changebutton();
            //Loop through all the passed URL 
         result.querySelectorAll('a').forEach((i,index)=>{
            //Check if the URL is valid image URL by assigning each URL to the href of the img tag 
            const img = new Image()
           img.src = i.href
           //if img onerror event fire (the url is not valid image URL ), then remove dit from the result


           img.onerror = () =>{
                result.querySelectorAll('a')[index].remove()
                result.querySelectorAll('br')[index].remove() 
           } 


           if(index === result.querySelectorAll('a').length-1)
            document.querySelector('#number div').textContent = [...document.querySelector('#result').querySelectorAll('a')].length
         })
})
        function changebutton(){
            let content = ''
            if(textarea.innerHTML == "" && !document.querySelector('#wrap')){
                console.log(document.querySelector('#check_valid').outerHTML)
            document.querySelector('#check_valid').outerHTML = `
            <div id='wrap'>
            <button id='check_valid' >Check Valid Image</button>
            </div>
            `
            document.querySelector('.remove_failed').style.display = 'none'
        }
        }
        function update(){
            changebutton()
           document.querySelector('#number div').textContent = [...result.querySelectorAll('a')].length
        }
        function format(){
            changebutton()
            let allcontent = textarea.textContent.trim().toLowerCase()
            const data = [...allcontent.matchAll(new RegExp('http',"gi"))].map(i=>i.index)
            if(data.length === 0){
               create("No Content or valid URL with right starting (HTTP)")
                return
            }
            let urlarray = allcontent.split("http")
            //remove empty item in array caused by the spit
            urlarray = urlarray.filter(i=>i!== "")
            console.log(urlarray)
            urlarray = urlarray.map((item,index)=>{
             return (data[0] !== 0 && index ===0 ? item : `http${item}`)
            })
            textarea.innerHTML = ""
            for(let i in urlarray){
                let spantag = document.createElement('span')
                spantag.id=`span${i}`
                spantag.className = 'element'
                spantag.innerHTML = urlarray[i]
                textarea.appendChild(spantag)
                //let br =document.createElement('br')
                //br.className = 'customlinebreak'
                textarea.appendChild(document.createElement('br'))
                 textarea.appendChild(document.createElement('br'))
    
            }
        }
        async function check(){
             await checkurl();
             result.innerHTML = ''
             document.querySelectorAll('.pass').forEach(item=>{
                let a = document.createElement('a')
                a.href =item.textContent
                a.target =
                item.textContent.length < 93 ? a.textContent = item.textContent : a.textContent = item.textContent.substring(0,93)+"..."
                result.appendChild(a)
                result.appendChild(document.createElement('br'))
             })
             changebutton()
             update()

        }
        async function checkurl(){
            await format()
           const allvalue = document.querySelectorAll('.element')
          allvalue.forEach((i,index)=>{
            let content = i.textContent
            //This is the most important and core code in my application 
            /*
            https? match http or https (the URL scheme),  
            two '\/' match two "//" (the \ (backslash) is escaping character in regular expression
            (https?:\/\/.)?(www\.) match https:// or www. or http://
            ? is the optional quantifier in regular expression 
            [-a-zA-Z0-9@:%._\+~#=] refers to all the character set that possible appear in the second level domain that include A - Z a - z 0 - 9 @ : % . _ \ + ~ # = 
            {2,256} refers to 2 - 256 times which means the regular expression will match URL that only has  second level domain that less than 256 length will be correct 

            \. is refers to dot which is the segmentation  between top-level domain and second level domain
            [a-z]{2,6} refers to the character possible (length between 2 to 6 character) appear in top-level domain like .com/.ca/.org

            [-a-zA-Z0-9@:%_\+.~#?&//=] match subdirectory (parameter) that include A - Z a - z 0 - 9 @ : % . _ \ + ~ # = 
            * match 0 or more characters 
            [-a-zA-Z0-9@:%_\+.~#?&//=]* match any length of A - Z a - z 0 - 9 @ : % . _ \ + ~ # = 
            /g match a global search that match all occurances since the above code has split the URL and test one by one, it is necessary here



            */
            const reg = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
           console.log(content, content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))

           //use [0] here because content.match return array which is different than string so need to convert to string
            if (content.match(reg)[0] === content) {
                i.classList.add('pass')           
            }
            else
                i.classList.add('fail')
            let failed = document.querySelector('.remove_failed')
            failed.style.display = 'revert'
            failed.addEventListener('click',function(){
                const faileditem = textarea.querySelectorAll('.fail')
                if(faileditem.length === 0)
                create("No failed item")
                faileditem.forEach(i=>{
                    i.remove();
                    create("All Red URL Removed")
                })
            })
})
        const wrap = document.querySelector('#wrap')
        if(wrap){
         wrap.replaceWith(...wrap.childNodes)
         document.querySelector('#check_valid').style.cssText = 'position: relative; left: calc(56vw);'
     }
         textarea.textContent == "" ? create('No Content') : create("Finished")
}
        
        const create = mes =>{
            if(document.querySelector('.message')) 
                document.querySelector('.message').remove()
            if(mes.length > 80)
                mes = mes.substring(0,80) + '...'
            const message = document.createElement('div')
            message.className = 'message'
            message.textContent = mes || "No Content Received"
             document.body.appendChild(message)
             const timeout = setTimeout(()=>message.remove(),1500)
        }
    

    

