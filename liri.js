require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv.slice();
var command = input[2];

function myTweets(){
	var params = {screen_name:"Test4Camp"};
	client.get("statuses/user_timeline", params, function(error, tweets, response){
		if(!error){
			for(var i = 0; i < tweets.length; i++){
				console.log(tweets[i].text)
			}
		}else{
			console.log(error);
		}
	});
}

var songName = input[3];

function spotifyThis(songName){
	if(songName === undefined){
		songName = "The Sign";
		spotify.search({type: "track", query: songName + " By: Ace of Base"}, function(err, data){
		if(err){
			return console.log("There is an Error: " + err);
		}else{
			console.log(JSON.parse(data));
		}
	});
}
	spotify.search({type: "track", query: songName, limit: 1}, function(err, data){
		if(err){
			return console.log("There is an Error: " + err);
		}else{

			console.log("The Song: " + data.tracks.item[0].name);
			console.log("The Artist: " + data.tracks.item[0].album.artists[0].name);
			console.log("Link: " + data.tracks.item[0].preview_url);
			console.log("Album: " + data.tracks.item[0].album.name);
		}
	});
}

function movieThis(){
	var movieName = input[3];
	if(movieName === undefined){
		movieName = "Mr. Nobody";
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body){
		if(!error && response.statusCode === 200){
			console.log("Movie Title: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("Plot: " + JSON.parse(body).Plot);
		}
	});
}

function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data){
		if(error){
			return console.log(error);
		}else{
			var text = data;
			var textString = text.split(",");
			console.log(textString);
			songName = textString[1];
			command = textString[0];
			spotifyThis(songName);
		}
	});
}

switch(command){
	case "my-tweets":
	myTweets();
	break;
	case "movie-this":
	movieThis();
	break;
	case "spotify-this-song":
	spotifyThis(songName);
	break;
	case "do-what-it-says":
	doWhatItSays();
	break;

	default:
	console.log("Not a Command");
	break;
}