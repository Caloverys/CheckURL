# CheckURL
An application developed to check if the HTML url is valid 
This is the application I made inspire by the way of use image.onload and image.onerror to check if an image url is valid or not.
I start to think if it is possible to test if any url is valid and exlude the url that will cause 404 URL.



Unfortunately, after doing some study, I found that it is impossible to test the url valid and it is only possible for us to test if the url has the right format by using the regular expression.



It seems that is used to be possible to test by usign Fecth API or send XML HttpRequest to the URL you want to test, but unfortunately, the broswer (Not sure on other broswer, but doesn't work for Chrome) has new CORS policy, it will produce error:



Access to fetch at ____ from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS 



If you set mode:no-cors for fetch API, it will work, but the fecth API will always give back no response status code 0 which doesn't make sense. It is also impossible to use jQuery $.ajax() function.



I guess the only solutation on client-side is we could check if the data-structure is correct or use other API to test it. Node.js has method called require("url") to test if URL is valid or we could use external libraray like valid_url, but they are all for server-side.




Code, I tried to test the URL, check [here](https://github.com/Caloverys/CheckURL/blob/main/testURL.js).



Actually, by banning the no-cors doesn't make sense since mode:no-cors tell broswer to block the frontend JavaScript code from seeing contents of the response body and headers under all circumstances.



