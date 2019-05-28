const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const app = express();

//Set static folder

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.nextTick.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

var options = {
    host: 'www.google.com',
    port: 80,
    path: '/index.html'
  };

app.post('/test/submit', function(req, res) {
    let id = req.body.search_bar;
    id = id.replace(/<a href="(.*?)" ping/g, '+');

    request('https://www.google.com/search?q='+id+'&num=5&lr=lang_ro', function (error, response, body) {
        //console.error('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log(typeof body); // Print the HTML for the Google homepage.
        let re = /<a href="(.*?)"/g;
        let findall;
        do {
            findall = re.exec(body);
            if (findall) {
                console.log(findall[1]);
            }
        } while (findall);
        

    });
});
