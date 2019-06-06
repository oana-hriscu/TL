const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const fetch = require('node-fetch');
let cheerio = require('cheerio');
const nlp = require('compromise');
const app = express();
let wtf = require('wtf_wikipedia');


let ocup = ["artist", "artistă", "pictor", "rege", "regele", "astronaut", "pilot", "compozitor", "compozitoare", "muzician", "muziciană", "președinte", "președintele", "președinta", "politician", "om politic", "președintă", "regina", "regină", "cântăreață", "cântăreț", "pictoriță", "economist", "economistă", "afacerist", "afaceristă", "om de știință", "autor", "autoare", "scriitor", "scriitoare", "lingvist", "lingvistă", "filozof", "filosof", "filosoafă", "filozoafă", "actor", "actriță", "poet", "poetă", "grup", "trupă", "matematician", "matematiciană", "astronom", "astronomă"];

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

function occupations(short_text) {
    for(let i=0; i<ocup.length; i++){
        if(short_text.includes(ocup[i])){
            return ocup[i];
        }
    }
    return 0;
}

function refineList(res_list) {
    let i = 0
    while(i < res_list[2].length) {
        let res = nlp(res_list[2][i]).people().out('text');
        
        if(res.length === 0) {
            res_list[1].splice(i, 1);
            res_list[2].splice(i, 1);
            res_list[3].splice(i, 1);
        }
        else {
            let occ = occupations(res_list[2][i]);
            let query = res_list[1][i];
            if(occ === 0) {
            res_list[1].splice(i, 1);
            res_list[2].splice(i, 1);
            res_list[3].splice(i, 1);
            }
            else {
                res_list[4].push(occ);
                i++;
            }
        }
    }
}

// function imageExtract(search_result, callback) {
//     let photolist = [];
//     for(let i = 0 ; i < search_result[3].length; i++) {
//         request(search_result[3][i], (error, response, html) => {
//             if(!error && response.statusCode == 200) {
//                 let $ = cheerio.load(html);
//                 let content_result = $('.infocaseta').find('tbody').html();
//                 let jay = html2json(content_result);
//                 let strJay = JSON.stringify(jay);
//                 let image = strJay.match(/"src":"(.*?)"/i)[1];
//                 //console.log(image);
//                 //photolist.push(image);
//                 return callback(image, false);
//             }
//             else {
//                 return callback(null, error);
//             }
//         })
//     }
//     return photolist;
// }

app.post('/', function(req, res) {
    let search = req.body.name;
    search = search.replace(/ /g, '%20');
    request(wiki_search + search, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            let $ = cheerio.load(html);
            const search_result = JSON.parse($('body').html().replace(/&quot;/g,'"'));

            search_result.push.apply(search_result, [[]]);
            search_result.push.apply(search_result, [[]]);
            search_result.push.apply(search_result, [[]]);

            refineList(search_result);

            for(let i=0; i<search_result[1].length; i++) {
                search_result[5].push('face.jpg');
                search_result[6].push({});
            }

            wtf.fetch(search_result[1]).then((docList) => {
                let infoboxes = docList.map(doc => {
                    let obj = {};
                    
                    if (!doc.infobox(0)) {
                        console.log(doc.title() + ' - no infobox');
                    } else {
                        obj = doc.infobox(0).keyValue();
                    }
                    console.log(doc.images(0).json());
                    search_result[5][search_result[1].indexOf(doc.title())] = String(doc.images(0).json()['thumb']);
                    search_result[6][search_result[1].indexOf(doc.title())] = {born: obj.born || obj.birth_date, died: obj.died || obj.death_date};

                    return {
                        name: doc.title() || obj.name
                    }
                });

                //console.log(infoboxes);
                console.log(search_result);
                res.send(search_result);
            });
        }
        else {
            res.send("Nu s-a putut gasi nimic");
        }
    });
});


