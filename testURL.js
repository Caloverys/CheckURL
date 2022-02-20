//Use Fetch.API 
fetch(url).then(response =>{
   if(response.ok){
    alert('it worked')
   }
   else{
  throw new Error('Something went wrong');
   }
   })
/* Produce error:
Access to fetch at _____ from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. 
If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled*/


//Banned the no-cors
    fetch(url,{
        mode: 'no-cors'}).then(response =>{
        if(response.ok){
            alert('it worked')
          }
         else{
          console.error('Something went wrong');
          }
        })
/*Always throw error and status code is alaways 0 no matter whether the url is valid.*/


//Send XML HTTP request
var reader = new XMLHttpRequest();
reader.open('get', url, true);
reader.onreadystatechange = function(){
 if (reader.readyState === 4) 
  reader.status == 200 ? console.log("page exists"):  alert("No use going there!");
} 
reader.send()

/*Will produce error:
Access to XMLHttpRequest at ____ from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.*/


//use jQuery ajax function
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
function test(url){
  $.ajax({
    type: 'HEAD',
    url: url,
    success: function(){
      console.log("worked")
    },
    error: function() {
      console.error("Have error")
    }
  });
}

/*Also,  produce error:
Access to XMLHttpRequest at ___from origin 'null' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource*/

//For more details: check here: https://github.com/Caloverys/CheckURL/blob/main/README.md
