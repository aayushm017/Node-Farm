const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');  //exported from one module to another one

//////////////////////////////
//Creating Web Server
//FILES
// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //read 'the' file synchronously put the file to the object data and send object as a response
// const dataObj = JSON.parse(data);  //this will take a JSON code which is actually a string and it will automatically convert it into javascript..

// const server = http.createServer((req, res) => {
//     const pathName = req.url;


//     //Overview page
//     if (pathName === '/' || pathName === '/overview') {
        

//         res.end('This is the Overview');

//     //Product Page
//     } else if (pathName === '/product') {
//         res.end('This is the PRODUCT');

//     //API
//     } else if (pathName === '/api') {  //API sending back data of all products
//         res.writeHead(200, { 'Content-type': 'application/json' });  //we are telling the browser that we are sending JSON
//         res.end(data); //we have to send back data directly

//     //NOT FOUND
//     } else {
//         res.writeHead(404, {
//             'Content-type':'text/html',
//             'My-Own-Header':'hello-world'
//         });
//         res.end('<h1>Page Not Found!</h1>');
//     }
// });  //createServer will accept a callback function which will be fired off each time a new request is on Server.
// server.listen(8000, '127.0.0.1', ()=> {
//     console.log('Listening to requests on port 8000');
// });

/*
//Blocking Synchronous Way
//READ FILE
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');  //utf-8 is file encoding 
console.log(textIn);

//WRITE FILE
const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);  //we have to specify what we have to write i.e textOut
console.log('File written');
*/


//TODO: Non-Blocking, Asynchronous Way

//Read file
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR!🔥');
    
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => { //read the data1 as in data read this is the file name also
//         console.log(data2);

//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written😃');
//             })
//         });
//     });
// });
// console.log('Will read file!');



////////////////////////////
//SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
    const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
    const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');  //we couldn't do above 3  inside createServer callback function becoz if we had 1 million request at the same time then we would block the code 1 million time 1 fro each..

    const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); 
    const dataObj = JSON.parse(data);  
    const server = http.createServer((req, res) =>{
    
        const { query, pathname } = url.parse(req.url, true);

     //Overview page
        if (pathname === '/' || pathname === '/overview') {
         
        res.writeHead(200, { 'Content-type': 'text/html' });
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');  //replaceTemplate will take tempCard
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

     //Product Page
        } else if (pathname === '/product') {
            
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];  //this is the simpest way of retrieving an element based on query string.
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

     //API
        } else if (pathname === '/api') { 
            
        res.writeHead(200, { 'Content-type': 'application/json' });  
        res.end(data); 

     //NOT FOUND
        } else {
            
        res.writeHead(404, {
            'Content-type':'text/html',
            'My-Own-Header':'hello-world'
        });
        res.end('<h1>Page Not Found!</h1>');
    }
}); 
server.listen(8000, '127.0.0.1', ()=> {
    console.log('Listening to requests on port 8000');
});
