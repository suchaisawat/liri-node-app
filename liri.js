require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var argument = process.argv[2];
var content = process.argv[3];

//
//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);
Condition(argument, content);

function Condition(argument, content) {
	switch (argument) {
		case 'movie-this':
			fetchmovie();
			break;
		case 'spotify-this-song':
			fetchsong();
			break;
		case 'my-tweets':
			runtwitter();
			break;
		case 'do-as-it-said':
			doWhatIsaid();
			break;
		default:
			console.log("Something went horribly wrong...");
	}
}

function fetchmovie(content) {
	var argument = process.argv[2];
	var content = process.argv[3];
	if (content === null) {
		title = 'Mr. Nobody';
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + content + "&y=&plot=short&apikey=trilogy";
	// This line is just to help us debug against the actual URL.
	console.log(queryUrl);
	request(queryUrl, function (error, response, body) {
		// If the request is successful
		if (!error && response.statusCode === 200) {
			// Parse the body of the site and recover just the imdbRating
			// (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			console.log("Title: " + JSON.parse(body).Title + "\r\n");
			console.log("Release Year: " + JSON.parse(body).Year + "\r\n");
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating + "\r\n");
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\r\n");
			console.log("Country where the movie was produced: " + JSON.parse(body).Country + "\r\n)");
			console.log("Language of the movie: " + JSON.parse(body).Language + "\r\n");
			console.log("Plot: " + JSON.parse(body).Plot + "\r\n");
			console.log("Actors: " + JSON.parse(body).Actors + "\r\n");
			console.log("\n------------------------\n");
			appendFile("Title: " + JSON.parse(body).Title + "\r\n");
			appendFile("Release Year: " + JSON.parse(body).Year + "\r\n");
			appendFile("IMDB Rating: " + JSON.parse(body).imdbRating + "\r\n");
			appendFile("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\r\n");
			appendFile("Country where the movie was produced: " + JSON.parse(body).Country + "\r\n)");
			appendFile("Language of the movie: " + JSON.parse(body).Language + "\r\n");
			appendFile("Plot: " + JSON.parse(body).Plot + "\r\n");
			appendFile("Actors: " + JSON.parse(body).Actors + "\r\n");
			console.log("\n------------------------\n");
		}
	});
}

function appendFile(appendData) {
	fs.appendFile('log.txt', appendData, function (error) {
		if (error) {
			return console.log(error);
		}
	})
}

function fetchsong(song) {
	var spotify = new Spotify({
		id: process.env.SPOTIFY_ID,
		secret: process.env.SPOTIFY_SECRET
	});
	var song = process.argv[3];
	if (song == "") {
		song = "I want it that way!"
	}
	var PlaySong = song;
	spotify.search({
		type: "track",
		query: PlaySong
	}, function (err, data) {
		if (!err) {
			var songInfo = data.tracks.items;
			for (var i = 0; i < 5; i++) {
				if (songInfo[i] != undefined) {
					var spotifyResults =
						"Here's the Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Here's the Song: " + songInfo[i].name + "\r\n" +
						"Here's the Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Check out this Preview Url: " + songInfo[i].preview_url + "\r\n" +
						"------------------------------ " + i + " ------------------------------" + "\r\n";
					console.log(spotifyResults);
					appendFile(spotifyResults);
				}
			}
		} else {
			console.log("Error :" + err);
			return;
		}
	});
}

function doWhatIsaid() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		// If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}
		var dataArr = data.split(",");
		var userCommand = dataArr[0];
		var mySong = dataArr[1];
		console.log(mySong);
		console.log("You requested " + mySong + "\r\n");
		console.log("\n------------------------\n");
		appendFile("You requested " + mySong + "\r\n");
		Condition(userCommand, mySong);


	});
}

function runtwitter(tweet) {
	var tweet = process.argv[3];
	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});
	var params = {
		screen_name: 'nodejs'
	};
	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (!error) {
			for (var i = 0; i < 20; i++) {
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
			}
		}
	});
};
