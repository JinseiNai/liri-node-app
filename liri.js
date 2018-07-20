let dotenv = require("dotenv").config();
let keys = require("./keys");
let request = require('request');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let command = process.argv[2];
let songName = '';
let nodeArgs = process.argv;

for (i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        songName = songName + "+" + nodeArgs[i];
    } else {
        songName += nodeArgs[i];
    }
}

switch (command) {
    case 'my-tweets':
        getTweet();
        break;

    case 'spotify-this-song':
        getSongInfo();
        break;

    case 'movie-this':

        break;

    case 'do-what-is-says':

        break;
}

function getTweet() {
    // let params = {screen_name: 'Karubin2', count: 20};
    client.get('search/tweets', { q: 'Karubin2', count: 20 }, function (error, tweets, response) {
        if (error) {
            console.log(error);
        }

        if (!error) {
            for (i = 0; i < tweets.statuses.length; i++) {
                console.log(tweets.statuses[i].text);
            }
        }
    });
}

function getSongInfo() {
    spotify.search({ type: 'track', query: songName, limit: 1}, function(err, data) {
        if (err) {
            console.log('Error occured: ' + err);
        }

        console.log(data.tracks.items[0].album);
    })
}