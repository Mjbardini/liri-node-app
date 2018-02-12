require("dotenv").config();

//code required to import the keys.js file and store it in a variable.
var keys = document.createElement('script');
keys.src = 'keys.js';
document.getElementsByTagName("head")[0].appendChild(x);
var argv = yargs.argv;
var command = argv._[0];

var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var yargs = require('yargs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//commands provided by user
var myTweets = 'my-tweets';
var spotifyThis = 'spotify-this-song';
var movieThis = 'movie-this';
var doWhatItSays = 'do-what-it-says';

let getTweets = () => { //my-tweets
  console.log('Fetching my Tweets! \n');
  //get request to twitter
  client.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?count=20`, function(error, tweets, response) {
    if (error)
      throw error; //error handling
    for (i = 0; i < tweets.length; i++) { //Loop through my Tweets, format them for humans.
      console.log(i + 1 + ': ' + tweets[i].created_at);
      console.log(tweets[i].text + '\n');
    }
  });
}

let searchSpotify = (song) => { //spotify-this
  console.log(`Searching spotify...`);
  //Simple request to Spotify API
  spotify.search({
    type: 'track', query: `${song}` //song is argv.song
  }, function(err, data) { //error handlings
    if (err) {
      return console.log(`Error occurred: ${err}`);
    }
    console.log(`Song: ${data.tracks.items[0].name}`); //Song title

    for (let i = 0; i < Object.keys(data).length; i++) {
      console.log(`Artist: ${data.tracks.items[i].album.artists[i].name}`); //Artist name
    }

    console.log(`Album: ${data.tracks.items[0].album.name}`) //Album name
    console.log(`Spotify Preview URL: ${data.tracks.items[0].preview_url}`); //Spotify preview URL

  });
}

let searchMovies = (movie) => { //movie-this
  console.log('Searching OMDB...');

  if (!movie) {
    movie = 'Mr. Nobody';
  }

  request(`https://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy&r=json&tomatoes=true`, function(error, response, body) {
    let data = JSON.parse(body);

    console.log(`Title: ${data.Title}`);
    console.log(`Year: ${data.Year}`);

    for (let i = 0; i < Object.keys(data.Ratings).length; i++) {
      if (data.Ratings[i].Source === 'Internet Movie Database' || data.Ratings[i].Source === 'Rotten Tomatoes') {
        console.log(`Rating: ${data.Ratings[i].Value} (${data.Ratings[i].Source})`);
      }
    }
    console.log(`Produced in ${data.Country}`);
    console.log(`Language: ${data.Language}`);
    console.log(`Plor: ${data.Plot}`);
    console.log(`Actors: ${data.Actors}`);

  });
}

let doIt = () => { //do-what-it-says
  fs.readFile("random.txt", "utf-8", function(err, data) {
    if (err) {
      console.log("error reading file:", error);
    } else {
      let doThis = data.split(',')[0];
      let arg = data.split(',')[1];
      doThis === myTweets
        ? getTweets()
        : doThis === spotifyThis
          ? searchSpotify(arg)
          : doThis === movieThis
            ? searchMovies(arg)
            : console.log('Do what?');
    }
  })
}

//When to run functions
command === myTweets
  ? getTweets()
  : command === spotifyThis
    ? searchSpotify(argv.song)
    : command === movieThis
      ? searchMovies(argv.movie)
      : command === doWhatItSays
        ? doIt()
        : console.log('please enter a valid command');