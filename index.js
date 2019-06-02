const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const app = express();

let wiki_search = 'https://ro.wikipedia.org/w/api.php?action=opensearch&format=json&search='; 
let wiki_content = 'https://ro.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvsection=0&titles=';
//Set static folder https://ro.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.nextTick.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

var options = {
    host: 'www.google.com',
    port: 80,
    path: '/index.html'
  };

app.post('/', function(req, res) {
    let search = req.body.name;
    search = search.replace(/ /g, '%20');
    request(wiki_search + search, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            let $ = cheerio.load(html);
            const search_result = JSON.parse($('body').html().replace(/&quot;/g,'"'));
            console.log(search_result);
            res.send(search_result);
            //let search_list = search_result[1]; 

            // for(let i = 0 ; i < search_list.length; i++) {
            //     let query = search_list[i].replace(/ /g, '%20');
            //     request(wiki_content + query, (error, response, html) => {
            //         if(!error && response.statusCode == 200) {
            //             let $ = cheerio.load(html);
            //             let content_result = $('body').html().replace(/&quot;/g,'"').replace(/&apos;/g,"");
            //             console.log(content_result);
            //             //console.log(content_result.match(/"title":"(.*?)"/)[1]);
            //             //console.log(content_result.match(/"\*":"{{(.*)"/)[1]);
            //             //console.log(JSON.parse(content_result));
            //         }
            //         else {
            //             res.send("Nu s-a putut gasi nimic");
            //         }
            //     })
            // }
            
        }
        else {
            res.send("Nu s-a putut gasi nimic");
        }
    });
});

