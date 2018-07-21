let dotenv = require("dotenv").config();
let keys = require("./keys");
let request = require('request');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let fs = require('fs');

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let command = process.argv[2];
let searchThis = '';
let nodeArgs = process.argv;

// If no argument (song or movie name)...then default one
if (!process.argv[3]) {
    switch(command) {
        case 'spotify-this-song':
        searchThis = 'The Sign';
        break;

        case 'movie-this':
        searchThis = 'Mr. Nobody';
        break;
    }
} else {
    for (i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            searchThis = searchThis + "+" + nodeArgs[i];
        } else {
            searchThis += nodeArgs[i];
        }
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
        getMovieInfo();
        break;

    case 'do-what-it-says':
        readText();
        break;
}

// Retrieves tweets
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

// Gets song info
function getSongInfo() {
    spotify.search({ type: 'track', query: searchThis, limit: 1 }, function (err, data) {
        if (err) {
            console.log('Error occured: ' + err);
        }

        console.log(`Artist(s): ${data.tracks.items[0].album.name}`);
        console.log(`Song Title: ${data.tracks.items[0].name}`);
        console.log(`Preview Link: ${data.tracks.items[0].preview_url}`);
        // Cannot find album name
        // console.log(data.tracks.items[0]);
    })
}

// Get movie info
function getMovieInfo() {
    let queryUrl = "https://www.omdbapi.com/?t=" + searchThis + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(`Movie Title: ${JSON.parse(body).Title}`);
            console.log(`Year: ${JSON.parse(body).Year}`);
            console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}`);
            console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);
        }
    })
}

// Do what it says
function readText() {
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err);
        }

        let dataArr = data.split(",");

        command = dataArr[0];
        searchThis = dataArr[1];

        switch (command) {
            case 'my-tweets':
                getTweet();
                break;
        
            case 'spotify-this-song':
                getSongInfo();
                break;
        
            case 'movie-this':
                getMovieInfo();
                break;
        }

    })
}