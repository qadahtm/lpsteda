# Live Programming for Spatio-Textual Exploratory Data Stream Analysis

This project aims to build a live programming platform for data analytics over spatio-textual data streams.  

## Build from Souce
### Mac/Linux
The project comes with an sbt launcher script. With this script, you don't need to have sbt installed. First, clone the git repo, using the following command: 
```sh
$ git clone https://github.com/qadahtm/sfsserver
```
Next, build the project using:
```sh
$ ./sbt pack
```
Scripts for launching the webserver will be avaible in `./target/pack/bin` directory.
### Windows
You will need sbt installed. Refer to the following url: http://www.scala-sbt.org/release/tutorial/Installing-sbt-on-Windows.html