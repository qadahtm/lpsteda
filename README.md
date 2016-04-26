# Live Programming for Spatio-Textual Exploratory Data Stream Analysis

This project aims to build a live programming platform for data analytics over spatio-textual data streams.  

## Build from Souce
### Mac/Linux
The project comes with an sbt launcher script. With this script, you don't need to have sbt installed. First, clone the git repo, using the following command: 
```sh
$ git clone https://github.com/qadahtm/lpsteda
```
Next, build the project using:
```sh
$ ./sbt pack
```
Scripts for launching the webserver will be avaible in `./target/pack/bin` directory.
### Windows
You will need sbt installed. Refer to the following url: http://www.scala-sbt.org/release/tutorial/Installing-sbt-on-Windows.html

## External APIs

### Mapbox API Configuration
Some code requires API access to some online web services. For example, we (currently) use  Mapbox for tile dataset. You need to create a file called `api.js` and place it in the `ui/public/js` directory
```javascript
var mapboxapi = {
	accessToken: "your access token",
	pid: "your project id"
	};
```

### Twitter API configuration

By default, the integration with Twitter's streaming API is disabled. To make the live twitter streaming work, you need to modify the configuration file called `twitter.conf` with correct values from your Twitter's API credentials. This config file should be placed in the same direcotry of the project. 

```
twitter.api {
	enabled = true, // enables Twitter's API intergration
	consumerKey = "your consumer key here", 
	consumerSecret= "your consumer secret here",
	token = "your access token here", 
	secret = "your access token secret here" 
}
```