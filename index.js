const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const fetch = require('node-fetch');
let cheerio = require('cheerio');
const nlp = require('compromise');
const app = express();
let wtf = require('wtf_wikipedia');

let entryType = ["oraș", "magazin", "casă de", " sat ", "un județ", "un prenume", "se poate referi la", "este un nume", "este capitala"];


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

function entry_type(short_text) {
    for(let i=0; i<entryType.length; i++){
        if(short_text.includes(entryType[i])){
            return entryType[i];
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
            let occ = entry_type(res_list[2][i]);
            if(occ != 0) {
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
            //console.log(search_result);

            if (search_result[1].length === 0) {
                res.send(search_result);
            }
            else {
                for(let i=0; i<search_result[1].length; i++) {
                    search_result[5].push('face.jpg');
                    search_result[6].push({});
                }

                if(search_result[1].length < 2) {
                    wtf.fetch(search_result[1][0], 'en', function(err, doc) {
                        let obj = {};
                            
                        if (!doc.infobox(0)) {
                            console.log(doc.title() + ' - no infobox');
                        } else {
                            obj = doc.infobox(0).keyValue();
                            if(!doc.images(0).json()){
                                console.log('no image');
                            }
                            else {
                                search_result[5][search_result[1].indexOf(doc.title())] = String(doc.images(0).json()['thumb']);
                            }

                            search_result[6][search_result[1].indexOf(doc.title())] = {born: obj.data_nașterii || obj.birth_date, died: obj.data_decesului || obj.death_date};
                            //console.log(search_result);
                            res.send(search_result);
                        }
                    });

                }
                else {
                    wtf.fetch(search_result[1], 'en').then((docList) => {
                        let infoboxes = docList.map(doc => {
                            let obj = {};
                            
                            if (!doc.infobox(0)) {
                                console.log(doc.title() + ' - no infobox');
                                return {};
                            } else {
                                obj = doc.infobox(0).keyValue();
                                if(!doc.images(0)){
                                    console.log('no image');
                                }
                                else {
                                    search_result[5][search_result[1].indexOf(doc.title())] = String(doc.images(0).json()['thumb']);
                                }

                                search_result[4][search_result[1].indexOf(doc.title())] = doc.infobox(0)['_type'];
                                search_result[6][search_result[1].indexOf(doc.title())] = {born: obj.born || obj.birth_date, died: obj.died || obj.death_date};
        
                                return {
                                    name: doc.title() || obj.name
                                }
                            }
                        });
        
                        //console.log(infoboxes);
                        console.log(search_result);
                        res.send(search_result);
                    });
                }
            }
            
        }
        else {
            res.send("Nu s-a putut gasi nimic");
        }
    });
});

function yearDups(date, entry_list) {
    for(let i=entry_list.length-1; i>0;i--) {
        if(date === entry_list[i]['year']) {
            return i;
        }
    }
    return -1;
}

function descDups(info, entry_list) {
    for(let i=entry_list.length-1; i>0;i--) {
        if(info === entry_list[i]['description'])
            return false;
    }
    return true;
}

function validateInfo(info, date, birth, death) {
    if(date <= birth || date > death){
        return false;
    }

    if(info.indexOf(')') != -1 && info.indexOf('(') === -1) {
        return false
    }

    if(info.indexOf(')') != -1 && info.indexOf('(') != -1 && info.indexOf(')') < info.indexOf('(')) {
        return false
    }

    if (info[0] >= '0' && info[0] <= '9') {
        return false;
    }

    if (info[0] === ',') {
        return false;
    }

    if(info.length<20){
        return false;
    }

    if(info.indexOf('ISBN') != -1){
        return false;
    }

    if(info.indexOf('*') != -1){
        return false;
    }

    if(info.indexOf('|') != -1){
        return false;
    }

    return true;
    
}


app.get('/something', function (req, res) {
    let search = req.query.term;
    let birth = req.query.birth;
    let death = req.query.death;

    wtf.fetch(search, 'ro', function(err, doc) {
        let document = doc.text();
        let event = /(\d{1,2}) (ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie) (\d{4})|(\d{4})/gi;
        let eventList = [];

        while (match = event.exec(document)) {
            let start = match.index;
            let end = event.lastIndex;
            let date;

            if(match[3] === undefined) {
                date = match[4];
            }
            else date = match[3];
        
            let after = document.substring(end, end+500);
            let before = document.substring(start - 500, start);

            let entry = before.substring(before.lastIndexOf('.')+1) + match[0] + after.substring(0, after.indexOf('.'));
            entry = entry.replace(/\n/g, '');
            entry = entry.replace(/^\s+|\s+$/g, '');

            if(validateInfo(entry, date, birth, death)) {
                let yearDuplicate = yearDups(date, eventList);
                if (yearDuplicate!= -1) {
                    eventList[yearDuplicate]['description'].push(entry);
                }
                else if(descDups(entry, eventList)) {
                    eventList.push({year: date, description: [entry]});
                }
            }
        }
        
        eventList.sort(function(a, b){
            var keyA = a.year,
                keyB = b.year;
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        console.log(eventList);
        res.send(eventList);
    });
    
})

//list pt evenimentele care au loc in acelasi ani